import { decode as decodeHtmlEntities } from 'html-entities'

function guessTokenType(token) {
    if(token.startsWith('</')) {
        return 'tag end'
    }
    if(token.startsWith('<')) {
        return 'tag start'
    }
    return 'text'
}

function splitOnFirst(str, sep) {
    const index = str.indexOf(sep)
    return index < 0 ? [str] : [str.slice(0, index), str.slice(index + sep.length)]
}

function getTokenTagAndAttributes(token) {
    let tagName = 'textnode'
    let attributes = []
    let tagToken = ''
    let insideQuote = false

    for(let i = 0; i < token.length; i++) {
        if(token[i] === '"') {
            if(insideQuote) {
                insideQuote = false
            } else {
                insideQuote = true
            }
        }
        if(!insideQuote && tagToken === '<') {
            tagToken = ''
        }
        if(!insideQuote && tagToken === '/') {
            tagToken = ''
        }
        if(!insideQuote && token[i] === '>') {
            const tagSplit = splitOnFirst(tagToken, ' ')
            tagName = tagSplit[0].toLowerCase()
            if(tagSplit.length === 2) {
                tagSplit[1] = tagSplit[1].slice(0, -1) // remove the lone double quote at the end of the string which will be leftover when split
                attributes = tagSplit[1].split('" ').map(item => {
                    const split = splitOnFirst(item, '=')
                    return {
                        attribute: split[0],
                        value: 1 in split ? split[1].substring(1) : null
                    }
                })
            }
            break
        }
        tagToken += token[i]
    }

    return [tagName, attributes]
}

function createTokenObject(token) {
    const type = guessTokenType(token)
    let [tagName, attributes] = getTokenTagAndAttributes(token)

    return {
        type,
        tagName,
        attributes,
        token
    }
}

function tokenize(str) {
    let tokens = []
    let token = ''
    let insideQuote = false

    for(let i = 0; i < str.length; i++) {
        const character = str[i]
        if(character === '"') {
            if(insideQuote) {
                insideQuote = false
            } else {
                insideQuote = true
            }
        }
        if(character === '<' && !insideQuote) {
            if(token) {
                tokens.push(createTokenObject(token))
                token = ''
            }
        }
        token += character
        if(character === '>' && !insideQuote) {
            tokens.push(createTokenObject(token))
            token = ''
        }
    }

    // exclude tokens with only empty spaces and new lines AND exclude tokens that are comments
    tokens = tokens.filter(token => token.token.trim() && token.tagName !== '!--')

    return tokens
}

class Node {
    #children
    #parentElement
    #textContent

    constructor(id, parentId, element) {
        this.id = id
        this.parentId = parentId
        this.tagName = element.tagName
        this.attributes = element.attributes.map(item => {
            return {
                attribute: item.attribute,
                value: item.value !== null ? decodeHtmlEntities(item.value, { level: 'all', scope: 'strict' }) : item.value
            }
        })
        this.#textContent = element.tagName === 'textnode' ? decodeHtmlEntities(element.token) : null
        this.#children = []
        this.#parentElement = null

        // to make textContent getter enumerable
        const descriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent')
		const modifiedDescriptor = Object.assign(descriptor, {enumerable: true})
		Object.defineProperty(this, 'textContent', modifiedDescriptor)
    }

    addParent(node) {
        this.#parentElement = node
    }

    addChild(node) {
        this.#children.push(node)
    }

    children() {
        return this.#children
    }

    get parentElement() {
        return this.#parentElement
    }

    get textContent() {
        if(this.#textContent === null) {
            const textNode = this.#children.find(child => child.tagName === 'textnode')
            if(textNode) {
                return this.#children.find(child => child.tagName === 'textnode').textContent
            } else {
                return null
            }
        }

        return this.#textContent
    }

    getAttribute(attribute) {
        if(this.attributes.length === 0) {
            return undefined
        }
        for(const attributeItem of this.attributes) {
            if(attributeItem.attribute.toLowerCase() === attribute.toLowerCase()) {
                return attributeItem.value
            }
        }
    }
}

function createTree(tokens) {
    const nodes = []
    let openNodeIds = []

    tokens.forEach(token => {
        // ignore these as they are html tags without end tags
        if(token.tagName === 'meta' || token.tagName === '!doctype') {
            const id = nodes.length
            nodes.push(new Node(id, null, token))
            return
        }

        const openNodeIdsLength = openNodeIds.length
        const openNodeId = openNodeIdsLength > 0 ? openNodeIds[openNodeIdsLength - 1] : null

        if(token.type === 'tag start') {
            const id = nodes.length
            nodes.push(new Node(id, openNodeId, token))
            openNodeIds.push(id)
        }

        if(token.type === 'tag end') {
            openNodeIds.pop()
        }

        if(token.type === 'text') {
            const id = nodes.length
            nodes.push(new Node(id, openNodeId, token))
        }
    })

    for(const node of nodes) {
        const parent = nodes[node.parentId]
        if(parent) {
            parent.addChild(node)
            node.addParent(parent)
        }
    }

    return nodes.filter(node => node.parentId === null)
}

export function parseHtml(htmlString) {
    const tokens = tokenize(htmlString)
    const tree = createTree(tokens)
    return tree
}

export function getElementsByTagName(tree, tagName) {
    let elements = tree
    for(const element of elements) {
        elements.push(...getElementsByTagName(element.children().filter(item => !(elements.map(item2 => item2.id).includes(item.id))), tagName))
    }
    elements = elements.filter(treeItem => treeItem.tagName === tagName)
    return elements
}
