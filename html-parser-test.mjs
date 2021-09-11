import { parseHtml } from "./html-parser.mjs"

function test1() {
    const html = `
    <div id="10">
        <p class="message message-item" id="tag">
            Hey
        </p>
    </div>
    <div>
        <p>
            Hey
        </p>
        <p>
            Hey
        </p>
    </div>
    `

    const parseHtmlTree = parseHtml(html)

    console.dir(parseHtmlTree, { depth: null })
}

function test2() {
    const html = `
    <A HREF="javascript:document.body.contentEditable = 'true'; document.designMode='on'; void 0" ADD_DATE="1628699191">Edit page</A>
    <A HREF="javascript:WN7z=open('','Z6','width=400,height=200,scrollbars,resizable,menubar');DL5e=document.links;with(WN7z.document){write('<base%20target=_blank>');for(lKi=0;lKi<DL5e.length;lKi++){write(DL5e[lKi].toString().link(DL5e[lKi])+'<br><br>')};void(close())}" ADD_DATE="1628699191">List all links</A>
    <A HREF="javascript:Ai7Mg6P='';for%20(i7M1bQz=0;i7M1bQz<document.images.length;i7M1bQz++){Ai7Mg6P+='<img%20src='+document.images[i7M1bQz].src+'><br>'};if(Ai7Mg6P!=''){document.write('<center>'+Ai7Mg6P+'</center>');void(document.close())}else{alert('No%20images!')}" ADD_DATE="1628699191">List all images</A>
    <A HREF="javascript:void(location.href=document.links[Math.round((document.links.length-1)*Math.random())])" ADD_DATE="1628699191">Go To Random Link</A>
    <A HREF="javascript:if(frames.length<1){alert('The server indicates that the page was last modified: ' + window.document.lastModified)}else{alert('Page is framed. Use version of bookmarklet for frames. (bookmarklets.com)')}" ADD_DATE="1628699191">Page Freshness?</A>
    <A HREF="javascript:alert('Width of screen: '+screen.width+' pixels\n\rHeight of screen: '+screen.height+' pixels\n\rNumber of colors: '+Math.pow(2,screen.colorDepth))" ADD_DATE="1628699191">Screen Properties</A>
    <A HREF="javascript:(function(){if(window['priFri']){window.print()}else{var pfurl='';pfstyle='nbk';pfBkVersion='1';if(window.location.href.match(/https/)){pfurl='https://pf-cdn.printfriendly.com/ssl/main.js'}else{pfurl='http://cdn.printfriendly.com/printfriendly.js'}_pnicer_script=document.createElement('SCRIPT');_pnicer_script.type='text/javascript';_pnicer_script.src=pfurl + '?x='+(Math.random());document.getElementsByTagName('head')[0].appendChild(_pnicer_script);}})();" ADD_DATE="1628699191">Print Friendly</A>
    <A HREF="javascript:(function(){alert(document.getElementsByTagName(&quot;*&quot;).length)})()" ADD_DATE="1628699191">Element Count</A>
    <A HREF="javascript: var el = document.querySelectorAll('style,link');         for (var i=0; i<el.length; i++) {           el[i].parentNode.removeChild(el[i]);          };" ADD_DATE="1628699191">Remove Styles</A>
    `

    const parseHtmlTree = parseHtml(html)

    console.dir(parseHtmlTree, { depth: null })
}

function test3() {
    const html = `
    <A HREF="javascript:if(typeof(searches)=='undefined'){var searches=0;};(function(){var count=0,text,regexp;text=prompt('Search regex:','');if(text==null||text.length==0)return;try{regexp=new RegExp(text,'i');}catch(er){alert('Unable to create regular expression using text \''+text+'\'.\n\n'+er);return;}function searchWithinNode(node,re){var pos,skip,acronym,middlebit,endbit,middleclone;skip=0;if(node.nodeType==3){pos=node.data.search(re);if(pos>=0){acronym=document.createElement('ACRONYM');acronym.title='Search '+(searches+1)+': '+re.toString();acronym.style.backgroundColor=backColor;acronym.style.borderTop='1px solid '+borderColor;acronym.style.borderBottom='1px solid '+borderColor;acronym.style.fontWeight='bold';acronym.style.color=borderColor;middlebit=node.splitText(pos);endbit=middlebit.splitText(RegExp.lastMatch.length);middleclone=middlebit.cloneNode(true);acronym.appendChild(middleclone);middlebit.parentNode.replaceChild(acronym,middlebit);count++;skip=1;}}else if(node.nodeType==1&&node.childNodes&&node.tagName.toUpperCase()!='SCRIPT'&&node.tagName.toUpperCase!='STYLE')for(var child=0;child<node.childNodes.length;++child)child=child+searchWithinNode(node.childNodes[child],re);return skip;}var borderColor='#'+(searches+8).toString(2).substr(-3).replace(/0/g,'3').replace(/1/g,'6');var backColor=borderColor .replace(/3/g,'c').replace(/6/g,'f');if(searches%2516/8>=1){var tempColor=borderColor;borderColor=backColor;backColor=tempColor;}searchWithinNode(document.body,regexp);window.status='Found '+count+' match'+(count==1?'':'es')+' for '+regexp+'.';if(count>0)searches++;})();" ADD_DATE="1628699191">Regex Search</A>
    `

    const parseHtmlTree = parseHtml(html)

    console.dir(parseHtmlTree, { depth: null })
}

function test4() {
    const html = `
    <A HREF="https://www.directlyrics.com/moana-how-far-ill-go-lyrics.html" ADD_DATE="1628699191">MOANA - How Far I&#39;ll Go lyrics</A>
    `

    const parseHtmlTree = parseHtml(html)

    console.dir(parseHtmlTree[0].textContent, { depth: null })
}

test4()
