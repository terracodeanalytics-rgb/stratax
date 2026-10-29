var T0=Object.create;var Xi=Object.defineProperty;var m0=Object.getOwnPropertyDescriptor;var y0=Object.getOwnPropertyNames;var S0=Object.getPrototypeOf,x0=Object.prototype.hasOwnProperty;var Vt=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),Kr=(t,e)=>{for(var r in e)Xi(t,r,{get:e[r],enumerable:!0})},C0=(t,e,r,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of y0(e))!x0.call(t,a)&&a!==r&&Xi(t,a,{get:()=>e[a],enumerable:!(n=m0(e,a))||n.enumerable});return t};var On=(t,e,r)=>(r=t!=null?T0(S0(t)):{},C0(e||!t||!t.__esModule?Xi(r,"default",{value:t,enumerable:!0}):r,t));var ua=Vt((fD,cc)=>{"use strict";cc.exports=function t(e,r){if(e===r)return!0;if(e&&r&&typeof e=="object"&&typeof r=="object"){if(e.constructor!==r.constructor)return!1;var n,a,i;if(Array.isArray(e)){if(n=e.length,n!=r.length)return!1;for(a=n;a--!==0;)if(!t(e[a],r[a]))return!1;return!0}if(e.constructor===RegExp)return e.source===r.source&&e.flags===r.flags;if(e.valueOf!==Object.prototype.valueOf)return e.valueOf()===r.valueOf();if(e.toString!==Object.prototype.toString)return e.toString()===r.toString();if(i=Object.keys(e),n=i.length,n!==Object.keys(r).length)return!1;for(a=n;a--!==0;)if(!Object.prototype.hasOwnProperty.call(r,i[a]))return!1;for(a=n;a--!==0;){var s=i[a];if(!t(e[s],r[s]))return!1}return!0}return e!==e&&r!==r}});var yf=Vt((mf,ys)=>{(function(t,e,r){function n(o){var c=this,f=s();c.next=function(){var u=2091639*c.s0+c.c*23283064365386963e-26;return c.s0=c.s1,c.s1=c.s2,c.s2=u-(c.c=u|0)},c.c=1,c.s0=f(" "),c.s1=f(" "),c.s2=f(" "),c.s0-=f(o),c.s0<0&&(c.s0+=1),c.s1-=f(o),c.s1<0&&(c.s1+=1),c.s2-=f(o),c.s2<0&&(c.s2+=1),f=null}function a(o,c){return c.c=o.c,c.s0=o.s0,c.s1=o.s1,c.s2=o.s2,c}function i(o,c){var f=new n(o),u=c&&c.state,g=f.next;return g.int32=function(){return f.next()*4294967296|0},g.double=function(){return g()+(g()*2097152|0)*11102230246251565e-32},g.quick=g,u&&(typeof u=="object"&&a(u,f),g.state=function(){return a(f,{})}),g}function s(){var o=4022871197,c=function(f){f=String(f);for(var u=0;u<f.length;u++){o+=f.charCodeAt(u);var g=.02519603282416938*o;o=g>>>0,g-=o,g*=o,o=g>>>0,g-=o,o+=g*4294967296}return(o>>>0)*23283064365386963e-26};return c}e&&e.exports?e.exports=i:r&&r.amd?r(function(){return i}):this.alea=i})(mf,typeof ys=="object"&&ys,typeof define=="function"&&define)});var xf=Vt((Sf,Ss)=>{(function(t,e,r){function n(s){var o=this,c="";o.x=0,o.y=0,o.z=0,o.w=0,o.next=function(){var u=o.x^o.x<<11;return o.x=o.y,o.y=o.z,o.z=o.w,o.w^=o.w>>>19^u^u>>>8},s===(s|0)?o.x=s:c+=s;for(var f=0;f<c.length+64;f++)o.x^=c.charCodeAt(f)|0,o.next()}function a(s,o){return o.x=s.x,o.y=s.y,o.z=s.z,o.w=s.w,o}function i(s,o){var c=new n(s),f=o&&o.state,u=function(){return(c.next()>>>0)/4294967296};return u.double=function(){do var g=c.next()>>>11,l=(c.next()>>>0)/4294967296,h=(g+l)/(1<<21);while(h===0);return h},u.int32=c.next,u.quick=u,f&&(typeof f=="object"&&a(f,c),u.state=function(){return a(c,{})}),u}e&&e.exports?e.exports=i:r&&r.amd?r(function(){return i}):this.xor128=i})(Sf,typeof Ss=="object"&&Ss,typeof define=="function"&&define)});var Of=Vt((Cf,xs)=>{(function(t,e,r){function n(s){var o=this,c="";o.next=function(){var u=o.x^o.x>>>2;return o.x=o.y,o.y=o.z,o.z=o.w,o.w=o.v,(o.d=o.d+362437|0)+(o.v=o.v^o.v<<4^(u^u<<1))|0},o.x=0,o.y=0,o.z=0,o.w=0,o.v=0,s===(s|0)?o.x=s:c+=s;for(var f=0;f<c.length+64;f++)o.x^=c.charCodeAt(f)|0,f==c.length&&(o.d=o.x<<10^o.x>>>4),o.next()}function a(s,o){return o.x=s.x,o.y=s.y,o.z=s.z,o.w=s.w,o.v=s.v,o.d=s.d,o}function i(s,o){var c=new n(s),f=o&&o.state,u=function(){return(c.next()>>>0)/4294967296};return u.double=function(){do var g=c.next()>>>11,l=(c.next()>>>0)/4294967296,h=(g+l)/(1<<21);while(h===0);return h},u.int32=c.next,u.quick=u,f&&(typeof f=="object"&&a(f,c),u.state=function(){return a(c,{})}),u}e&&e.exports?e.exports=i:r&&r.amd?r(function(){return i}):this.xorwow=i})(Cf,typeof xs=="object"&&xs,typeof define=="function"&&define)});var Rf=Vt((wf,Cs)=>{(function(t,e,r){function n(s){var o=this;o.next=function(){var f=o.x,u=o.i,g,l,h;return g=f[u],g^=g>>>7,l=g^g<<24,g=f[u+1&7],l^=g^g>>>10,g=f[u+3&7],l^=g^g>>>3,g=f[u+4&7],l^=g^g<<7,g=f[u+7&7],g=g^g<<13,l^=g^g<<9,f[u]=l,o.i=u+1&7,l};function c(f,u){var g,l,h=[];if(u===(u|0))l=h[0]=u;else for(u=""+u,g=0;g<u.length;++g)h[g&7]=h[g&7]<<15^u.charCodeAt(g)+h[g+1&7]<<13;for(;h.length<8;)h.push(0);for(g=0;g<8&&h[g]===0;++g);for(g==8?l=h[7]=-1:l=h[g],f.x=h,f.i=0,g=256;g>0;--g)f.next()}c(o,s)}function a(s,o){return o.x=s.x.slice(),o.i=s.i,o}function i(s,o){s==null&&(s=+new Date);var c=new n(s),f=o&&o.state,u=function(){return(c.next()>>>0)/4294967296};return u.double=function(){do var g=c.next()>>>11,l=(c.next()>>>0)/4294967296,h=(g+l)/(1<<21);while(h===0);return h},u.int32=c.next,u.quick=u,f&&(f.x&&a(f,c),u.state=function(){return a(c,{})}),u}e&&e.exports?e.exports=i:r&&r.amd?r(function(){return i}):this.xorshift7=i})(wf,typeof Cs=="object"&&Cs,typeof define=="function"&&define)});var Mf=Vt((Ef,Os)=>{(function(t,e,r){function n(s){var o=this;o.next=function(){var f=o.w,u=o.X,g=o.i,l,h;return o.w=f=f+1640531527|0,h=u[g+34&127],l=u[g=g+1&127],h^=h<<13,l^=l<<17,h^=h>>>15,l^=l>>>12,h=u[g]=h^l,o.i=g,h+(f^f>>>16)|0};function c(f,u){var g,l,h,y,p,m=[],d=128;for(u===(u|0)?(l=u,u=null):(u=u+"\0",l=0,d=Math.max(d,u.length)),h=0,y=-32;y<d;++y)u&&(l^=u.charCodeAt((y+32)%u.length)),y===0&&(p=l),l^=l<<10,l^=l>>>15,l^=l<<4,l^=l>>>13,y>=0&&(p=p+1640531527|0,g=m[y&127]^=l+p,h=g==0?h+1:0);for(h>=128&&(m[(u&&u.length||0)&127]=-1),h=127,y=512;y>0;--y)l=m[h+34&127],g=m[h=h+1&127],l^=l<<13,g^=g<<17,l^=l>>>15,g^=g>>>12,m[h]=l^g;f.w=p,f.X=m,f.i=h}c(o,s)}function a(s,o){return o.i=s.i,o.w=s.w,o.X=s.X.slice(),o}function i(s,o){s==null&&(s=+new Date);var c=new n(s),f=o&&o.state,u=function(){return(c.next()>>>0)/4294967296};return u.double=function(){do var g=c.next()>>>11,l=(c.next()>>>0)/4294967296,h=(g+l)/(1<<21);while(h===0);return h},u.int32=c.next,u.quick=u,f&&(f.X&&a(f,c),u.state=function(){return a(c,{})}),u}e&&e.exports?e.exports=i:r&&r.amd?r(function(){return i}):this.xor4096=i})(Ef,typeof Os=="object"&&Os,typeof define=="function"&&define)});var Vf=Vt((Df,ws)=>{(function(t,e,r){function n(s){var o=this,c="";o.next=function(){var u=o.b,g=o.c,l=o.d,h=o.a;return u=u<<25^u>>>7^g,g=g-l|0,l=l<<24^l>>>8^h,h=h-u|0,o.b=u=u<<20^u>>>12^g,o.c=g=g-l|0,o.d=l<<16^g>>>16^h,o.a=h-u|0},o.a=0,o.b=0,o.c=-1640531527,o.d=1367130551,s===Math.floor(s)?(o.a=s/4294967296|0,o.b=s|0):c+=s;for(var f=0;f<c.length+20;f++)o.b^=c.charCodeAt(f)|0,o.next()}function a(s,o){return o.a=s.a,o.b=s.b,o.c=s.c,o.d=s.d,o}function i(s,o){var c=new n(s),f=o&&o.state,u=function(){return(c.next()>>>0)/4294967296};return u.double=function(){do var g=c.next()>>>11,l=(c.next()>>>0)/4294967296,h=(g+l)/(1<<21);while(h===0);return h},u.int32=c.next,u.quick=u,f&&(typeof f=="object"&&a(f,c),u.state=function(){return a(c,{})}),u}e&&e.exports?e.exports=i:r&&r.amd?r(function(){return i}):this.tychei=i})(Df,typeof ws=="object"&&ws,typeof define=="function"&&define)});var Lf=Vt(()=>{});var Bf=Vt((_f,Da)=>{(function(t,e,r){var n=256,a=6,i=52,s="random",o=r.pow(n,a),c=r.pow(2,i),f=c*2,u=n-1,g;function l(T,v,C){var O=[];v=v==!0?{entropy:!0}:v||{};var M=m(p(v.entropy?[T,x(e)]:T??d(),3),O),S=new h(O),E=function(){for(var R=S.g(a),D=o,V=0;R<c;)R=(R+V)*n,D*=n,V=S.g(1);for(;R>=f;)R/=2,D/=2,V>>>=1;return(R+V)/D};return E.int32=function(){return S.g(4)|0},E.quick=function(){return S.g(4)/4294967296},E.double=E,m(x(S.S),e),(v.pass||C||function(R,D,V,U){return U&&(U.S&&y(U,S),R.state=function(){return y(S,{})}),V?(r[s]=R,D):R})(E,M,"global"in v?v.global:this==r,v.state)}function h(T){var v,C=T.length,O=this,M=0,S=O.i=O.j=0,E=O.S=[];for(C||(T=[C++]);M<n;)E[M]=M++;for(M=0;M<n;M++)E[M]=E[S=u&S+T[M%C]+(v=E[M])],E[S]=v;(O.g=function(R){for(var D,V=0,U=O.i,B=O.j,_=O.S;R--;)D=_[U=u&U+1],V=V*n+_[u&(_[U]=_[B=u&B+D])+(_[B]=D)];return O.i=U,O.j=B,V})(n)}function y(T,v){return v.i=T.i,v.j=T.j,v.S=T.S.slice(),v}function p(T,v){var C=[],O=typeof T,M;if(v&&O=="object")for(M in T)try{C.push(p(T[M],v-1))}catch{}return C.length?C:O=="string"?T:T+"\0"}function m(T,v){for(var C=T+"",O,M=0;M<C.length;)v[u&M]=u&(O^=v[u&M]*19)+C.charCodeAt(M++);return x(v)}function d(){try{var T;return g&&(T=g.randomBytes)?T=T(n):(T=new Uint8Array(n),(t.crypto||t.msCrypto).getRandomValues(T)),x(T)}catch{var v=t.navigator,C=v&&v.plugins;return[+new Date,t,C,t.screen,x(e)]}}function x(T){return String.fromCharCode.apply(0,T)}if(m(r.random(),e),typeof Da=="object"&&Da.exports){Da.exports=l;try{g=Lf()}catch{}}else typeof define=="function"&&define.amd?define(function(){return l}):r["seed"+s]=l})(typeof self<"u"?self:_f,[],Math)});var Uf=Vt((_D,Ff)=>{var YT=yf(),qT=xf(),ZT=Of(),QT=Rf(),JT=Mf(),em=Vf(),Dr=Bf();Dr.alea=YT;Dr.xor128=qT;Dr.xorwow=ZT;Dr.xorshift7=QT;Dr.xor4096=JT;Dr.tychei=em;Ff.exports=Dr});var Th=Vt((vh,dh)=>{(function(t){if(typeof vh=="object")dh.exports=t();else if(typeof define=="function"&&define.amd)define(t);else{var e;try{e=window}catch{e=self}e.SparkMD5=t()}})(function(t){"use strict";var e=function(d,x){return d+x&4294967295},r=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];function n(d,x,T,v,C,O){return x=e(e(x,d),e(v,O)),e(x<<C|x>>>32-C,T)}function a(d,x){var T=d[0],v=d[1],C=d[2],O=d[3];T+=(v&C|~v&O)+x[0]-680876936|0,T=(T<<7|T>>>25)+v|0,O+=(T&v|~T&C)+x[1]-389564586|0,O=(O<<12|O>>>20)+T|0,C+=(O&T|~O&v)+x[2]+606105819|0,C=(C<<17|C>>>15)+O|0,v+=(C&O|~C&T)+x[3]-1044525330|0,v=(v<<22|v>>>10)+C|0,T+=(v&C|~v&O)+x[4]-176418897|0,T=(T<<7|T>>>25)+v|0,O+=(T&v|~T&C)+x[5]+1200080426|0,O=(O<<12|O>>>20)+T|0,C+=(O&T|~O&v)+x[6]-1473231341|0,C=(C<<17|C>>>15)+O|0,v+=(C&O|~C&T)+x[7]-45705983|0,v=(v<<22|v>>>10)+C|0,T+=(v&C|~v&O)+x[8]+1770035416|0,T=(T<<7|T>>>25)+v|0,O+=(T&v|~T&C)+x[9]-1958414417|0,O=(O<<12|O>>>20)+T|0,C+=(O&T|~O&v)+x[10]-42063|0,C=(C<<17|C>>>15)+O|0,v+=(C&O|~C&T)+x[11]-1990404162|0,v=(v<<22|v>>>10)+C|0,T+=(v&C|~v&O)+x[12]+1804603682|0,T=(T<<7|T>>>25)+v|0,O+=(T&v|~T&C)+x[13]-40341101|0,O=(O<<12|O>>>20)+T|0,C+=(O&T|~O&v)+x[14]-1502002290|0,C=(C<<17|C>>>15)+O|0,v+=(C&O|~C&T)+x[15]+1236535329|0,v=(v<<22|v>>>10)+C|0,T+=(v&O|C&~O)+x[1]-165796510|0,T=(T<<5|T>>>27)+v|0,O+=(T&C|v&~C)+x[6]-1069501632|0,O=(O<<9|O>>>23)+T|0,C+=(O&v|T&~v)+x[11]+643717713|0,C=(C<<14|C>>>18)+O|0,v+=(C&T|O&~T)+x[0]-373897302|0,v=(v<<20|v>>>12)+C|0,T+=(v&O|C&~O)+x[5]-701558691|0,T=(T<<5|T>>>27)+v|0,O+=(T&C|v&~C)+x[10]+38016083|0,O=(O<<9|O>>>23)+T|0,C+=(O&v|T&~v)+x[15]-660478335|0,C=(C<<14|C>>>18)+O|0,v+=(C&T|O&~T)+x[4]-405537848|0,v=(v<<20|v>>>12)+C|0,T+=(v&O|C&~O)+x[9]+568446438|0,T=(T<<5|T>>>27)+v|0,O+=(T&C|v&~C)+x[14]-1019803690|0,O=(O<<9|O>>>23)+T|0,C+=(O&v|T&~v)+x[3]-187363961|0,C=(C<<14|C>>>18)+O|0,v+=(C&T|O&~T)+x[8]+1163531501|0,v=(v<<20|v>>>12)+C|0,T+=(v&O|C&~O)+x[13]-1444681467|0,T=(T<<5|T>>>27)+v|0,O+=(T&C|v&~C)+x[2]-51403784|0,O=(O<<9|O>>>23)+T|0,C+=(O&v|T&~v)+x[7]+1735328473|0,C=(C<<14|C>>>18)+O|0,v+=(C&T|O&~T)+x[12]-1926607734|0,v=(v<<20|v>>>12)+C|0,T+=(v^C^O)+x[5]-378558|0,T=(T<<4|T>>>28)+v|0,O+=(T^v^C)+x[8]-2022574463|0,O=(O<<11|O>>>21)+T|0,C+=(O^T^v)+x[11]+1839030562|0,C=(C<<16|C>>>16)+O|0,v+=(C^O^T)+x[14]-35309556|0,v=(v<<23|v>>>9)+C|0,T+=(v^C^O)+x[1]-1530992060|0,T=(T<<4|T>>>28)+v|0,O+=(T^v^C)+x[4]+1272893353|0,O=(O<<11|O>>>21)+T|0,C+=(O^T^v)+x[7]-155497632|0,C=(C<<16|C>>>16)+O|0,v+=(C^O^T)+x[10]-1094730640|0,v=(v<<23|v>>>9)+C|0,T+=(v^C^O)+x[13]+681279174|0,T=(T<<4|T>>>28)+v|0,O+=(T^v^C)+x[0]-358537222|0,O=(O<<11|O>>>21)+T|0,C+=(O^T^v)+x[3]-722521979|0,C=(C<<16|C>>>16)+O|0,v+=(C^O^T)+x[6]+76029189|0,v=(v<<23|v>>>9)+C|0,T+=(v^C^O)+x[9]-640364487|0,T=(T<<4|T>>>28)+v|0,O+=(T^v^C)+x[12]-421815835|0,O=(O<<11|O>>>21)+T|0,C+=(O^T^v)+x[15]+530742520|0,C=(C<<16|C>>>16)+O|0,v+=(C^O^T)+x[2]-995338651|0,v=(v<<23|v>>>9)+C|0,T+=(C^(v|~O))+x[0]-198630844|0,T=(T<<6|T>>>26)+v|0,O+=(v^(T|~C))+x[7]+1126891415|0,O=(O<<10|O>>>22)+T|0,C+=(T^(O|~v))+x[14]-1416354905|0,C=(C<<15|C>>>17)+O|0,v+=(O^(C|~T))+x[5]-57434055|0,v=(v<<21|v>>>11)+C|0,T+=(C^(v|~O))+x[12]+1700485571|0,T=(T<<6|T>>>26)+v|0,O+=(v^(T|~C))+x[3]-1894986606|0,O=(O<<10|O>>>22)+T|0,C+=(T^(O|~v))+x[10]-1051523|0,C=(C<<15|C>>>17)+O|0,v+=(O^(C|~T))+x[1]-2054922799|0,v=(v<<21|v>>>11)+C|0,T+=(C^(v|~O))+x[8]+1873313359|0,T=(T<<6|T>>>26)+v|0,O+=(v^(T|~C))+x[15]-30611744|0,O=(O<<10|O>>>22)+T|0,C+=(T^(O|~v))+x[6]-1560198380|0,C=(C<<15|C>>>17)+O|0,v+=(O^(C|~T))+x[13]+1309151649|0,v=(v<<21|v>>>11)+C|0,T+=(C^(v|~O))+x[4]-145523070|0,T=(T<<6|T>>>26)+v|0,O+=(v^(T|~C))+x[11]-1120210379|0,O=(O<<10|O>>>22)+T|0,C+=(T^(O|~v))+x[2]+718787259|0,C=(C<<15|C>>>17)+O|0,v+=(O^(C|~T))+x[9]-343485551|0,v=(v<<21|v>>>11)+C|0,d[0]=T+d[0]|0,d[1]=v+d[1]|0,d[2]=C+d[2]|0,d[3]=O+d[3]|0}function i(d){var x=[],T;for(T=0;T<64;T+=4)x[T>>2]=d.charCodeAt(T)+(d.charCodeAt(T+1)<<8)+(d.charCodeAt(T+2)<<16)+(d.charCodeAt(T+3)<<24);return x}function s(d){var x=[],T;for(T=0;T<64;T+=4)x[T>>2]=d[T]+(d[T+1]<<8)+(d[T+2]<<16)+(d[T+3]<<24);return x}function o(d){var x=d.length,T=[1732584193,-271733879,-1732584194,271733878],v,C,O,M,S,E;for(v=64;v<=x;v+=64)a(T,i(d.substring(v-64,v)));for(d=d.substring(v-64),C=d.length,O=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],v=0;v<C;v+=1)O[v>>2]|=d.charCodeAt(v)<<(v%4<<3);if(O[v>>2]|=128<<(v%4<<3),v>55)for(a(T,O),v=0;v<16;v+=1)O[v]=0;return M=x*8,M=M.toString(16).match(/(.*?)(.{0,8})$/),S=parseInt(M[2],16),E=parseInt(M[1],16)||0,O[14]=S,O[15]=E,a(T,O),T}function c(d){var x=d.length,T=[1732584193,-271733879,-1732584194,271733878],v,C,O,M,S,E;for(v=64;v<=x;v+=64)a(T,s(d.subarray(v-64,v)));for(d=v-64<x?d.subarray(v-64):new Uint8Array(0),C=d.length,O=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],v=0;v<C;v+=1)O[v>>2]|=d[v]<<(v%4<<3);if(O[v>>2]|=128<<(v%4<<3),v>55)for(a(T,O),v=0;v<16;v+=1)O[v]=0;return M=x*8,M=M.toString(16).match(/(.*?)(.{0,8})$/),S=parseInt(M[2],16),E=parseInt(M[1],16)||0,O[14]=S,O[15]=E,a(T,O),T}function f(d){var x="",T;for(T=0;T<4;T+=1)x+=r[d>>T*8+4&15]+r[d>>T*8&15];return x}function u(d){var x;for(x=0;x<d.length;x+=1)d[x]=f(d[x]);return d.join("")}u(o("hello"))!=="5d41402abc4b2a76b9719d911017c592"&&(e=function(d,x){var T=(d&65535)+(x&65535),v=(d>>16)+(x>>16)+(T>>16);return v<<16|T&65535}),typeof ArrayBuffer<"u"&&!ArrayBuffer.prototype.slice&&(function(){function d(x,T){return x=x|0||0,x<0?Math.max(x+T,0):Math.min(x,T)}ArrayBuffer.prototype.slice=function(x,T){var v=this.byteLength,C=d(x,v),O=v,M,S,E,R;return T!==t&&(O=d(T,v)),C>O?new ArrayBuffer(0):(M=O-C,S=new ArrayBuffer(M),E=new Uint8Array(S),R=new Uint8Array(this,C,M),E.set(R),S)}})();function g(d){return/[\u0080-\uFFFF]/.test(d)&&(d=unescape(encodeURIComponent(d))),d}function l(d,x){var T=d.length,v=new ArrayBuffer(T),C=new Uint8Array(v),O;for(O=0;O<T;O+=1)C[O]=d.charCodeAt(O);return x?C:v}function h(d){return String.fromCharCode.apply(null,new Uint8Array(d))}function y(d,x,T){var v=new Uint8Array(d.byteLength+x.byteLength);return v.set(new Uint8Array(d)),v.set(new Uint8Array(x),d.byteLength),T?v:v.buffer}function p(d){var x=[],T=d.length,v;for(v=0;v<T-1;v+=2)x.push(parseInt(d.substr(v,2),16));return String.fromCharCode.apply(String,x)}function m(){this.reset()}return m.prototype.append=function(d){return this.appendBinary(g(d)),this},m.prototype.appendBinary=function(d){this._buff+=d,this._length+=d.length;var x=this._buff.length,T;for(T=64;T<=x;T+=64)a(this._hash,i(this._buff.substring(T-64,T)));return this._buff=this._buff.substring(T-64),this},m.prototype.end=function(d){var x=this._buff,T=x.length,v,C=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],O;for(v=0;v<T;v+=1)C[v>>2]|=x.charCodeAt(v)<<(v%4<<3);return this._finish(C,T),O=u(this._hash),d&&(O=p(O)),this.reset(),O},m.prototype.reset=function(){return this._buff="",this._length=0,this._hash=[1732584193,-271733879,-1732584194,271733878],this},m.prototype.getState=function(){return{buff:this._buff,length:this._length,hash:this._hash.slice()}},m.prototype.setState=function(d){return this._buff=d.buff,this._length=d.length,this._hash=d.hash,this},m.prototype.destroy=function(){delete this._hash,delete this._buff,delete this._length},m.prototype._finish=function(d,x){var T=x,v,C,O;if(d[T>>2]|=128<<(T%4<<3),T>55)for(a(this._hash,d),T=0;T<16;T+=1)d[T]=0;v=this._length*8,v=v.toString(16).match(/(.*?)(.{0,8})$/),C=parseInt(v[2],16),O=parseInt(v[1],16)||0,d[14]=C,d[15]=O,a(this._hash,d)},m.hash=function(d,x){return m.hashBinary(g(d),x)},m.hashBinary=function(d,x){var T=o(d),v=u(T);return x?p(v):v},m.ArrayBuffer=function(){this.reset()},m.ArrayBuffer.prototype.append=function(d){var x=y(this._buff.buffer,d,!0),T=x.length,v;for(this._length+=d.byteLength,v=64;v<=T;v+=64)a(this._hash,s(x.subarray(v-64,v)));return this._buff=v-64<T?new Uint8Array(x.buffer.slice(v-64)):new Uint8Array(0),this},m.ArrayBuffer.prototype.end=function(d){var x=this._buff,T=x.length,v=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],C,O;for(C=0;C<T;C+=1)v[C>>2]|=x[C]<<(C%4<<3);return this._finish(v,T),O=u(this._hash),d&&(O=p(O)),this.reset(),O},m.ArrayBuffer.prototype.reset=function(){return this._buff=new Uint8Array(0),this._length=0,this._hash=[1732584193,-271733879,-1732584194,271733878],this},m.ArrayBuffer.prototype.getState=function(){var d=m.prototype.getState.call(this);return d.buff=h(d.buff),d},m.ArrayBuffer.prototype.setState=function(d){return d.buff=l(d.buff,!0),m.prototype.setState.call(this,d)},m.ArrayBuffer.prototype.destroy=m.prototype.destroy,m.ArrayBuffer.prototype._finish=m.prototype._finish,m.ArrayBuffer.hash=function(d,x){var T=c(new Uint8Array(d)),v=u(T);return x?p(v):v},m})});var sc=Object.defineProperty,Yi=(t,e)=>{let r={};for(var n in t)sc(r,n,{get:t[n],enumerable:!0});return e||sc(r,Symbol.toStringTag,{value:"Module"}),r};var oc={vtkObject:()=>null};function Ze(t){if(t==null||t.isA)return t;if(!t.vtkClass)return globalThis.console&&globalThis.console.error&&globalThis.console.error("Invalid VTK object"),null;let e=oc[t.vtkClass];if(!e)return globalThis.console&&globalThis.console.error&&globalThis.console.error(`No vtk class found for Object of type ${t.vtkClass}`),null;let r={...t};Object.keys(r).forEach(a=>{r[a]&&typeof r[a]=="object"&&r[a].vtkClass&&(r[a]=Ze(r[a]))});let n=e(r);return n&&n.modified&&n.modified(),n}function O0(t,e){oc[t]=e}Ze.register=O0;var fa=class extends Array{push(){for(let t=0;t<arguments.length;t++)this.includes(arguments[t])||super.push(arguments[t]);return this.length}};var hc=On(ua(),1),we=Yi({EVENT_ABORT:()=>Ji,TYPED_ARRAYS:()=>Ie,VOID:()=>dc,_capitalize:()=>Le,algo:()=>ya,capitalize:()=>Ta,chain:()=>at,debounce:()=>Dc,default:()=>w,event:()=>Sa,formatBytesToProperUnit:()=>Oc,formatNumbersWithThousandSeparator:()=>wc,get:()=>Ee,getArray:()=>Kt,isVtkObject:()=>es,keystore:()=>ts,measurePromiseExecution:()=>Ec,moveToProtected:()=>or,newInstance:()=>ue,newTypedArray:()=>Xr,newTypedArrayFrom:()=>da,normalizeWheel:()=>Fc,obj:()=>pe,proxy:()=>Lc,proxyPropertyMapping:()=>_c,proxyPropertyState:()=>Bc,requiredParam:()=>vc,set:()=>wn,setArray:()=>Qi,setGet:()=>de,setGetArray:()=>ma,setImmediateVTK:()=>Zi,setLoggerFunction:()=>mc,throttle:()=>Vc,traverseInstanceTree:()=>ha,uncapitalize:()=>Cc,vtkDebugMacro:()=>ga,vtkErrorMacro:()=>le,vtkInfoMacro:()=>Sc,vtkLogMacro:()=>yc,vtkOnceErrorMacro:()=>xc,vtkWarningMacro:()=>va}),qi=0,vc=t=>{throw new Error(`Named parameter '${t}' is missing`)},dc=Symbol("void");function w0(){return qi}var Tc={};function Mr(){}["log","debug","info","warn","error","time","timeEnd","group","groupEnd"].forEach(t=>{Tc[t]=Mr});var la=globalThis.console&&globalThis.console.hasOwnProperty("log")?globalThis.console:Tc,sr={debug:Mr,error:la.error||Mr,info:la.info||Mr,log:la.log||Mr,warn:la.warn||Mr};function mc(t,e){sr[t]&&(sr[t]=e||Mr)}function yc(...t){sr.log(...t)}function Sc(...t){sr.info(...t)}function ga(...t){sr.debug(...t)}function le(...t){sr.error(...t)}function va(...t){sr.warn(...t)}var fc={};function xc(t){fc[t]||(sr.error(t),fc[t]=!0)}var Ie=Object.create(null);Ie.Float32Array=Float32Array;Ie.Float64Array=Float64Array;Ie.Uint8Array=Uint8Array;Ie.Int8Array=Int8Array;Ie.Uint16Array=Uint16Array;Ie.Int16Array=Int16Array;Ie.Uint32Array=Uint32Array;Ie.Int32Array=Int32Array;Ie.Uint8ClampedArray=Uint8ClampedArray;try{Ie.BigInt64Array=BigInt64Array,Ie.BigUint64Array=BigUint64Array}catch{}function Xr(t,...e){return new(Ie[t]||Float64Array)(...e)}function da(t,...e){return(Ie[t]||Float64Array).from(...e)}function Ta(t){return t.charAt(0).toUpperCase()+t.slice(1)}function Le(t){return Ta(t[0]==="_"?t.slice(1):t)}function Cc(t){return t.charAt(0).toLowerCase()+t.slice(1)}function Oc(t,e=2,r=1e3){let n=["TB","GB","MB","KB"],a=Number(t),i="B";for(;a>r;)a/=r,i=n.pop();return`${a.toFixed(e)} ${i}`}function wc(t,e=" "){let r=[],n=t;for(;n>1e3;)r.push(`000${n%1e3}`.slice(-3)),n=Math.floor(n/1e3);return n>0&&r.push(n),r.reverse(),r.join(e)}function Rc(t){Object.keys(t).forEach(e=>{Array.isArray(t[e])&&(t[e]=[].concat(t[e]))})}function R0(t){return Object.values(Ie).some(e=>t instanceof e)}function E0(t,e){if(t===e)return!0;if(Array.isArray(t)&&Array.isArray(e)){if(t.length!==e.length)return!1;for(let r=0;r<t.length;r++)if(t[r]!==e[r])return!1;return!0}return!1}function M0(t,e){return Object.keys(t).find(r=>t[r]===e)}function Zi(t){setTimeout(t,0)}function Ec(t,e){let r=performance.now();t.finally(()=>{e(performance.now()-r)})}function pe(t={},e={}){Rc(e);let r=[];if(Number.isInteger(e.mtime)||(e.mtime=++qi),!("classHierarchy"in e))e.classHierarchy=new fa("vtkObject");else if(!(e.classHierarchy instanceof fa)){let i=new fa;for(let s=0;s<e.classHierarchy.length;s++)i.push(e.classHierarchy[s]);e.classHierarchy=i}function n(i){r[i]=null}function a(i){function s(){n(i)}return Object.freeze({unsubscribe:s})}return t.isDeleted=()=>!!e.deleted,t.modified=i=>{if(e.deleted){le("instance deleted - cannot call any method");return}i&&i<t.getMTime()||(e.mtime=++qi,r.forEach(s=>s&&s(t)))},t.onModified=i=>{if(e.deleted)return le("instance deleted - cannot call any method"),null;let s=r.length;return r.push(i),a(s)},t.getMTime=()=>e.mtime,t.isA=i=>{let s=e.classHierarchy.length;for(;s--;)if(e.classHierarchy[s]===i)return!0;return!1},t.getClassName=(i=0)=>e.classHierarchy[e.classHierarchy.length-1-i],t.set=(i={},s=!1,o=!1)=>{let c=!1;return Object.keys(i).forEach(f=>{let u=o?null:t[`set${Ta(f)}`];u&&Array.isArray(i[f])&&u.length>1?c=u(...i[f])||c:u?c=u(i[f])||c:(["mtime"].indexOf(f)===-1&&!s&&va(`Warning: Set value to model directly ${f}, ${i[f]}`),c=e[f]!==i[f]||c,e[f]=i[f])}),c},t.get=(...i)=>{if(!i.length)return e;let s={};return i.forEach(o=>{s[o]=e[o]}),s},t.getReferenceByName=i=>e[i],t.delete=()=>{Object.keys(e).forEach(i=>delete e[i]),r.forEach((i,s)=>n(s)),e.deleted=!0},t.getState=({preserveTypedArrays:i=!1}={})=>{if(e.deleted)return null;let s={preserveTypedArrays:i},o={...e,vtkClass:t.getClassName()};Object.keys(o).forEach(f=>{o[f]===null||o[f]===void 0||f[0]==="_"?delete o[f]:o[f].isA?o[f]=o[f].getState(s):Array.isArray(o[f])?o[f]=o[f].map(u=>u&&u.isA?u.getState(s):u):R0(o[f])&&(i||(o[f]=Array.from(o[f])))});let c={};return Object.keys(o).sort().forEach(f=>{c[f]=o[f]}),c.mtime&&delete c.mtime,c},t.shallowCopy=(i,s=!1)=>{if(i.getClassName()!==t.getClassName())throw new Error(`Cannot ShallowCopy ${i.getClassName()} into ${t.getClassName()}`);let o=i.get(),c=Object.keys(e).sort();Object.keys(o).sort().forEach(f=>{let u=c.indexOf(f);u===-1?s&&ga(`add ${f} in shallowCopy`):c.splice(u,1),e[f]=o[f]}),c.length&&s&&ga(`Untouched keys: ${c.join(", ")}`),t.modified()},t.toJSON=function(){return t.getState()},t}var D0={object(t,e,r){return function(){return{...e[r.name]}}}};function Ee(t,e,r){r.forEach(n=>{if(typeof n=="object"){let a=D0[n.type];a?t[`get${Le(n.name)}`]=a(t,e,n):t[`get${Le(n.name)}`]=()=>e[n.name]}else t[`get${Le(n)}`]=()=>e[n]})}var Mc={enum(t,e,r){let n=`_on${Le(r.name)}Changed`;return a=>{if(typeof a=="string"){if(r.enum[a]!==void 0)return e[r.name]!==r.enum[a]?(e[r.name]=r.enum[a],t.modified(),!0):!1;throw le(`Set Enum with invalid argument ${r}, ${a}`),new RangeError("Set Enum with invalid string argument")}if(typeof a=="number"){if(e[r.name]!==a){if(Object.keys(r.enum).map(i=>r.enum[i]).indexOf(a)!==-1){let i=e[r.name];return e[r.name]=a,e[n]?.(t,e,a,i),t.modified(),!0}throw le(`Set Enum outside numeric range ${r}, ${a}`),new RangeError("Set Enum outside numeric range")}return!1}throw le(`Set Enum with invalid argument (String/Number) ${r}, ${a}`),new TypeError("Set Enum with invalid argument (String/Number)")}},object(t,e,r){r.params?.length===1&&va('Setter of type "object" with a single "param" field is not supported');let n=`_on${Le(r.name)}Changed`;return(...a)=>{let i;if(a.length>1&&r.params?.length?i=r.params.reduce((s,o,c)=>Object.assign(s,{[o]:a[c]}),{}):i=a[0],!(0,hc.default)(e[r.name],i)){let s=e[r.name];return e[r.name]=i,e[n]?.(t,e,i,s),t.modified(),!0}return!1}}};function uc(t){if(typeof t=="object"){let e=Mc[t.type];if(e)return(r,n)=>e(r,n,t);throw le(`No setter for field ${t}`),new TypeError("No setter for field")}return function(r,n){let a=`_on${Le(t)}Changed`;return function(s){if(n.deleted)return le("instance deleted - cannot call any method"),!1;if(n[t]!==s){let o=n[t.name];return n[t]=s,n[a]?.(r,n,s,o),r.modified(),!0}return!1}}}function wn(t,e,r){r.forEach(n=>{typeof n=="object"?t[`set${Le(n.name)}`]=uc(n)(t,e):t[`set${Le(n)}`]=uc(n)(t,e)})}function de(t,e,r){Ee(t,e,r),wn(t,e,r)}function Kt(t,e,r){r.forEach(n=>{t[`get${Le(n)}`]=()=>e[n]?Array.from(e[n]):e[n],t[`get${Le(n)}ByReference`]=()=>e[n]})}function Qi(t,e,r,n,a=void 0){r.forEach(i=>{if(e[i]&&n&&e[i].length!==n)throw new RangeError(`Invalid initial number of values for array (${i})`);let s=`_on${Le(i)}Changed`;t[`set${Le(i)}`]=(...o)=>{if(e.deleted)return le("instance deleted - cannot call any method"),!1;let c=o,f,u=!1;if(c.length===1&&(c[0]==null||c[0].length>=0)&&(c=c[0],u=!0),c==null)f=e[i]!==c;else{if(n&&c.length!==n)if(c.length<n&&a!==void 0)for(c=Array.from(c),u=!1;c.length<n;)c.push(a);else throw new RangeError(`Invalid number of values for array setter (${i})`);f=e[i]==null||e[i].length!==c.length;for(let g=0;!f&&g<c.length;++g)f=e[i][g]!==c[g];f&&u&&(c=Array.from(c))}if(f){let g=e[i.name];e[i]=c,e[s]?.(t,e,c,g),t.modified()}return f},t[`set${Le(i)}From`]=o=>{let c=e[i];o.forEach((f,u)=>{c[u]=f})}})}function ma(t,e,r,n,a=void 0){Kt(t,e,r),Qi(t,e,r,n,a)}function or(t,e,r){for(let n=0;n<r.length;n++){let a=r[n];e[a]!==void 0&&(e[`_${a}`]=e[a],delete e[a])}}function ya(t,e,r,n){e.inputData?e.inputData=e.inputData.map(Ze):e.inputData=[],e.inputConnection?e.inputConnection=e.inputConnection.map(Ze):e.inputConnection=[],e.output?e.output=e.output.map(Ze):e.output=[],e.inputArrayToProcess?e.inputArrayToProcess=e.inputArrayToProcess.map(Ze):e.inputArrayToProcess=[],e.numberOfInputs=r;function a(h,y=0){if(e.deleted){le("instance deleted - cannot call any method");return}if(y>=e.numberOfInputs){le(`algorithm ${t.getClassName()} only has ${e.numberOfInputs} input ports. To add more input ports, use addInputData()`);return}(e.inputData[y]!==h||e.inputConnection[y])&&(e.inputData[y]=h,e.inputConnection[y]=null,t.modified&&t.modified())}function i(h=0){return e.inputConnection[h]&&(e.inputData[h]=e.inputConnection[h]()),e.inputData[h]}function s(h,y=0){if(e.deleted){le("instance deleted - cannot call any method");return}if(y>=e.numberOfInputs){let p=`algorithm ${t.getClassName()} only has `;p+=`${e.numberOfInputs}`,p+=" input ports. To add more input ports, use addInputConnection()",le(p);return}e.inputData[y]=null,e.inputConnection[y]=h}function o(h=0){return e.inputConnection[h]}function c(){let h=e.numberOfInputs;for(;h&&!e.inputData[h-1]&&!e.inputConnection[h-1];)h--;return h===e.numberOfInputs&&e.numberOfInputs++,h}function f(h){if(e.deleted){le("instance deleted - cannot call any method");return}s(h,c())}function u(h){if(e.deleted){le("instance deleted - cannot call any method");return}a(h,c())}function g(h=0){return e.deleted?(le("instance deleted - cannot call any method"),null):(t.shouldUpdate()&&t.update(),e.output[h])}t.shouldUpdate=()=>{let h=t.getMTime(),y=1/0,p=n;for(;p--;){if(!e.output[p]||e.output[p].isDeleted())return!0;let m=e.output[p].getMTime();if(m<h)return!0;m<y&&(y=m)}for(p=e.numberOfInputs;p--;)if(e.inputConnection[p]?.filter.shouldUpdate()||t.getInputData(p)?.getMTime()>y)return!0;return!1};function l(h=0){let y=()=>g(h);return y.filter=t,y}if(e.numberOfInputs){let h=e.numberOfInputs;for(;h--;)e.inputData.push(null),e.inputConnection.push(null);t.setInputData=a,t.setInputConnection=s,t.addInputData=u,t.addInputConnection=f,t.getInputData=i,t.getInputConnection=o}n&&(t.getOutputData=g,t.getOutputPort=l),t.update=()=>{let h=[];if(e.numberOfInputs){let y=0;for(;y<e.numberOfInputs;)h[y]=t.getInputData(y),y++}t.requestData&&!t.isDeleted()&&t.shouldUpdate()&&t.requestData(h,e.output)},t.getNumberOfInputPorts=()=>e.numberOfInputs,t.getNumberOfOutputPorts=()=>n||e.output.length,t.getInputArrayToProcess=h=>{let y=e.inputArrayToProcess[h],p=e.inputData[h];return y&&p?p[`get${y.fieldAssociation}`]().getArray(y.arrayName):null},t.setInputArrayToProcess=(h,y,p,m="Scalars")=>{for(;e.inputArrayToProcess.length<h;)e.inputArrayToProcess.push(null);e.inputArrayToProcess[h]={arrayName:y,fieldAssociation:p,attributeType:m}}}var Ji=Symbol("Event abort");function Sa(t,e,r){let n=[],a=t.delete,i=1;function s(f){for(let u=0;u<n.length;++u){let[g]=n[u];if(g===f){n.splice(u,1);return}}}function o(f){function u(){s(f)}return Object.freeze({unsubscribe:u})}function c(){if(e.deleted){le("instance deleted - cannot call any method");return}let f=n.slice();for(let u=0;u<f.length;++u){let[,g,l]=f[u];if(g){if(l<0)setTimeout(()=>g.apply(t,arguments),1-l);else if(g.apply(t,arguments)===Ji)break}}}t[`invoke${Le(r)}`]=c,t[`on${Le(r)}`]=(f,u=0)=>{if(!f.apply)return console.error(`Invalid callback for event ${r}`),null;if(e.deleted)return le("instance deleted - cannot call any method"),null;let g=i++;return n.push([g,f,u]),n.sort((l,h)=>h[2]-l[2]),o(g)},t.delete=()=>{a(),n.forEach(([f])=>s(f))}}function ue(t,e){let r=(n={})=>{let a={},i={};return t(i,a,n),Object.freeze(i)};return e&&Ze.register(e,r),r}function at(...t){return(...e)=>t.filter(r=>!!r).map(r=>r(...e))}function es(t){return t&&t.isA&&t.isA("vtkObject")}function ha(t,e,r=[],n=[]){if(es(t)){if(n.indexOf(t)>=0)return r;n.push(t);let a=e(t);a!==void 0&&r.push(a);let i=t.get();Object.keys(i).forEach(s=>{let o=i[s];Array.isArray(o)?o.forEach(c=>{ha(c,e,r,n)}):ha(o,e,r,n)})}return r}function Dc(t,e,r){let n,a=(...i)=>{let s=this,o=()=>{n=null,r||t.apply(s,i)},c=r&&!n;clearTimeout(n),n=setTimeout(o,e),c&&t.apply(s,i)};return a.cancel=()=>clearTimeout(n),a}function Vc(t,e){let r=!1,n=null;function a(){r=!1,n!==null&&(i(...n),n=null)}function i(...s){if(r){n=s;return}r=!0,t(...s),setTimeout(a,e)}return i}function ts(t,e,r={}){e.keystore=Object.assign(e.keystore||{},r),t.setKey=(n,a)=>{e.keystore[n]=a},t.getKey=n=>e.keystore[n],t.getAllKeys=()=>Object.keys(e.keystore),t.deleteKey=n=>delete e.keystore[n],t.clearKeystore=()=>t.getAllKeys().forEach(n=>delete e.keystore[n])}var V0=1,pa="__root__";function Lc(t,e){ts(t,e);let r=t.delete;e.proxyId=`${V0++}`,e.ui=JSON.parse(JSON.stringify(e.ui||[])),Ee(t,e,["proxyId","proxyGroup","proxyName"]),de(t,e,["proxyManager"]);let n={},a={};function i(f,u){a[u]||(a[u]=[]);let g=a[u];for(let l=0;l<f.length;l++)g.push(f[l].name),n[f[l].name]=f[l],f[l].children&&f[l].children.length&&i(f[l].children,f[l].name)}i(e.ui,pa),t.updateUI=f=>{e.ui=JSON.parse(JSON.stringify(f||[])),Object.keys(n).forEach(u=>delete n[u]),Object.keys(a).forEach(u=>delete a[u]),i(e.ui,pa),t.modified()};function s(f=pa){return a[f]}t.updateProxyProperty=(f,u)=>{let g=n[f];g?Object.assign(g,u):n[f]={...u}},t.activate=()=>{if(e.proxyManager){let f=`setActive${Le(t.getProxyGroup().slice(0,-1))}`;e.proxyManager[f]&&e.proxyManager[f](t)}},e.propertyLinkSubscribers={},t.registerPropertyLinkForGC=(f,u)=>{u in e.propertyLinkSubscribers||(e.propertyLinkSubscribers[u]=[]),e.propertyLinkSubscribers[u].push(f)},t.gcPropertyLinks=f=>{let u=e.propertyLinkSubscribers[f]||[];for(;u.length;)u.pop().unbind(t)},e.propertyLinkMap={},t.getPropertyLink=(f,u=!1)=>{if(e.propertyLinkMap[f])return e.propertyLinkMap[f];let g=null,l=[],h=0,y=!1;function p(v,C=!1){if(y)return null;let O=[],M=null;for(h=l.length;h--;){let E=l[h];E.instance===v?M=E:O.push(E)}if(!M)return null;let S=M.instance[`get${Le(M.propertyName)}`]();if(!E0(S,g)||C){for(g=S,y=!0;O.length;){let E=O.pop();E.instance.set({[E.propertyName]:g})}y=!1}return e.propertyLinkMap[f].persistent&&(e.propertyLinkMap[f].value=S),S}function m(v,C){let O=[];for(h=l.length;h--;){let M=l[h];M.instance===v&&(M.propertyName===C||C===void 0)&&(M.subscription.unsubscribe(),O.push(h))}for(;O.length;)l.splice(O.pop(),1)}function d(v,C,O=!1){let M=v.onModified(p),S=l[0];return l.push({instance:v,propertyName:C,subscription:M}),O&&(e.propertyLinkMap[f].persistent&&e.propertyLinkMap[f].value!==void 0?v.set({[C]:e.propertyLinkMap[f].value}):S&&p(S.instance,!0)),{unsubscribe:()=>m(v,C)}}function x(){for(;l.length;)l.pop().subscription.unsubscribe()}let T={bind:d,unbind:m,unsubscribe:x,persistent:u};return e.propertyLinkMap[f]=T,T};function o(f=pa){let u=[],g=e.proxyId,l=s(f)||[];for(let h=0;h<l.length;h++){let y=l[h],p=t[`get${Le(y)}`],m={id:g,name:y,value:p?p():void 0},d=o(y);d.length&&(m.children=d),u.push(m)}return u}t.listPropertyNames=()=>o().map(f=>f.name),t.getPropertyByName=f=>o().find(u=>u.name===f),t.getPropertyDomainByName=f=>(n[f]||{}).domain,t.getProxySection=()=>({id:e.proxyId,name:e.proxyGroup,ui:e.ui,properties:o()}),t.delete=()=>{let f=Object.keys(e.propertyLinkMap),u=f.length;for(;u--;)e.propertyLinkMap[f[u]].unsubscribe();Object.keys(e.propertyLinkSubscribers).forEach(t.gcPropertyLinks),r()},t.getState=()=>null;function c(){if(e.links)for(let f=0;f<e.links.length;f++){let{link:u,property:g,persistent:l,updateOnBind:h,type:y}=e.links[f];if(y==="application"){let p=e.proxyManager.getPropertyLink(u,l);t.registerPropertyLinkForGC(p,"application"),p.bind(t,g,h)}}}Zi(c)}function _c(t,e,r){let n=t.delete,a=[],i=Object.keys(r),s=i.length;for(;s--;){let o=i[s],{modelKey:c,property:f,modified:u=!0}=r[o],g=Le(f),l=Le(o);t[`get${l}`]=e[c][`get${g}`],t[`set${l}`]=e[c][`set${g}`],u&&a.push(e[c].onModified(t.modified))}t.delete=()=>{for(;a.length;)a.pop().unsubscribe();n()}}function Bc(t,e,r={},n={}){e.this=t;function a(o){let c=Object.keys(o),f=c.length;for(;f--;){let u=c[f];e[u].set(o[u])}}let i=Object.keys(n),s=i.length;for(;s--;){let o=i[s];e[o]=n[o];let c=r[o];t[`set${Le(o)}`]=f=>{if(f!==e[o]){e[o]=f;let u=c[f];a(u),t.modified()}}}i.length&&Ee(t,e,i)}var lc=10,pc=40,gc=800;function Fc(t){let e=0,r=0,n=0,a=0;return"detail"in t&&(r=t.detail),"wheelDelta"in t&&(r=-t.wheelDelta/120),"wheelDeltaY"in t&&(r=-t.wheelDeltaY/120),"wheelDeltaX"in t&&(e=-t.wheelDeltaX/120),"axis"in t&&t.axis===t.HORIZONTAL_AXIS&&(e=r,r=0),n=e*lc,a=r*lc,"deltaY"in t&&(a=t.deltaY),"deltaX"in t&&(n=t.deltaX),(n||a)&&t.deltaMode&&(t.deltaMode===1?(n*=pc,a*=pc):(n*=gc,a*=gc)),n&&!e&&(e=n<1?-1:1),a&&!r&&(r=a<1?-1:1),{spinX:e,spinY:r||e,pixelX:n,pixelY:a||n}}var w={algo:ya,capitalize:Ta,chain:at,debounce:Dc,enumToString:M0,event:Sa,EVENT_ABORT:Ji,formatBytesToProperUnit:Oc,formatNumbersWithThousandSeparator:wc,get:Ee,getArray:Kt,getCurrentGlobalMTime:w0,isVtkObject:es,keystore:ts,measurePromiseExecution:Ec,moveToProtected:or,newInstance:ue,newTypedArray:Xr,newTypedArrayFrom:da,normalizeWheel:Fc,obj:pe,proxy:Lc,proxyPropertyMapping:_c,proxyPropertyState:Bc,safeArrays:Rc,set:wn,setArray:Qi,setGet:de,setGetArray:ma,setImmediate:Zi,setLoggerFunction:mc,throttle:Vc,traverseInstanceTree:ha,TYPED_ARRAYS:Ie,uncapitalize:Cc,VOID:dc,vtkDebugMacro:ga,vtkErrorMacro:le,vtkInfoMacro:Sc,vtkLogMacro:yc,vtkOnceErrorMacro:xc,vtkWarningMacro:va,objectSetterMap:Mc,requiredParam:vc};var{vtkErrorMacro:L0}=w,_0=["Build","Render"];function B0(t,e){e.classHierarchy.push("vtkViewNode");function r(a,i){let{children:s}=e;if(a.end===void 0){a.start=s.lastIndexOf(i),a.end=a.start+1;return}if(s[a.end]===i){a.end++;return}let o=s.indexOf(i,a.end+1);if(o<0&&(o=s.indexOf(i)),!(o>=a.start&&o<a.end)){if(a.end>=s.length){s.splice(o,1),s.push(i),a.start--;return}s[o]=s[a.end],s[a.end]=i,a.end++}}t.build=a=>{},t.render=a=>{},t.traverse=a=>{let i=t[a.getTraverseOperation()];if(i){i(a);return}t.apply(a,!0);for(let s=0;s<e.children.length;s++)e.children[s].traverse(a);t.apply(a,!1)},t.apply=(a,i)=>{let s=t[a.getOperation()];s&&s(i,a)},t.getViewNodeFor=(a,i=null)=>{if(i&&i.renderable===a)return i;if(e.renderable===a)return t;let s=e._renderableChildMap.get(a);if(s)return s;for(let o=0;o<e.children.length;++o){let c=e.children[o].getViewNodeFor(a);if(c)return c}},t.getFirstAncestorOfType=a=>e._parent?e._parent.isA(a)?e._parent:e._parent.getFirstAncestorOfType(a):null,t.getLastAncestorOfType=a=>{if(!e._parent)return null;let i=e._parent.getLastAncestorOfType(a);return i||(e._parent.isA(a)?e._parent:null)},t.addMissingNode=a=>{if(!a)return;let i=e._renderableChildMap.get(a);if(i!==void 0)return i.setVisited(!0),i;let s=t.createViewNode(a);if(s)return s.setParent(t),s.setVisited(!0),e._renderableChildMap.set(a,s),e.children.push(s),s},t.addMissingNodes=(a,i=!1)=>{if(!a||!a.length)return;let s={};for(let o=0;o<a.length;++o){let c=a[o],f=t.addMissingNode(c);i&&f!==void 0&&r(s,f)}},t.addMissingChildren=a=>{if(!(!a||!a.length))for(let i=0;i<a.length;++i){let s=a[i];if(e.children.indexOf(s)===-1){s.setParent(t),e.children.push(s);let o=s.getRenderable();o&&e._renderableChildMap.set(o,s)}s.setVisited(!0)}},t.removeNode=a=>{let i=e.children.findIndex(o=>o===a);if(i<0)return!1;let s=a.getRenderable();return s&&e._renderableChildMap.delete(s),a.delete(),e.children.splice(i,1),!0},t.prepareNodes=()=>{for(let a=0;a<e.children.length;++a)e.children[a].setVisited(!1)},t.setVisited=a=>{e.visited=a},t.removeUnusedNodes=()=>{let a=0;for(let i=0;i<e.children.length;++i){let s=e.children[i];if(s.getVisited())e.children[a++]=s,s.setVisited(!1);else{let o=s.getRenderable();o&&e._renderableChildMap.delete(o),s.delete()}}e.children.length=a},t.createViewNode=a=>{if(!e.myFactory)return L0("Cannot create view nodes without my own factory"),null;let i=e.myFactory.createNode(a);return i&&i.setRenderable(a),i};let n=t.delete;t.delete=()=>{for(let a=0;a<e.children.length;a++)e.children[a].delete();n()}}var F0={renderable:null,myFactory:null,children:[],visited:!1};function Uc(t,e,r={}){Object.assign(e,F0,r),w.obj(t,e),w.event(t,e,"event"),e._renderableChildMap=new Map,w.get(t,e,["visited"]),w.setGet(t,e,["_parent","renderable","myFactory"]),w.getArray(t,e,["children"]),w.moveToProtected(t,e,["parent"]),B0(t,e)}var ve={newInstance:w.newInstance(Uc,"vtkViewNode"),extend:Uc,PASS_TYPES:_0};var{vtkWarningMacro:U0}=w;function N0(t){let e=[],r=0,n=t.getClassName(r++);for(;n;)e.push(n),n=t.getClassName(r++);return e}function G0(t,e){let r=e.join(" \u2192 ");return[`No ${t} implementation found for ${e[0]}.`,`Class hierarchy: ${r}.`,`A rendering Profile is likely missing for ${e[0]}.`,"Try importing '@kitware/vtk.js/Rendering/Profiles/All' or 'vtk.js/Sources/Rendering/Profiles/All',","or import the specific rendering profile needed by this renderable if known.","See https://kitware.github.io/vtk-js/docs/concepts_profile.html for details."].join(`
`)}function k0(t){return t.includes("vtkAbstractWidget")||t.includes("vtkWidgetRepresentation")}function b0(t,e){e.overrides||(e.overrides={}),e.classHierarchy.push("vtkViewNodeFactory"),t.createNode=r=>{if(r.isDeleted())return null;let n=N0(r),a=0,i=n[a++],s=!1,o=Object.keys(e.overrides);for(;i&&!s;)o.indexOf(i)!==-1?s=!0:i=r.getClassName(a++);if(!s)return k0(n)||U0(G0(t.getClassName(),n)),null;let c=e.overrides[i]();return c.setMyFactory(t),c}}var z0={};function Nc(t,e,r={}){Object.assign(e,z0,r),w.obj(t,e),b0(t,e)}var W0=w.newInstance(Nc,"vtkViewNodeFactory"),xa={newInstance:W0,extend:Nc};var Gc=Object.create(null);function _e(t,e){Gc[t]=e}function I0(t,e){e.classHierarchy.push("vtkOpenGLViewNodeFactory")}var H0={};function kc(t,e,r={}){Object.assign(e,H0,r),e.overrides=Gc,xa.extend(t,e,r),I0(t,e)}var j0=w.newInstance(kc,"vtkOpenGLViewNodeFactory"),bc={newInstance:j0,extend:kc};var Xt={};Kr(Xt,{ARRAY_TYPE:()=>me,EPSILON:()=>oe,RANDOM:()=>ct,equals:()=>K0,setMatrixArrayType:()=>P0,toRadian:()=>A0});var oe=1e-6,me=typeof Float32Array<"u"?Float32Array:Array,ct=Math.random;function P0(t){me=t}var $0=Math.PI/180;function A0(t){return t*$0}function K0(t,e){return Math.abs(t-e)<=oe*Math.max(1,Math.abs(t),Math.abs(e))}Math.hypot||(Math.hypot=function(){for(var t=0,e=arguments.length;e--;)t+=arguments[e]*arguments[e];return Math.sqrt(t)});var ne={};Kr(ne,{add:()=>dv,adjoint:()=>rv,clone:()=>Y0,copy:()=>q0,create:()=>rs,determinant:()=>nv,equals:()=>Sv,exactEquals:()=>yv,frob:()=>vv,fromMat2d:()=>uv,fromMat4:()=>X0,fromQuat:()=>lv,fromRotation:()=>cv,fromScaling:()=>fv,fromTranslation:()=>ov,fromValues:()=>Z0,identity:()=>J0,invert:()=>tv,mul:()=>xv,multiply:()=>zc,multiplyScalar:()=>Tv,multiplyScalarAndAdd:()=>mv,normalFromMat4:()=>pv,projection:()=>gv,rotate:()=>iv,scale:()=>sv,set:()=>Q0,str:()=>hv,sub:()=>Cv,subtract:()=>Wc,translate:()=>av,transpose:()=>ev});function rs(){var t=new me(9);return me!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[5]=0,t[6]=0,t[7]=0),t[0]=1,t[4]=1,t[8]=1,t}function X0(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[4],t[4]=e[5],t[5]=e[6],t[6]=e[8],t[7]=e[9],t[8]=e[10],t}function Y0(t){var e=new me(9);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e}function q0(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t}function Z0(t,e,r,n,a,i,s,o,c){var f=new me(9);return f[0]=t,f[1]=e,f[2]=r,f[3]=n,f[4]=a,f[5]=i,f[6]=s,f[7]=o,f[8]=c,f}function Q0(t,e,r,n,a,i,s,o,c,f){return t[0]=e,t[1]=r,t[2]=n,t[3]=a,t[4]=i,t[5]=s,t[6]=o,t[7]=c,t[8]=f,t}function J0(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t}function ev(t,e){if(t===e){var r=e[1],n=e[2],a=e[5];t[1]=e[3],t[2]=e[6],t[3]=r,t[5]=e[7],t[6]=n,t[7]=a}else t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8];return t}function tv(t,e){var r=e[0],n=e[1],a=e[2],i=e[3],s=e[4],o=e[5],c=e[6],f=e[7],u=e[8],g=u*s-o*f,l=-u*i+o*c,h=f*i-s*c,y=r*g+n*l+a*h;return y?(y=1/y,t[0]=g*y,t[1]=(-u*n+a*f)*y,t[2]=(o*n-a*s)*y,t[3]=l*y,t[4]=(u*r-a*c)*y,t[5]=(-o*r+a*i)*y,t[6]=h*y,t[7]=(-f*r+n*c)*y,t[8]=(s*r-n*i)*y,t):null}function rv(t,e){var r=e[0],n=e[1],a=e[2],i=e[3],s=e[4],o=e[5],c=e[6],f=e[7],u=e[8];return t[0]=s*u-o*f,t[1]=a*f-n*u,t[2]=n*o-a*s,t[3]=o*c-i*u,t[4]=r*u-a*c,t[5]=a*i-r*o,t[6]=i*f-s*c,t[7]=n*c-r*f,t[8]=r*s-n*i,t}function nv(t){var e=t[0],r=t[1],n=t[2],a=t[3],i=t[4],s=t[5],o=t[6],c=t[7],f=t[8];return e*(f*i-s*c)+r*(-f*a+s*o)+n*(c*a-i*o)}function zc(t,e,r){var n=e[0],a=e[1],i=e[2],s=e[3],o=e[4],c=e[5],f=e[6],u=e[7],g=e[8],l=r[0],h=r[1],y=r[2],p=r[3],m=r[4],d=r[5],x=r[6],T=r[7],v=r[8];return t[0]=l*n+h*s+y*f,t[1]=l*a+h*o+y*u,t[2]=l*i+h*c+y*g,t[3]=p*n+m*s+d*f,t[4]=p*a+m*o+d*u,t[5]=p*i+m*c+d*g,t[6]=x*n+T*s+v*f,t[7]=x*a+T*o+v*u,t[8]=x*i+T*c+v*g,t}function av(t,e,r){var n=e[0],a=e[1],i=e[2],s=e[3],o=e[4],c=e[5],f=e[6],u=e[7],g=e[8],l=r[0],h=r[1];return t[0]=n,t[1]=a,t[2]=i,t[3]=s,t[4]=o,t[5]=c,t[6]=l*n+h*s+f,t[7]=l*a+h*o+u,t[8]=l*i+h*c+g,t}function iv(t,e,r){var n=e[0],a=e[1],i=e[2],s=e[3],o=e[4],c=e[5],f=e[6],u=e[7],g=e[8],l=Math.sin(r),h=Math.cos(r);return t[0]=h*n+l*s,t[1]=h*a+l*o,t[2]=h*i+l*c,t[3]=h*s-l*n,t[4]=h*o-l*a,t[5]=h*c-l*i,t[6]=f,t[7]=u,t[8]=g,t}function sv(t,e,r){var n=r[0],a=r[1];return t[0]=n*e[0],t[1]=n*e[1],t[2]=n*e[2],t[3]=a*e[3],t[4]=a*e[4],t[5]=a*e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t}function ov(t,e){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=e[0],t[7]=e[1],t[8]=1,t}function cv(t,e){var r=Math.sin(e),n=Math.cos(e);return t[0]=n,t[1]=r,t[2]=0,t[3]=-r,t[4]=n,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t}function fv(t,e){return t[0]=e[0],t[1]=0,t[2]=0,t[3]=0,t[4]=e[1],t[5]=0,t[6]=0,t[7]=0,t[8]=1,t}function uv(t,e){return t[0]=e[0],t[1]=e[1],t[2]=0,t[3]=e[2],t[4]=e[3],t[5]=0,t[6]=e[4],t[7]=e[5],t[8]=1,t}function lv(t,e){var r=e[0],n=e[1],a=e[2],i=e[3],s=r+r,o=n+n,c=a+a,f=r*s,u=n*s,g=n*o,l=a*s,h=a*o,y=a*c,p=i*s,m=i*o,d=i*c;return t[0]=1-g-y,t[3]=u-d,t[6]=l+m,t[1]=u+d,t[4]=1-f-y,t[7]=h-p,t[2]=l-m,t[5]=h+p,t[8]=1-f-g,t}function pv(t,e){var r=e[0],n=e[1],a=e[2],i=e[3],s=e[4],o=e[5],c=e[6],f=e[7],u=e[8],g=e[9],l=e[10],h=e[11],y=e[12],p=e[13],m=e[14],d=e[15],x=r*o-n*s,T=r*c-a*s,v=r*f-i*s,C=n*c-a*o,O=n*f-i*o,M=a*f-i*c,S=u*p-g*y,E=u*m-l*y,R=u*d-h*y,D=g*m-l*p,V=g*d-h*p,U=l*d-h*m,B=x*U-T*V+v*D+C*R-O*E+M*S;return B?(B=1/B,t[0]=(o*U-c*V+f*D)*B,t[1]=(c*R-s*U-f*E)*B,t[2]=(s*V-o*R+f*S)*B,t[3]=(a*V-n*U-i*D)*B,t[4]=(r*U-a*R+i*E)*B,t[5]=(n*R-r*V-i*S)*B,t[6]=(p*M-m*O+d*C)*B,t[7]=(m*v-y*M-d*T)*B,t[8]=(y*O-p*v+d*x)*B,t):null}function gv(t,e,r){return t[0]=2/e,t[1]=0,t[2]=0,t[3]=0,t[4]=-2/r,t[5]=0,t[6]=-1,t[7]=1,t[8]=1,t}function hv(t){return"mat3("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+")"}function vv(t){return Math.hypot(t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7],t[8])}function dv(t,e,r){return t[0]=e[0]+r[0],t[1]=e[1]+r[1],t[2]=e[2]+r[2],t[3]=e[3]+r[3],t[4]=e[4]+r[4],t[5]=e[5]+r[5],t[6]=e[6]+r[6],t[7]=e[7]+r[7],t[8]=e[8]+r[8],t}function Wc(t,e,r){return t[0]=e[0]-r[0],t[1]=e[1]-r[1],t[2]=e[2]-r[2],t[3]=e[3]-r[3],t[4]=e[4]-r[4],t[5]=e[5]-r[5],t[6]=e[6]-r[6],t[7]=e[7]-r[7],t[8]=e[8]-r[8],t}function Tv(t,e,r){return t[0]=e[0]*r,t[1]=e[1]*r,t[2]=e[2]*r,t[3]=e[3]*r,t[4]=e[4]*r,t[5]=e[5]*r,t[6]=e[6]*r,t[7]=e[7]*r,t[8]=e[8]*r,t}function mv(t,e,r,n){return t[0]=e[0]+r[0]*n,t[1]=e[1]+r[1]*n,t[2]=e[2]+r[2]*n,t[3]=e[3]+r[3]*n,t[4]=e[4]+r[4]*n,t[5]=e[5]+r[5]*n,t[6]=e[6]+r[6]*n,t[7]=e[7]+r[7]*n,t[8]=e[8]+r[8]*n,t}function yv(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]&&t[6]===e[6]&&t[7]===e[7]&&t[8]===e[8]}function Sv(t,e){var r=t[0],n=t[1],a=t[2],i=t[3],s=t[4],o=t[5],c=t[6],f=t[7],u=t[8],g=e[0],l=e[1],h=e[2],y=e[3],p=e[4],m=e[5],d=e[6],x=e[7],T=e[8];return Math.abs(r-g)<=oe*Math.max(1,Math.abs(r),Math.abs(g))&&Math.abs(n-l)<=oe*Math.max(1,Math.abs(n),Math.abs(l))&&Math.abs(a-h)<=oe*Math.max(1,Math.abs(a),Math.abs(h))&&Math.abs(i-y)<=oe*Math.max(1,Math.abs(i),Math.abs(y))&&Math.abs(s-p)<=oe*Math.max(1,Math.abs(s),Math.abs(p))&&Math.abs(o-m)<=oe*Math.max(1,Math.abs(o),Math.abs(m))&&Math.abs(c-d)<=oe*Math.max(1,Math.abs(c),Math.abs(d))&&Math.abs(f-x)<=oe*Math.max(1,Math.abs(f),Math.abs(x))&&Math.abs(u-T)<=oe*Math.max(1,Math.abs(u),Math.abs(T))}var xv=zc,Cv=Wc;var L={};Kr(L,{add:()=>sd,adjoint:()=>Lv,clone:()=>wv,copy:()=>Rv,create:()=>Ov,determinant:()=>_v,equals:()=>ud,exactEquals:()=>fd,frob:()=>id,fromQuat:()=>Yv,fromQuat2:()=>Pv,fromRotation:()=>Wv,fromRotationTranslation:()=>jc,fromRotationTranslationScale:()=>Kv,fromRotationTranslationScaleOrigin:()=>Xv,fromScaling:()=>zv,fromTranslation:()=>bv,fromValues:()=>Ev,fromXRotation:()=>Iv,fromYRotation:()=>Hv,fromZRotation:()=>jv,frustum:()=>qv,getRotation:()=>Av,getScaling:()=>Pc,getTranslation:()=>$v,identity:()=>Ic,invert:()=>Vv,lookAt:()=>rd,mul:()=>ld,multiply:()=>Hc,multiplyScalar:()=>od,multiplyScalarAndAdd:()=>cd,ortho:()=>ed,orthoNO:()=>Ac,orthoZO:()=>td,perspective:()=>Zv,perspectiveFromFieldOfView:()=>Jv,perspectiveNO:()=>$c,perspectiveZO:()=>Qv,rotate:()=>Uv,rotateX:()=>Nv,rotateY:()=>Gv,rotateZ:()=>kv,scale:()=>Fv,set:()=>Mv,str:()=>ad,sub:()=>pd,subtract:()=>Kc,targetTo:()=>nd,translate:()=>Bv,transpose:()=>Dv});function Ov(){var t=new me(16);return me!=Float32Array&&(t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0),t[0]=1,t[5]=1,t[10]=1,t[15]=1,t}function wv(t){var e=new me(16);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function Rv(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function Ev(t,e,r,n,a,i,s,o,c,f,u,g,l,h,y,p){var m=new me(16);return m[0]=t,m[1]=e,m[2]=r,m[3]=n,m[4]=a,m[5]=i,m[6]=s,m[7]=o,m[8]=c,m[9]=f,m[10]=u,m[11]=g,m[12]=l,m[13]=h,m[14]=y,m[15]=p,m}function Mv(t,e,r,n,a,i,s,o,c,f,u,g,l,h,y,p,m){return t[0]=e,t[1]=r,t[2]=n,t[3]=a,t[4]=i,t[5]=s,t[6]=o,t[7]=c,t[8]=f,t[9]=u,t[10]=g,t[11]=l,t[12]=h,t[13]=y,t[14]=p,t[15]=m,t}function Ic(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function Dv(t,e){if(t===e){var r=e[1],n=e[2],a=e[3],i=e[6],s=e[7],o=e[11];t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=r,t[6]=e[9],t[7]=e[13],t[8]=n,t[9]=i,t[11]=e[14],t[12]=a,t[13]=s,t[14]=o}else t[0]=e[0],t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=e[1],t[5]=e[5],t[6]=e[9],t[7]=e[13],t[8]=e[2],t[9]=e[6],t[10]=e[10],t[11]=e[14],t[12]=e[3],t[13]=e[7],t[14]=e[11],t[15]=e[15];return t}function Vv(t,e){var r=e[0],n=e[1],a=e[2],i=e[3],s=e[4],o=e[5],c=e[6],f=e[7],u=e[8],g=e[9],l=e[10],h=e[11],y=e[12],p=e[13],m=e[14],d=e[15],x=r*o-n*s,T=r*c-a*s,v=r*f-i*s,C=n*c-a*o,O=n*f-i*o,M=a*f-i*c,S=u*p-g*y,E=u*m-l*y,R=u*d-h*y,D=g*m-l*p,V=g*d-h*p,U=l*d-h*m,B=x*U-T*V+v*D+C*R-O*E+M*S;return B?(B=1/B,t[0]=(o*U-c*V+f*D)*B,t[1]=(a*V-n*U-i*D)*B,t[2]=(p*M-m*O+d*C)*B,t[3]=(l*O-g*M-h*C)*B,t[4]=(c*R-s*U-f*E)*B,t[5]=(r*U-a*R+i*E)*B,t[6]=(m*v-y*M-d*T)*B,t[7]=(u*M-l*v+h*T)*B,t[8]=(s*V-o*R+f*S)*B,t[9]=(n*R-r*V-i*S)*B,t[10]=(y*O-p*v+d*x)*B,t[11]=(g*v-u*O-h*x)*B,t[12]=(o*E-s*D-c*S)*B,t[13]=(r*D-n*E+a*S)*B,t[14]=(p*T-y*C-m*x)*B,t[15]=(u*C-g*T+l*x)*B,t):null}function Lv(t,e){var r=e[0],n=e[1],a=e[2],i=e[3],s=e[4],o=e[5],c=e[6],f=e[7],u=e[8],g=e[9],l=e[10],h=e[11],y=e[12],p=e[13],m=e[14],d=e[15];return t[0]=o*(l*d-h*m)-g*(c*d-f*m)+p*(c*h-f*l),t[1]=-(n*(l*d-h*m)-g*(a*d-i*m)+p*(a*h-i*l)),t[2]=n*(c*d-f*m)-o*(a*d-i*m)+p*(a*f-i*c),t[3]=-(n*(c*h-f*l)-o*(a*h-i*l)+g*(a*f-i*c)),t[4]=-(s*(l*d-h*m)-u*(c*d-f*m)+y*(c*h-f*l)),t[5]=r*(l*d-h*m)-u*(a*d-i*m)+y*(a*h-i*l),t[6]=-(r*(c*d-f*m)-s*(a*d-i*m)+y*(a*f-i*c)),t[7]=r*(c*h-f*l)-s*(a*h-i*l)+u*(a*f-i*c),t[8]=s*(g*d-h*p)-u*(o*d-f*p)+y*(o*h-f*g),t[9]=-(r*(g*d-h*p)-u*(n*d-i*p)+y*(n*h-i*g)),t[10]=r*(o*d-f*p)-s*(n*d-i*p)+y*(n*f-i*o),t[11]=-(r*(o*h-f*g)-s*(n*h-i*g)+u*(n*f-i*o)),t[12]=-(s*(g*m-l*p)-u*(o*m-c*p)+y*(o*l-c*g)),t[13]=r*(g*m-l*p)-u*(n*m-a*p)+y*(n*l-a*g),t[14]=-(r*(o*m-c*p)-s*(n*m-a*p)+y*(n*c-a*o)),t[15]=r*(o*l-c*g)-s*(n*l-a*g)+u*(n*c-a*o),t}function _v(t){var e=t[0],r=t[1],n=t[2],a=t[3],i=t[4],s=t[5],o=t[6],c=t[7],f=t[8],u=t[9],g=t[10],l=t[11],h=t[12],y=t[13],p=t[14],m=t[15],d=e*s-r*i,x=e*o-n*i,T=e*c-a*i,v=r*o-n*s,C=r*c-a*s,O=n*c-a*o,M=f*y-u*h,S=f*p-g*h,E=f*m-l*h,R=u*p-g*y,D=u*m-l*y,V=g*m-l*p;return d*V-x*D+T*R+v*E-C*S+O*M}function Hc(t,e,r){var n=e[0],a=e[1],i=e[2],s=e[3],o=e[4],c=e[5],f=e[6],u=e[7],g=e[8],l=e[9],h=e[10],y=e[11],p=e[12],m=e[13],d=e[14],x=e[15],T=r[0],v=r[1],C=r[2],O=r[3];return t[0]=T*n+v*o+C*g+O*p,t[1]=T*a+v*c+C*l+O*m,t[2]=T*i+v*f+C*h+O*d,t[3]=T*s+v*u+C*y+O*x,T=r[4],v=r[5],C=r[6],O=r[7],t[4]=T*n+v*o+C*g+O*p,t[5]=T*a+v*c+C*l+O*m,t[6]=T*i+v*f+C*h+O*d,t[7]=T*s+v*u+C*y+O*x,T=r[8],v=r[9],C=r[10],O=r[11],t[8]=T*n+v*o+C*g+O*p,t[9]=T*a+v*c+C*l+O*m,t[10]=T*i+v*f+C*h+O*d,t[11]=T*s+v*u+C*y+O*x,T=r[12],v=r[13],C=r[14],O=r[15],t[12]=T*n+v*o+C*g+O*p,t[13]=T*a+v*c+C*l+O*m,t[14]=T*i+v*f+C*h+O*d,t[15]=T*s+v*u+C*y+O*x,t}function Bv(t,e,r){var n=r[0],a=r[1],i=r[2],s,o,c,f,u,g,l,h,y,p,m,d;return e===t?(t[12]=e[0]*n+e[4]*a+e[8]*i+e[12],t[13]=e[1]*n+e[5]*a+e[9]*i+e[13],t[14]=e[2]*n+e[6]*a+e[10]*i+e[14],t[15]=e[3]*n+e[7]*a+e[11]*i+e[15]):(s=e[0],o=e[1],c=e[2],f=e[3],u=e[4],g=e[5],l=e[6],h=e[7],y=e[8],p=e[9],m=e[10],d=e[11],t[0]=s,t[1]=o,t[2]=c,t[3]=f,t[4]=u,t[5]=g,t[6]=l,t[7]=h,t[8]=y,t[9]=p,t[10]=m,t[11]=d,t[12]=s*n+u*a+y*i+e[12],t[13]=o*n+g*a+p*i+e[13],t[14]=c*n+l*a+m*i+e[14],t[15]=f*n+h*a+d*i+e[15]),t}function Fv(t,e,r){var n=r[0],a=r[1],i=r[2];return t[0]=e[0]*n,t[1]=e[1]*n,t[2]=e[2]*n,t[3]=e[3]*n,t[4]=e[4]*a,t[5]=e[5]*a,t[6]=e[6]*a,t[7]=e[7]*a,t[8]=e[8]*i,t[9]=e[9]*i,t[10]=e[10]*i,t[11]=e[11]*i,t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function Uv(t,e,r,n){var a=n[0],i=n[1],s=n[2],o=Math.hypot(a,i,s),c,f,u,g,l,h,y,p,m,d,x,T,v,C,O,M,S,E,R,D,V,U,B,_;return o<oe?null:(o=1/o,a*=o,i*=o,s*=o,c=Math.sin(r),f=Math.cos(r),u=1-f,g=e[0],l=e[1],h=e[2],y=e[3],p=e[4],m=e[5],d=e[6],x=e[7],T=e[8],v=e[9],C=e[10],O=e[11],M=a*a*u+f,S=i*a*u+s*c,E=s*a*u-i*c,R=a*i*u-s*c,D=i*i*u+f,V=s*i*u+a*c,U=a*s*u+i*c,B=i*s*u-a*c,_=s*s*u+f,t[0]=g*M+p*S+T*E,t[1]=l*M+m*S+v*E,t[2]=h*M+d*S+C*E,t[3]=y*M+x*S+O*E,t[4]=g*R+p*D+T*V,t[5]=l*R+m*D+v*V,t[6]=h*R+d*D+C*V,t[7]=y*R+x*D+O*V,t[8]=g*U+p*B+T*_,t[9]=l*U+m*B+v*_,t[10]=h*U+d*B+C*_,t[11]=y*U+x*B+O*_,e!==t&&(t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t)}function Nv(t,e,r){var n=Math.sin(r),a=Math.cos(r),i=e[4],s=e[5],o=e[6],c=e[7],f=e[8],u=e[9],g=e[10],l=e[11];return e!==t&&(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[4]=i*a+f*n,t[5]=s*a+u*n,t[6]=o*a+g*n,t[7]=c*a+l*n,t[8]=f*a-i*n,t[9]=u*a-s*n,t[10]=g*a-o*n,t[11]=l*a-c*n,t}function Gv(t,e,r){var n=Math.sin(r),a=Math.cos(r),i=e[0],s=e[1],o=e[2],c=e[3],f=e[8],u=e[9],g=e[10],l=e[11];return e!==t&&(t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=i*a-f*n,t[1]=s*a-u*n,t[2]=o*a-g*n,t[3]=c*a-l*n,t[8]=i*n+f*a,t[9]=s*n+u*a,t[10]=o*n+g*a,t[11]=c*n+l*a,t}function kv(t,e,r){var n=Math.sin(r),a=Math.cos(r),i=e[0],s=e[1],o=e[2],c=e[3],f=e[4],u=e[5],g=e[6],l=e[7];return e!==t&&(t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=i*a+f*n,t[1]=s*a+u*n,t[2]=o*a+g*n,t[3]=c*a+l*n,t[4]=f*a-i*n,t[5]=u*a-s*n,t[6]=g*a-o*n,t[7]=l*a-c*n,t}function bv(t,e){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=e[0],t[13]=e[1],t[14]=e[2],t[15]=1,t}function zv(t,e){return t[0]=e[0],t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=e[1],t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=e[2],t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function Wv(t,e,r){var n=r[0],a=r[1],i=r[2],s=Math.hypot(n,a,i),o,c,f;return s<oe?null:(s=1/s,n*=s,a*=s,i*=s,o=Math.sin(e),c=Math.cos(e),f=1-c,t[0]=n*n*f+c,t[1]=a*n*f+i*o,t[2]=i*n*f-a*o,t[3]=0,t[4]=n*a*f-i*o,t[5]=a*a*f+c,t[6]=i*a*f+n*o,t[7]=0,t[8]=n*i*f+a*o,t[9]=a*i*f-n*o,t[10]=i*i*f+c,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t)}function Iv(t,e){var r=Math.sin(e),n=Math.cos(e);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=n,t[6]=r,t[7]=0,t[8]=0,t[9]=-r,t[10]=n,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function Hv(t,e){var r=Math.sin(e),n=Math.cos(e);return t[0]=n,t[1]=0,t[2]=-r,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=r,t[9]=0,t[10]=n,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function jv(t,e){var r=Math.sin(e),n=Math.cos(e);return t[0]=n,t[1]=r,t[2]=0,t[3]=0,t[4]=-r,t[5]=n,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function jc(t,e,r){var n=e[0],a=e[1],i=e[2],s=e[3],o=n+n,c=a+a,f=i+i,u=n*o,g=n*c,l=n*f,h=a*c,y=a*f,p=i*f,m=s*o,d=s*c,x=s*f;return t[0]=1-(h+p),t[1]=g+x,t[2]=l-d,t[3]=0,t[4]=g-x,t[5]=1-(u+p),t[6]=y+m,t[7]=0,t[8]=l+d,t[9]=y-m,t[10]=1-(u+h),t[11]=0,t[12]=r[0],t[13]=r[1],t[14]=r[2],t[15]=1,t}function Pv(t,e){var r=new me(3),n=-e[0],a=-e[1],i=-e[2],s=e[3],o=e[4],c=e[5],f=e[6],u=e[7],g=n*n+a*a+i*i+s*s;return g>0?(r[0]=(o*s+u*n+c*i-f*a)*2/g,r[1]=(c*s+u*a+f*n-o*i)*2/g,r[2]=(f*s+u*i+o*a-c*n)*2/g):(r[0]=(o*s+u*n+c*i-f*a)*2,r[1]=(c*s+u*a+f*n-o*i)*2,r[2]=(f*s+u*i+o*a-c*n)*2),jc(t,e,r),t}function $v(t,e){return t[0]=e[12],t[1]=e[13],t[2]=e[14],t}function Pc(t,e){var r=e[0],n=e[1],a=e[2],i=e[4],s=e[5],o=e[6],c=e[8],f=e[9],u=e[10];return t[0]=Math.hypot(r,n,a),t[1]=Math.hypot(i,s,o),t[2]=Math.hypot(c,f,u),t}function Av(t,e){var r=new me(3);Pc(r,e);var n=1/r[0],a=1/r[1],i=1/r[2],s=e[0]*n,o=e[1]*a,c=e[2]*i,f=e[4]*n,u=e[5]*a,g=e[6]*i,l=e[8]*n,h=e[9]*a,y=e[10]*i,p=s+u+y,m=0;return p>0?(m=Math.sqrt(p+1)*2,t[3]=.25*m,t[0]=(g-h)/m,t[1]=(l-c)/m,t[2]=(o-f)/m):s>u&&s>y?(m=Math.sqrt(1+s-u-y)*2,t[3]=(g-h)/m,t[0]=.25*m,t[1]=(o+f)/m,t[2]=(l+c)/m):u>y?(m=Math.sqrt(1+u-s-y)*2,t[3]=(l-c)/m,t[0]=(o+f)/m,t[1]=.25*m,t[2]=(g+h)/m):(m=Math.sqrt(1+y-s-u)*2,t[3]=(o-f)/m,t[0]=(l+c)/m,t[1]=(g+h)/m,t[2]=.25*m),t}function Kv(t,e,r,n){var a=e[0],i=e[1],s=e[2],o=e[3],c=a+a,f=i+i,u=s+s,g=a*c,l=a*f,h=a*u,y=i*f,p=i*u,m=s*u,d=o*c,x=o*f,T=o*u,v=n[0],C=n[1],O=n[2];return t[0]=(1-(y+m))*v,t[1]=(l+T)*v,t[2]=(h-x)*v,t[3]=0,t[4]=(l-T)*C,t[5]=(1-(g+m))*C,t[6]=(p+d)*C,t[7]=0,t[8]=(h+x)*O,t[9]=(p-d)*O,t[10]=(1-(g+y))*O,t[11]=0,t[12]=r[0],t[13]=r[1],t[14]=r[2],t[15]=1,t}function Xv(t,e,r,n,a){var i=e[0],s=e[1],o=e[2],c=e[3],f=i+i,u=s+s,g=o+o,l=i*f,h=i*u,y=i*g,p=s*u,m=s*g,d=o*g,x=c*f,T=c*u,v=c*g,C=n[0],O=n[1],M=n[2],S=a[0],E=a[1],R=a[2],D=(1-(p+d))*C,V=(h+v)*C,U=(y-T)*C,B=(h-v)*O,_=(1-(l+d))*O,N=(m+x)*O,k=(y+T)*M,F=(m-x)*M,G=(1-(l+p))*M;return t[0]=D,t[1]=V,t[2]=U,t[3]=0,t[4]=B,t[5]=_,t[6]=N,t[7]=0,t[8]=k,t[9]=F,t[10]=G,t[11]=0,t[12]=r[0]+S-(D*S+B*E+k*R),t[13]=r[1]+E-(V*S+_*E+F*R),t[14]=r[2]+R-(U*S+N*E+G*R),t[15]=1,t}function Yv(t,e){var r=e[0],n=e[1],a=e[2],i=e[3],s=r+r,o=n+n,c=a+a,f=r*s,u=n*s,g=n*o,l=a*s,h=a*o,y=a*c,p=i*s,m=i*o,d=i*c;return t[0]=1-g-y,t[1]=u+d,t[2]=l-m,t[3]=0,t[4]=u-d,t[5]=1-f-y,t[6]=h+p,t[7]=0,t[8]=l+m,t[9]=h-p,t[10]=1-f-g,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function qv(t,e,r,n,a,i,s){var o=1/(r-e),c=1/(a-n),f=1/(i-s);return t[0]=i*2*o,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=i*2*c,t[6]=0,t[7]=0,t[8]=(r+e)*o,t[9]=(a+n)*c,t[10]=(s+i)*f,t[11]=-1,t[12]=0,t[13]=0,t[14]=s*i*2*f,t[15]=0,t}function $c(t,e,r,n,a){var i=1/Math.tan(e/2),s;return t[0]=i/r,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=i,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=-1,t[12]=0,t[13]=0,t[15]=0,a!=null&&a!==1/0?(s=1/(n-a),t[10]=(a+n)*s,t[14]=2*a*n*s):(t[10]=-1,t[14]=-2*n),t}var Zv=$c;function Qv(t,e,r,n,a){var i=1/Math.tan(e/2),s;return t[0]=i/r,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=i,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[11]=-1,t[12]=0,t[13]=0,t[15]=0,a!=null&&a!==1/0?(s=1/(n-a),t[10]=a*s,t[14]=a*n*s):(t[10]=-1,t[14]=-n),t}function Jv(t,e,r,n){var a=Math.tan(e.upDegrees*Math.PI/180),i=Math.tan(e.downDegrees*Math.PI/180),s=Math.tan(e.leftDegrees*Math.PI/180),o=Math.tan(e.rightDegrees*Math.PI/180),c=2/(s+o),f=2/(a+i);return t[0]=c,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=f,t[6]=0,t[7]=0,t[8]=-((s-o)*c*.5),t[9]=(a-i)*f*.5,t[10]=n/(r-n),t[11]=-1,t[12]=0,t[13]=0,t[14]=n*r/(r-n),t[15]=0,t}function Ac(t,e,r,n,a,i,s){var o=1/(e-r),c=1/(n-a),f=1/(i-s);return t[0]=-2*o,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*c,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=2*f,t[11]=0,t[12]=(e+r)*o,t[13]=(a+n)*c,t[14]=(s+i)*f,t[15]=1,t}var ed=Ac;function td(t,e,r,n,a,i,s){var o=1/(e-r),c=1/(n-a),f=1/(i-s);return t[0]=-2*o,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*c,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=f,t[11]=0,t[12]=(e+r)*o,t[13]=(a+n)*c,t[14]=i*f,t[15]=1,t}function rd(t,e,r,n){var a,i,s,o,c,f,u,g,l,h,y=e[0],p=e[1],m=e[2],d=n[0],x=n[1],T=n[2],v=r[0],C=r[1],O=r[2];return Math.abs(y-v)<oe&&Math.abs(p-C)<oe&&Math.abs(m-O)<oe?Ic(t):(u=y-v,g=p-C,l=m-O,h=1/Math.hypot(u,g,l),u*=h,g*=h,l*=h,a=x*l-T*g,i=T*u-d*l,s=d*g-x*u,h=Math.hypot(a,i,s),h?(h=1/h,a*=h,i*=h,s*=h):(a=0,i=0,s=0),o=g*s-l*i,c=l*a-u*s,f=u*i-g*a,h=Math.hypot(o,c,f),h?(h=1/h,o*=h,c*=h,f*=h):(o=0,c=0,f=0),t[0]=a,t[1]=o,t[2]=u,t[3]=0,t[4]=i,t[5]=c,t[6]=g,t[7]=0,t[8]=s,t[9]=f,t[10]=l,t[11]=0,t[12]=-(a*y+i*p+s*m),t[13]=-(o*y+c*p+f*m),t[14]=-(u*y+g*p+l*m),t[15]=1,t)}function nd(t,e,r,n){var a=e[0],i=e[1],s=e[2],o=n[0],c=n[1],f=n[2],u=a-r[0],g=i-r[1],l=s-r[2],h=u*u+g*g+l*l;h>0&&(h=1/Math.sqrt(h),u*=h,g*=h,l*=h);var y=c*l-f*g,p=f*u-o*l,m=o*g-c*u;return h=y*y+p*p+m*m,h>0&&(h=1/Math.sqrt(h),y*=h,p*=h,m*=h),t[0]=y,t[1]=p,t[2]=m,t[3]=0,t[4]=g*m-l*p,t[5]=l*y-u*m,t[6]=u*p-g*y,t[7]=0,t[8]=u,t[9]=g,t[10]=l,t[11]=0,t[12]=a,t[13]=i,t[14]=s,t[15]=1,t}function ad(t){return"mat4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+", "+t[9]+", "+t[10]+", "+t[11]+", "+t[12]+", "+t[13]+", "+t[14]+", "+t[15]+")"}function id(t){return Math.hypot(t[0],t[1],t[2],t[3],t[4],t[5],t[6],t[7],t[8],t[9],t[10],t[11],t[12],t[13],t[14],t[15])}function sd(t,e,r){return t[0]=e[0]+r[0],t[1]=e[1]+r[1],t[2]=e[2]+r[2],t[3]=e[3]+r[3],t[4]=e[4]+r[4],t[5]=e[5]+r[5],t[6]=e[6]+r[6],t[7]=e[7]+r[7],t[8]=e[8]+r[8],t[9]=e[9]+r[9],t[10]=e[10]+r[10],t[11]=e[11]+r[11],t[12]=e[12]+r[12],t[13]=e[13]+r[13],t[14]=e[14]+r[14],t[15]=e[15]+r[15],t}function Kc(t,e,r){return t[0]=e[0]-r[0],t[1]=e[1]-r[1],t[2]=e[2]-r[2],t[3]=e[3]-r[3],t[4]=e[4]-r[4],t[5]=e[5]-r[5],t[6]=e[6]-r[6],t[7]=e[7]-r[7],t[8]=e[8]-r[8],t[9]=e[9]-r[9],t[10]=e[10]-r[10],t[11]=e[11]-r[11],t[12]=e[12]-r[12],t[13]=e[13]-r[13],t[14]=e[14]-r[14],t[15]=e[15]-r[15],t}function od(t,e,r){return t[0]=e[0]*r,t[1]=e[1]*r,t[2]=e[2]*r,t[3]=e[3]*r,t[4]=e[4]*r,t[5]=e[5]*r,t[6]=e[6]*r,t[7]=e[7]*r,t[8]=e[8]*r,t[9]=e[9]*r,t[10]=e[10]*r,t[11]=e[11]*r,t[12]=e[12]*r,t[13]=e[13]*r,t[14]=e[14]*r,t[15]=e[15]*r,t}function cd(t,e,r,n){return t[0]=e[0]+r[0]*n,t[1]=e[1]+r[1]*n,t[2]=e[2]+r[2]*n,t[3]=e[3]+r[3]*n,t[4]=e[4]+r[4]*n,t[5]=e[5]+r[5]*n,t[6]=e[6]+r[6]*n,t[7]=e[7]+r[7]*n,t[8]=e[8]+r[8]*n,t[9]=e[9]+r[9]*n,t[10]=e[10]+r[10]*n,t[11]=e[11]+r[11]*n,t[12]=e[12]+r[12]*n,t[13]=e[13]+r[13]*n,t[14]=e[14]+r[14]*n,t[15]=e[15]+r[15]*n,t}function fd(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]&&t[6]===e[6]&&t[7]===e[7]&&t[8]===e[8]&&t[9]===e[9]&&t[10]===e[10]&&t[11]===e[11]&&t[12]===e[12]&&t[13]===e[13]&&t[14]===e[14]&&t[15]===e[15]}function ud(t,e){var r=t[0],n=t[1],a=t[2],i=t[3],s=t[4],o=t[5],c=t[6],f=t[7],u=t[8],g=t[9],l=t[10],h=t[11],y=t[12],p=t[13],m=t[14],d=t[15],x=e[0],T=e[1],v=e[2],C=e[3],O=e[4],M=e[5],S=e[6],E=e[7],R=e[8],D=e[9],V=e[10],U=e[11],B=e[12],_=e[13],N=e[14],k=e[15];return Math.abs(r-x)<=oe*Math.max(1,Math.abs(r),Math.abs(x))&&Math.abs(n-T)<=oe*Math.max(1,Math.abs(n),Math.abs(T))&&Math.abs(a-v)<=oe*Math.max(1,Math.abs(a),Math.abs(v))&&Math.abs(i-C)<=oe*Math.max(1,Math.abs(i),Math.abs(C))&&Math.abs(s-O)<=oe*Math.max(1,Math.abs(s),Math.abs(O))&&Math.abs(o-M)<=oe*Math.max(1,Math.abs(o),Math.abs(M))&&Math.abs(c-S)<=oe*Math.max(1,Math.abs(c),Math.abs(S))&&Math.abs(f-E)<=oe*Math.max(1,Math.abs(f),Math.abs(E))&&Math.abs(u-R)<=oe*Math.max(1,Math.abs(u),Math.abs(R))&&Math.abs(g-D)<=oe*Math.max(1,Math.abs(g),Math.abs(D))&&Math.abs(l-V)<=oe*Math.max(1,Math.abs(l),Math.abs(V))&&Math.abs(h-U)<=oe*Math.max(1,Math.abs(h),Math.abs(U))&&Math.abs(y-B)<=oe*Math.max(1,Math.abs(y),Math.abs(B))&&Math.abs(p-_)<=oe*Math.max(1,Math.abs(p),Math.abs(_))&&Math.abs(m-N)<=oe*Math.max(1,Math.abs(m),Math.abs(N))&&Math.abs(d-k)<=oe*Math.max(1,Math.abs(d),Math.abs(k))}var ld=Hc,pd=Kc;var Me={};Kr(Me,{add:()=>FT,calculateW:()=>CT,clone:()=>VT,conjugate:()=>ET,copy:()=>_T,create:()=>ds,dot:()=>hf,equals:()=>zT,exactEquals:()=>bT,exp:()=>uf,fromEuler:()=>MT,fromMat3:()=>pf,fromValues:()=>LT,getAngle:()=>mT,getAxisAngle:()=>TT,identity:()=>dT,invert:()=>RT,len:()=>GT,length:()=>vf,lerp:()=>NT,ln:()=>lf,mul:()=>UT,multiply:()=>ff,normalize:()=>Ts,pow:()=>OT,random:()=>wT,rotateX:()=>yT,rotateY:()=>ST,rotateZ:()=>xT,rotationTo:()=>WT,scale:()=>gf,set:()=>BT,setAxes:()=>HT,setAxisAngle:()=>cf,slerp:()=>Ma,sqlerp:()=>IT,sqrLen:()=>kT,squaredLength:()=>df,str:()=>DT});var W={};Kr(W,{add:()=>dd,angle:()=>Gd,bezier:()=>Dd,ceil:()=>Td,clone:()=>gd,copy:()=>hd,create:()=>Ca,cross:()=>Rn,dist:()=>Pd,distance:()=>Qc,div:()=>jd,divide:()=>Zc,dot:()=>wa,equals:()=>Wd,exactEquals:()=>zd,floor:()=>md,forEach:()=>Kd,fromValues:()=>Oa,hermite:()=>Md,inverse:()=>Rd,len:()=>as,length:()=>Xc,lerp:()=>Ed,max:()=>Sd,min:()=>yd,mul:()=>Hd,multiply:()=>qc,negate:()=>wd,normalize:()=>ns,random:()=>Vd,rotateX:()=>Fd,rotateY:()=>Ud,rotateZ:()=>Nd,round:()=>xd,scale:()=>Cd,scaleAndAdd:()=>Od,set:()=>vd,sqrDist:()=>$d,sqrLen:()=>Ad,squaredDistance:()=>Jc,squaredLength:()=>ef,str:()=>bd,sub:()=>Id,subtract:()=>Yc,transformMat3:()=>_d,transformMat4:()=>Ld,transformQuat:()=>Bd,zero:()=>kd});function Ca(){var t=new me(3);return me!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t}function gd(t){var e=new me(3);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e}function Xc(t){var e=t[0],r=t[1],n=t[2];return Math.hypot(e,r,n)}function Oa(t,e,r){var n=new me(3);return n[0]=t,n[1]=e,n[2]=r,n}function hd(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t}function vd(t,e,r,n){return t[0]=e,t[1]=r,t[2]=n,t}function dd(t,e,r){return t[0]=e[0]+r[0],t[1]=e[1]+r[1],t[2]=e[2]+r[2],t}function Yc(t,e,r){return t[0]=e[0]-r[0],t[1]=e[1]-r[1],t[2]=e[2]-r[2],t}function qc(t,e,r){return t[0]=e[0]*r[0],t[1]=e[1]*r[1],t[2]=e[2]*r[2],t}function Zc(t,e,r){return t[0]=e[0]/r[0],t[1]=e[1]/r[1],t[2]=e[2]/r[2],t}function Td(t,e){return t[0]=Math.ceil(e[0]),t[1]=Math.ceil(e[1]),t[2]=Math.ceil(e[2]),t}function md(t,e){return t[0]=Math.floor(e[0]),t[1]=Math.floor(e[1]),t[2]=Math.floor(e[2]),t}function yd(t,e,r){return t[0]=Math.min(e[0],r[0]),t[1]=Math.min(e[1],r[1]),t[2]=Math.min(e[2],r[2]),t}function Sd(t,e,r){return t[0]=Math.max(e[0],r[0]),t[1]=Math.max(e[1],r[1]),t[2]=Math.max(e[2],r[2]),t}function xd(t,e){return t[0]=Math.round(e[0]),t[1]=Math.round(e[1]),t[2]=Math.round(e[2]),t}function Cd(t,e,r){return t[0]=e[0]*r,t[1]=e[1]*r,t[2]=e[2]*r,t}function Od(t,e,r,n){return t[0]=e[0]+r[0]*n,t[1]=e[1]+r[1]*n,t[2]=e[2]+r[2]*n,t}function Qc(t,e){var r=e[0]-t[0],n=e[1]-t[1],a=e[2]-t[2];return Math.hypot(r,n,a)}function Jc(t,e){var r=e[0]-t[0],n=e[1]-t[1],a=e[2]-t[2];return r*r+n*n+a*a}function ef(t){var e=t[0],r=t[1],n=t[2];return e*e+r*r+n*n}function wd(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t}function Rd(t,e){return t[0]=1/e[0],t[1]=1/e[1],t[2]=1/e[2],t}function ns(t,e){var r=e[0],n=e[1],a=e[2],i=r*r+n*n+a*a;return i>0&&(i=1/Math.sqrt(i)),t[0]=e[0]*i,t[1]=e[1]*i,t[2]=e[2]*i,t}function wa(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}function Rn(t,e,r){var n=e[0],a=e[1],i=e[2],s=r[0],o=r[1],c=r[2];return t[0]=a*c-i*o,t[1]=i*s-n*c,t[2]=n*o-a*s,t}function Ed(t,e,r,n){var a=e[0],i=e[1],s=e[2];return t[0]=a+n*(r[0]-a),t[1]=i+n*(r[1]-i),t[2]=s+n*(r[2]-s),t}function Md(t,e,r,n,a,i){var s=i*i,o=s*(2*i-3)+1,c=s*(i-2)+i,f=s*(i-1),u=s*(3-2*i);return t[0]=e[0]*o+r[0]*c+n[0]*f+a[0]*u,t[1]=e[1]*o+r[1]*c+n[1]*f+a[1]*u,t[2]=e[2]*o+r[2]*c+n[2]*f+a[2]*u,t}function Dd(t,e,r,n,a,i){var s=1-i,o=s*s,c=i*i,f=o*s,u=3*i*o,g=3*c*s,l=c*i;return t[0]=e[0]*f+r[0]*u+n[0]*g+a[0]*l,t[1]=e[1]*f+r[1]*u+n[1]*g+a[1]*l,t[2]=e[2]*f+r[2]*u+n[2]*g+a[2]*l,t}function Vd(t,e){e=e||1;var r=ct()*2*Math.PI,n=ct()*2-1,a=Math.sqrt(1-n*n)*e;return t[0]=Math.cos(r)*a,t[1]=Math.sin(r)*a,t[2]=n*e,t}function Ld(t,e,r){var n=e[0],a=e[1],i=e[2],s=r[3]*n+r[7]*a+r[11]*i+r[15];return s=s||1,t[0]=(r[0]*n+r[4]*a+r[8]*i+r[12])/s,t[1]=(r[1]*n+r[5]*a+r[9]*i+r[13])/s,t[2]=(r[2]*n+r[6]*a+r[10]*i+r[14])/s,t}function _d(t,e,r){var n=e[0],a=e[1],i=e[2];return t[0]=n*r[0]+a*r[3]+i*r[6],t[1]=n*r[1]+a*r[4]+i*r[7],t[2]=n*r[2]+a*r[5]+i*r[8],t}function Bd(t,e,r){var n=r[0],a=r[1],i=r[2],s=r[3],o=e[0],c=e[1],f=e[2],u=a*f-i*c,g=i*o-n*f,l=n*c-a*o,h=a*l-i*g,y=i*u-n*l,p=n*g-a*u,m=s*2;return u*=m,g*=m,l*=m,h*=2,y*=2,p*=2,t[0]=o+u+h,t[1]=c+g+y,t[2]=f+l+p,t}function Fd(t,e,r,n){var a=[],i=[];return a[0]=e[0]-r[0],a[1]=e[1]-r[1],a[2]=e[2]-r[2],i[0]=a[0],i[1]=a[1]*Math.cos(n)-a[2]*Math.sin(n),i[2]=a[1]*Math.sin(n)+a[2]*Math.cos(n),t[0]=i[0]+r[0],t[1]=i[1]+r[1],t[2]=i[2]+r[2],t}function Ud(t,e,r,n){var a=[],i=[];return a[0]=e[0]-r[0],a[1]=e[1]-r[1],a[2]=e[2]-r[2],i[0]=a[2]*Math.sin(n)+a[0]*Math.cos(n),i[1]=a[1],i[2]=a[2]*Math.cos(n)-a[0]*Math.sin(n),t[0]=i[0]+r[0],t[1]=i[1]+r[1],t[2]=i[2]+r[2],t}function Nd(t,e,r,n){var a=[],i=[];return a[0]=e[0]-r[0],a[1]=e[1]-r[1],a[2]=e[2]-r[2],i[0]=a[0]*Math.cos(n)-a[1]*Math.sin(n),i[1]=a[0]*Math.sin(n)+a[1]*Math.cos(n),i[2]=a[2],t[0]=i[0]+r[0],t[1]=i[1]+r[1],t[2]=i[2]+r[2],t}function Gd(t,e){var r=t[0],n=t[1],a=t[2],i=e[0],s=e[1],o=e[2],c=Math.sqrt(r*r+n*n+a*a),f=Math.sqrt(i*i+s*s+o*o),u=c*f,g=u&&wa(t,e)/u;return Math.acos(Math.min(Math.max(g,-1),1))}function kd(t){return t[0]=0,t[1]=0,t[2]=0,t}function bd(t){return"vec3("+t[0]+", "+t[1]+", "+t[2]+")"}function zd(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]}function Wd(t,e){var r=t[0],n=t[1],a=t[2],i=e[0],s=e[1],o=e[2];return Math.abs(r-i)<=oe*Math.max(1,Math.abs(r),Math.abs(i))&&Math.abs(n-s)<=oe*Math.max(1,Math.abs(n),Math.abs(s))&&Math.abs(a-o)<=oe*Math.max(1,Math.abs(a),Math.abs(o))}var Id=Yc,Hd=qc,jd=Zc,Pd=Qc,$d=Jc,as=Xc,Ad=ef,Kd=(function(){var t=Ca();return function(e,r,n,a,i,s){var o,c;for(r||(r=3),n||(n=0),a?c=Math.min(a*r+n,e.length):c=e.length,o=n;o<c;o+=r)t[0]=e[o],t[1]=e[o+1],t[2]=e[o+2],i(t,t,s),e[o]=t[0],e[o+1]=t[1],e[o+2]=t[2];return e}})();var He={};Kr(He,{add:()=>fs,ceil:()=>Xd,clone:()=>is,copy:()=>os,create:()=>tf,cross:()=>rT,dist:()=>lT,distance:()=>sf,div:()=>uT,divide:()=>af,dot:()=>ps,equals:()=>vs,exactEquals:()=>hs,floor:()=>Yd,forEach:()=>vT,fromValues:()=>ss,inverse:()=>tT,len:()=>gT,length:()=>Ra,lerp:()=>gs,max:()=>Zd,min:()=>qd,mul:()=>fT,multiply:()=>nf,negate:()=>eT,normalize:()=>ls,random:()=>nT,round:()=>Qd,scale:()=>us,scaleAndAdd:()=>Jd,set:()=>cs,sqrDist:()=>pT,sqrLen:()=>hT,squaredDistance:()=>of,squaredLength:()=>Ea,str:()=>oT,sub:()=>cT,subtract:()=>rf,transformMat4:()=>aT,transformQuat:()=>iT,zero:()=>sT});function tf(){var t=new me(4);return me!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0,t[3]=0),t}function is(t){var e=new me(4);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e}function ss(t,e,r,n){var a=new me(4);return a[0]=t,a[1]=e,a[2]=r,a[3]=n,a}function os(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t}function cs(t,e,r,n,a){return t[0]=e,t[1]=r,t[2]=n,t[3]=a,t}function fs(t,e,r){return t[0]=e[0]+r[0],t[1]=e[1]+r[1],t[2]=e[2]+r[2],t[3]=e[3]+r[3],t}function rf(t,e,r){return t[0]=e[0]-r[0],t[1]=e[1]-r[1],t[2]=e[2]-r[2],t[3]=e[3]-r[3],t}function nf(t,e,r){return t[0]=e[0]*r[0],t[1]=e[1]*r[1],t[2]=e[2]*r[2],t[3]=e[3]*r[3],t}function af(t,e,r){return t[0]=e[0]/r[0],t[1]=e[1]/r[1],t[2]=e[2]/r[2],t[3]=e[3]/r[3],t}function Xd(t,e){return t[0]=Math.ceil(e[0]),t[1]=Math.ceil(e[1]),t[2]=Math.ceil(e[2]),t[3]=Math.ceil(e[3]),t}function Yd(t,e){return t[0]=Math.floor(e[0]),t[1]=Math.floor(e[1]),t[2]=Math.floor(e[2]),t[3]=Math.floor(e[3]),t}function qd(t,e,r){return t[0]=Math.min(e[0],r[0]),t[1]=Math.min(e[1],r[1]),t[2]=Math.min(e[2],r[2]),t[3]=Math.min(e[3],r[3]),t}function Zd(t,e,r){return t[0]=Math.max(e[0],r[0]),t[1]=Math.max(e[1],r[1]),t[2]=Math.max(e[2],r[2]),t[3]=Math.max(e[3],r[3]),t}function Qd(t,e){return t[0]=Math.round(e[0]),t[1]=Math.round(e[1]),t[2]=Math.round(e[2]),t[3]=Math.round(e[3]),t}function us(t,e,r){return t[0]=e[0]*r,t[1]=e[1]*r,t[2]=e[2]*r,t[3]=e[3]*r,t}function Jd(t,e,r,n){return t[0]=e[0]+r[0]*n,t[1]=e[1]+r[1]*n,t[2]=e[2]+r[2]*n,t[3]=e[3]+r[3]*n,t}function sf(t,e){var r=e[0]-t[0],n=e[1]-t[1],a=e[2]-t[2],i=e[3]-t[3];return Math.hypot(r,n,a,i)}function of(t,e){var r=e[0]-t[0],n=e[1]-t[1],a=e[2]-t[2],i=e[3]-t[3];return r*r+n*n+a*a+i*i}function Ra(t){var e=t[0],r=t[1],n=t[2],a=t[3];return Math.hypot(e,r,n,a)}function Ea(t){var e=t[0],r=t[1],n=t[2],a=t[3];return e*e+r*r+n*n+a*a}function eT(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=-e[3],t}function tT(t,e){return t[0]=1/e[0],t[1]=1/e[1],t[2]=1/e[2],t[3]=1/e[3],t}function ls(t,e){var r=e[0],n=e[1],a=e[2],i=e[3],s=r*r+n*n+a*a+i*i;return s>0&&(s=1/Math.sqrt(s)),t[0]=r*s,t[1]=n*s,t[2]=a*s,t[3]=i*s,t}function ps(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]+t[3]*e[3]}function rT(t,e,r,n){var a=r[0]*n[1]-r[1]*n[0],i=r[0]*n[2]-r[2]*n[0],s=r[0]*n[3]-r[3]*n[0],o=r[1]*n[2]-r[2]*n[1],c=r[1]*n[3]-r[3]*n[1],f=r[2]*n[3]-r[3]*n[2],u=e[0],g=e[1],l=e[2],h=e[3];return t[0]=g*f-l*c+h*o,t[1]=-(u*f)+l*s-h*i,t[2]=u*c-g*s+h*a,t[3]=-(u*o)+g*i-l*a,t}function gs(t,e,r,n){var a=e[0],i=e[1],s=e[2],o=e[3];return t[0]=a+n*(r[0]-a),t[1]=i+n*(r[1]-i),t[2]=s+n*(r[2]-s),t[3]=o+n*(r[3]-o),t}function nT(t,e){e=e||1;var r,n,a,i,s,o;do r=ct()*2-1,n=ct()*2-1,s=r*r+n*n;while(s>=1);do a=ct()*2-1,i=ct()*2-1,o=a*a+i*i;while(o>=1);var c=Math.sqrt((1-s)/o);return t[0]=e*r,t[1]=e*n,t[2]=e*a*c,t[3]=e*i*c,t}function aT(t,e,r){var n=e[0],a=e[1],i=e[2],s=e[3];return t[0]=r[0]*n+r[4]*a+r[8]*i+r[12]*s,t[1]=r[1]*n+r[5]*a+r[9]*i+r[13]*s,t[2]=r[2]*n+r[6]*a+r[10]*i+r[14]*s,t[3]=r[3]*n+r[7]*a+r[11]*i+r[15]*s,t}function iT(t,e,r){var n=e[0],a=e[1],i=e[2],s=r[0],o=r[1],c=r[2],f=r[3],u=f*n+o*i-c*a,g=f*a+c*n-s*i,l=f*i+s*a-o*n,h=-s*n-o*a-c*i;return t[0]=u*f+h*-s+g*-c-l*-o,t[1]=g*f+h*-o+l*-s-u*-c,t[2]=l*f+h*-c+u*-o-g*-s,t[3]=e[3],t}function sT(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=0,t}function oT(t){return"vec4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"}function hs(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]}function vs(t,e){var r=t[0],n=t[1],a=t[2],i=t[3],s=e[0],o=e[1],c=e[2],f=e[3];return Math.abs(r-s)<=oe*Math.max(1,Math.abs(r),Math.abs(s))&&Math.abs(n-o)<=oe*Math.max(1,Math.abs(n),Math.abs(o))&&Math.abs(a-c)<=oe*Math.max(1,Math.abs(a),Math.abs(c))&&Math.abs(i-f)<=oe*Math.max(1,Math.abs(i),Math.abs(f))}var cT=rf,fT=nf,uT=af,lT=sf,pT=of,gT=Ra,hT=Ea,vT=(function(){var t=tf();return function(e,r,n,a,i,s){var o,c;for(r||(r=4),n||(n=0),a?c=Math.min(a*r+n,e.length):c=e.length,o=n;o<c;o+=r)t[0]=e[o],t[1]=e[o+1],t[2]=e[o+2],t[3]=e[o+3],i(t,t,s),e[o]=t[0],e[o+1]=t[1],e[o+2]=t[2],e[o+3]=t[3];return e}})();function ds(){var t=new me(4);return me!=Float32Array&&(t[0]=0,t[1]=0,t[2]=0),t[3]=1,t}function dT(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t}function cf(t,e,r){r=r*.5;var n=Math.sin(r);return t[0]=n*e[0],t[1]=n*e[1],t[2]=n*e[2],t[3]=Math.cos(r),t}function TT(t,e){var r=Math.acos(e[3])*2,n=Math.sin(r/2);return n>oe?(t[0]=e[0]/n,t[1]=e[1]/n,t[2]=e[2]/n):(t[0]=1,t[1]=0,t[2]=0),r}function mT(t,e){var r=hf(t,e);return Math.acos(2*r*r-1)}function ff(t,e,r){var n=e[0],a=e[1],i=e[2],s=e[3],o=r[0],c=r[1],f=r[2],u=r[3];return t[0]=n*u+s*o+a*f-i*c,t[1]=a*u+s*c+i*o-n*f,t[2]=i*u+s*f+n*c-a*o,t[3]=s*u-n*o-a*c-i*f,t}function yT(t,e,r){r*=.5;var n=e[0],a=e[1],i=e[2],s=e[3],o=Math.sin(r),c=Math.cos(r);return t[0]=n*c+s*o,t[1]=a*c+i*o,t[2]=i*c-a*o,t[3]=s*c-n*o,t}function ST(t,e,r){r*=.5;var n=e[0],a=e[1],i=e[2],s=e[3],o=Math.sin(r),c=Math.cos(r);return t[0]=n*c-i*o,t[1]=a*c+s*o,t[2]=i*c+n*o,t[3]=s*c-a*o,t}function xT(t,e,r){r*=.5;var n=e[0],a=e[1],i=e[2],s=e[3],o=Math.sin(r),c=Math.cos(r);return t[0]=n*c+a*o,t[1]=a*c-n*o,t[2]=i*c+s*o,t[3]=s*c-i*o,t}function CT(t,e){var r=e[0],n=e[1],a=e[2];return t[0]=r,t[1]=n,t[2]=a,t[3]=Math.sqrt(Math.abs(1-r*r-n*n-a*a)),t}function uf(t,e){var r=e[0],n=e[1],a=e[2],i=e[3],s=Math.sqrt(r*r+n*n+a*a),o=Math.exp(i),c=s>0?o*Math.sin(s)/s:0;return t[0]=r*c,t[1]=n*c,t[2]=a*c,t[3]=o*Math.cos(s),t}function lf(t,e){var r=e[0],n=e[1],a=e[2],i=e[3],s=Math.sqrt(r*r+n*n+a*a),o=s>0?Math.atan2(s,i)/s:0;return t[0]=r*o,t[1]=n*o,t[2]=a*o,t[3]=.5*Math.log(r*r+n*n+a*a+i*i),t}function OT(t,e,r){return lf(t,e),gf(t,t,r),uf(t,t),t}function Ma(t,e,r,n){var a=e[0],i=e[1],s=e[2],o=e[3],c=r[0],f=r[1],u=r[2],g=r[3],l,h,y,p,m;return h=a*c+i*f+s*u+o*g,h<0&&(h=-h,c=-c,f=-f,u=-u,g=-g),1-h>oe?(l=Math.acos(h),y=Math.sin(l),p=Math.sin((1-n)*l)/y,m=Math.sin(n*l)/y):(p=1-n,m=n),t[0]=p*a+m*c,t[1]=p*i+m*f,t[2]=p*s+m*u,t[3]=p*o+m*g,t}function wT(t){var e=ct(),r=ct(),n=ct(),a=Math.sqrt(1-e),i=Math.sqrt(e);return t[0]=a*Math.sin(2*Math.PI*r),t[1]=a*Math.cos(2*Math.PI*r),t[2]=i*Math.sin(2*Math.PI*n),t[3]=i*Math.cos(2*Math.PI*n),t}function RT(t,e){var r=e[0],n=e[1],a=e[2],i=e[3],s=r*r+n*n+a*a+i*i,o=s?1/s:0;return t[0]=-r*o,t[1]=-n*o,t[2]=-a*o,t[3]=i*o,t}function ET(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=e[3],t}function pf(t,e){var r=e[0]+e[4]+e[8],n;if(r>0)n=Math.sqrt(r+1),t[3]=.5*n,n=.5/n,t[0]=(e[5]-e[7])*n,t[1]=(e[6]-e[2])*n,t[2]=(e[1]-e[3])*n;else{var a=0;e[4]>e[0]&&(a=1),e[8]>e[a*3+a]&&(a=2);var i=(a+1)%3,s=(a+2)%3;n=Math.sqrt(e[a*3+a]-e[i*3+i]-e[s*3+s]+1),t[a]=.5*n,n=.5/n,t[3]=(e[i*3+s]-e[s*3+i])*n,t[i]=(e[i*3+a]+e[a*3+i])*n,t[s]=(e[s*3+a]+e[a*3+s])*n}return t}function MT(t,e,r,n){var a=.5*Math.PI/180;e*=a,r*=a,n*=a;var i=Math.sin(e),s=Math.cos(e),o=Math.sin(r),c=Math.cos(r),f=Math.sin(n),u=Math.cos(n);return t[0]=i*c*u-s*o*f,t[1]=s*o*u+i*c*f,t[2]=s*c*f-i*o*u,t[3]=s*c*u+i*o*f,t}function DT(t){return"quat("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"}var VT=is,LT=ss,_T=os,BT=cs,FT=fs,UT=ff,gf=us,hf=ps,NT=gs,vf=Ra,GT=vf,df=Ea,kT=df,Ts=ls,bT=hs,zT=vs,WT=(function(){var t=Ca(),e=Oa(1,0,0),r=Oa(0,1,0);return function(n,a,i){var s=wa(a,i);return s<-.999999?(Rn(t,e,a),as(t)<1e-6&&Rn(t,r,a),ns(t,t),cf(n,t,Math.PI),n):s>.999999?(n[0]=0,n[1]=0,n[2]=0,n[3]=1,n):(Rn(t,a,i),n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=1+s,Ts(n,n))}})(),IT=(function(){var t=ds(),e=ds();return function(r,n,a,i,s,o){return Ma(t,n,s,o),Ma(e,a,i,o),Ma(r,t,e,2*o*(1-o)),r}})(),HT=(function(){var t=rs();return function(e,r,n,a){return t[0]=n[0],t[3]=n[1],t[6]=n[2],t[1]=a[0],t[4]=a[1],t[7]=a[2],t[2]=-r[0],t[5]=-r[1],t[8]=-r[2],Ts(e,pf(e,t))}})();function jT(t,e){e.classHierarchy.push("vtkOpenGLCamera"),t.buildPass=r=>{r&&(e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer"),e._openGLRenderWindow=e._openGLRenderer.getParent(),e.context=e._openGLRenderWindow.getContext())},t.opaquePass=r=>{if(r){let n=e._openGLRenderer.getTiledSizeAndOrigin();e.context.viewport(n.lowerLeftU,n.lowerLeftV,n.usize,n.vsize),e.context.scissor(n.lowerLeftU,n.lowerLeftV,n.usize,n.vsize)}},t.translucentPass=t.opaquePass,t.zBufferPass=t.opaquePass,t.opaqueZBufferPass=t.opaquePass,t.volumePass=t.opaquePass,t.getKeyMatrices=r=>{if(r!==e.lastRenderer||e._openGLRenderWindow.getMTime()>e.keyMatrixTime.getMTime()||t.getMTime()>e.keyMatrixTime.getMTime()||r.getMTime()>e.keyMatrixTime.getMTime()||e.renderable.getMTime()>e.keyMatrixTime.getMTime()){e.renderable.getViewMatrix(e.keyMatrices.wcvc),ne.fromMat4(e.keyMatrices.normalMatrix,e.keyMatrices.wcvc),ne.invert(e.keyMatrices.normalMatrix,e.keyMatrices.normalMatrix),L.transpose(e.keyMatrices.wcvc,e.keyMatrices.wcvc);let n=e._openGLRenderer.getAspectRatio();L.copy(e.keyMatrices.vcpc,e.renderable.getProjectionMatrix(n,-1,1)),L.transpose(e.keyMatrices.vcpc,e.keyMatrices.vcpc),L.multiply(e.keyMatrices.wcpc,e.keyMatrices.vcpc,e.keyMatrices.wcvc),e.keyMatrixTime.modified(),e.lastRenderer=r}return e.keyMatrices}}var PT={context:null,lastRenderer:null,keyMatrixTime:null,keyMatrices:null};function $T(t,e,r={}){Object.assign(e,PT,r),ve.extend(t,e,r),e.keyMatrixTime={},pe(e.keyMatrixTime),e.keyMatrices={normalMatrix:new Float64Array(9),vcpc:new Float64Array(16),wcvc:new Float64Array(16),wcpc:new Float64Array(16)},de(t,e,["context","keyMatrixTime"]),jT(t,e)}var AT=ue($T);_e("vtkCamera",AT);var KT={Int8Array:1,Uint8Array:1,Uint8ClampedArray:1,Int16Array:2,Uint16Array:2,Int32Array:4,Uint32Array:4,Float32Array:4,Float64Array:8},re={VOID:"",CHAR:"Int8Array",SIGNED_CHAR:"Int8Array",UNSIGNED_CHAR:"Uint8Array",UNSIGNED_CHAR_CLAMPED:"Uint8ClampedArray",SHORT:"Int16Array",UNSIGNED_SHORT:"Uint16Array",INT:"Int32Array",UNSIGNED_INT:"Uint32Array",FLOAT:"Float32Array",DOUBLE:"Float64Array"},XT=re.FLOAT,ms={DefaultDataType:XT,DataTypeByteSize:KT,VtkDataTypes:re};var Yr=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],Tf=[1,0,0,0,1,0,0,0,1],qr=1e-6;var Gf=On(Uf(),1);var{vtkErrorMacro:kf,vtkWarningMacro:Vr}=w,bf=0,Nf=20;function Dn(t){return()=>kf(`vtkMath::${t} - NOT IMPLEMENTED`)}function Mn(t,e,r,n){let a;for(let i=0;i<e;i++)a=t[r*e+i],t[r*e+i]=t[n*e+i],t[n*e+i]=a}function En(t,e,r,n){let a;for(let i=0;i<e;i++)a=t[i*e+r],t[i*e+r]=t[i*e+n],t[i*e+n]=a}function Ce(t=3){let e=Array(t);for(let r=0;r<t;++r)e[r]=0;return e}var tm=()=>Math.PI;function rm(t,e){return e>1023?t*2**1023*2**(e-1023):e<-1074?t*2**-1074*2**(e+1074):t*2**e}function ye(t){return t/180*Math.PI}function qt(t){return t*180/Math.PI}var{round:nm,floor:Vn,ceil:am,min:im,max:sm}=Math;function om(t,e=0,r=1){let n=1/0;for(let a=e,i=t.length;a<i;a+=r)t[a]<n&&(n=t[a]);return n}function cm(t,e=0,r=1){let n=-1/0;for(let a=e,i=t.length;a<i;a+=r)n<t[a]&&(n=t[a]);return n}function fm(t,e=0,r=1){let n=1/0,a=-1/0;for(let i=e,s=t.length;i<s;i+=r)t[i]<n&&(n=t[i]),a<t[i]&&(a=t[i]);return[n,a]}var um=Dn("ceilLog2"),lm=Dn("factorial");function Ln(t){let e=1;for(;e<t;)e*=2;return e}function pm(t){return t===Ln(t)}function gm(t,e){let r=1;for(let n=1;n<=e;++n)r*=(t-n+1)/n;return Math.floor(r)}function hm(t,e){if(t<e)return 0;let r=Ce(e);for(let n=0;n<e;++n)r[n]=n;return r}function vm(t,e,r){let n=0;for(let a=e-1;a>=0;--a)if(r[a]<t-e+a){let i=r[a]+1;for(;a<e;)r[a++]=i++;n=1;break}return n}function dm(t){(0,Gf.default)(`${t}`,{global:!0}),bf=t}function Tm(){return bf}function mm(t=0,e=1){return t+(e-t)*Math.random()}var ym=Dn("gaussian");function Zt(t,e,r){return r[0]=t[0]+e[0],r[1]=t[1]+e[1],r[2]=t[2]+e[2],r}function De(t,e,r){return r[0]=t[0]-e[0],r[1]=t[1]-e[1],r[2]=t[2]-e[2],r}function zf(t,e){return t[0]*=e,t[1]*=e,t[2]*=e,t}function Wf(t,e){return t[0]*=e,t[1]*=e,t}function _a(t,e,r,n){return n[0]=t[0]+e[0]*r,n[1]=t[1]+e[1]*r,n[2]=t[2]+e[2]*r,n}function Sm(t,e,r,n){return n[0]=t[0]+e[0]*r,n[1]=t[1]+e[1]*r,n}function ee(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]}function xm(t,e,r){r[0]=t[0]*e[0],r[1]=t[0]*e[1],r[2]=t[0]*e[2],r[3]=t[1]*e[0],r[4]=t[1]*e[1],r[5]=t[1]*e[2],r[6]=t[2]*e[0],r[7]=t[2]*e[1],r[8]=t[2]*e[2]}function Ge(t,e,r){let n=t[1]*e[2]-t[2]*e[1],a=t[2]*e[0]-t[0]*e[2],i=t[0]*e[1]-t[1]*e[0];return r[0]=n,r[1]=a,r[2]=i,r}function ft(t,e=3){switch(e){case 1:return Math.abs(t);case 2:return Math.sqrt(t[0]*t[0]+t[1]*t[1]);case 3:return Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]);default:{let r=0;for(let n=0;n<e;n++)r+=t[n]*t[n];return Math.sqrt(r)}}}function et(t){let e=ft(t);return e!==0&&(t[0]/=e,t[1]/=e,t[2]/=e),e}function If(t){let e=ft(t,3);return e!==0&&(t[0]/=e,t[1]/=e,t[2]/=e,t[3]/=e),e}function Cm(t,e,r,n){let a=t[0]*t[0],i=t[1]*t[1],s=t[2]*t[2],o=Math.sqrt(a+i+s),c,f,u;a>i&&a>s?(c=0,f=1,u=2):i>s?(c=1,f=2,u=0):(c=2,f=0,u=1);let g=t[c]/o,l=t[f]/o,h=t[u]/o,y=Math.sqrt(g*g+h*h);if(n!==0){let p=Math.sin(n),m=Math.cos(n);e&&(e[c]=(h*m-g*l*p)/y,e[f]=p*y,e[u]=(-(g*m)-l*h*p)/y),r&&(r[c]=(-(h*p)-g*l*m)/y,r[f]=m*y,r[u]=(g*p-l*h*m)/y)}else e&&(e[c]=h/y,e[f]=0,e[u]=-g/y),r&&(r[c]=-g*l/y,r[f]=y,r[u]=-l*h/y)}function Om(t,e,r){let n=ee(e,e);if(n===0)return r[0]=0,r[1]=0,r[2]=0,!1;let a=ee(t,e)/n;for(let i=0;i<3;i++)r[i]=e[i];return zf(r,a),!0}function Rs(t,e){return t[0]*e[0]+t[1]*e[1]}function wm(t,e,r){let n=Rs(e,e);if(n===0)return r[0]=0,r[1]=0,!1;let a=Rs(t,e)/n;for(let i=0;i<2;i++)r[i]=e[i];return Wf(r,a),!0}function ze(t,e){return(t[0]-e[0])*(t[0]-e[0])+(t[1]-e[1])*(t[1]-e[1])+(t[2]-e[2])*(t[2]-e[2])}function Rm(t,e){let r=[0,0,0];return Ge(t,e,r),Math.atan2(ft(r),ee(t,e))}function Em(t,e,r){let n=Math.abs(t-r);return 1/Math.sqrt(2*Math.PI*e)*Math.exp(-(n**2)/(2*e))}function Mm(t,e,r){let n=Math.abs(t-r);return Math.exp(-(n**2)/(2*e))}function Dm(t,e,r){r[0]=t[0]*e[0],r[1]=t[0]*e[1],r[2]=t[1]*e[0],r[3]=t[1]*e[1]}function Hf(t){return Math.sqrt(t[0]*t[0]+t[1]*t[1])}function Vm(t){let e=Hf(t);return e!==0&&(t[0]/=e,t[1]/=e),e}function Re(...t){return t.length===2?t[0][0]*t[1][1]-t[1][0]*t[0][1]:t.length===4?t[0]*t[3]-t[1]*t[2]:NaN}function Lm(t,e){let r,n,a,i=[0,0,0];for(let s=0;s<3;s++)a=Math.abs(t[s*3]),(n=Math.abs(t[s*3+1]))>a&&(a=n),(n=Math.abs(t[s*3+2]))>a&&(a=n),i[s]=1/a;a=i[0]*Math.abs(t[0]),r=0,(n=i[1]*Math.abs(t[3]))>=a&&(a=n,r=1),(n=i[2]*Math.abs(t[6]))>=a&&(r=2),r!==0&&(Mn(t,3,r,0),i[r]=i[0]),e[0]=r,t[3]/=t[0],t[6]/=t[0],t[4]-=t[3]*t[1],t[7]-=t[6]*t[1],a=i[1]*Math.abs(t[4]),r=1,(n=i[2]*Math.abs(t[7]))>=a&&(r=2,Mn(t,3,1,2),i[2]=i[1]),e[1]=r,t[7]/=t[4],t[5]-=t[3]*t[2],t[8]-=t[6]*t[2]+t[7]*t[5],e[2]=2}function _m(t,e,r){let n=r[e[0]];r[e[0]]=r[0],r[0]=n,n=r[e[1]],r[e[1]]=r[1],r[1]=n-t[3]*r[0],n=r[e[2]],r[e[2]]=r[2],r[2]=n-t[6]*r[0]-t[7]*r[1],r[2]/=t[8],r[1]=(r[1]-t[5]*r[2])/t[4],r[0]=(r[0]-t[1]*r[1]-t[2]*r[2])/t[0]}function Bm(t,e,r){let n=t[0],a=t[1],i=t[2],s=t[3],o=t[4],c=t[5],f=t[6],u=t[7],g=t[8],l=+Re(o,u,c,g),h=-Re(s,f,c,g),y=+Re(s,f,o,u),p=-Re(a,u,i,g),m=+Re(n,f,i,g),d=-Re(n,f,a,u),x=+Re(a,o,i,c),T=-Re(n,s,i,c),v=+Re(n,s,a,o),C=n*l+a*h+i*y,O=l*e[0]+p*e[1]+x*e[2],M=h*e[0]+m*e[1]+T*e[2],S=y*e[0]+d*e[1]+v*e[2];r[0]=O/C,r[1]=M/C,r[2]=S/C}function Fm(t,e,r){let n=t[0]*e[0]+t[1]*e[1]+t[2]*e[2],a=t[3]*e[0]+t[4]*e[1]+t[5]*e[2],i=t[6]*e[0]+t[7]*e[1]+t[8]*e[2];r[0]=n,r[1]=a,r[2]=i}function Es(t,e,r){let n=[...t],a=[...e];for(let i=0;i<3;i++)r[i]=n[0]*a[i]+n[1]*a[i+3]+n[2]*a[i+6],r[i+3]=n[3]*a[i]+n[4]*a[i+3]+n[5]*a[i+6],r[i+6]=n[6]*a[i]+n[7]*a[i+3]+n[8]*a[i+6]}function Um(t,e,r,n,a,i,s){n!==a&&kf("Number of columns of A must match number of rows of B.");let o=[...t],c=[...e];for(let f=0;f<r;f++)for(let u=0;u<i;u++){s[f*i+u]=0;for(let g=0;g<n;g++)s[f*i+u]+=o[f*n+g]*c[u+i*g]}}function Zr(t,e){let r;r=t[3],e[3]=t[1],e[1]=r,r=t[6],e[6]=t[2],e[2]=r,r=t[7],e[7]=t[5],e[5]=r,e[0]=t[0],e[4]=t[4],e[8]=t[8]}function Nm(t,e){let r=t[0],n=t[1],a=t[2],i=t[3],s=t[4],o=t[5],c=t[6],f=t[7],u=t[8],g=+Re(s,f,o,u),l=-Re(i,c,o,u),h=+Re(i,c,s,f),y=-Re(n,f,a,u),p=+Re(r,c,a,u),m=-Re(r,c,n,f),d=+Re(n,s,a,o),x=-Re(r,i,a,o),T=+Re(r,i,n,s),v=r*g+n*l+a*h;v===0&&Vr("Matrix has 0 determinant"),e[0]=g/v,e[3]=l/v,e[6]=h/v,e[1]=y/v,e[4]=p/v,e[7]=m/v,e[2]=d/v,e[5]=x/v,e[8]=T/v}function Ba(t){return t[0]*t[4]*t[8]+t[3]*t[7]*t[2]+t[6]*t[1]*t[5]-t[0]*t[7]*t[5]-t[3]*t[1]*t[8]-t[6]*t[4]*t[2]}function Fa(t,e,r=qr){if(t.length!==e.length)return!1;function n(a,i){return Math.abs(a-e[i])<=r}return t.every(n)}var cr=Fa;function jf(t){for(let e=0;e<3;e++)t[e*3]=t[e*3+1]=t[e*3+2]=0,t[e*3+e]=1}function Pf(t,e){for(let r=0;r<t;r++){for(let n=0;n<t;n++)e[r*t+n]=0;e[r*t+r]=1}return e}function Gm(t,e=qr){return cr(t,Yr,e)}function km(t,e=qr){return cr(t,Tf,e)}function $f(t,e){let r=t[0]*t[0],n=t[0]*t[1],a=t[0]*t[2],i=t[0]*t[3],s=t[1]*t[1],o=t[2]*t[2],c=t[3]*t[3],f=t[1]*t[2],u=t[1]*t[3],g=t[2]*t[3],l=s+o+c,h=1/(r+l),y=(r-l)*h;h*=2,e[0]=s*h+y,e[3]=(f+i)*h,e[6]=(u-a)*h,e[1]=(f-i)*h,e[4]=o*h+y,e[7]=(g+n)*h,e[2]=(u+a)*h,e[5]=(g-n)*h,e[8]=c*h+y}function La(t,e=0){if(!`${t}`.includes("e"))return+`${Math.round(`${t}e+${e}`)}e-${e}`;let r=`${t}`.split("e"),n="";return+r[1]+e>0&&(n="+"),+`${Math.round(`${+r[0]}e${n}${+r[1]+e}`)}e-${e}`}function Ua(t,e=[0,0,0],r=0){return e[0]=La(t[0],r),e[1]=La(t[1],r),e[2]=La(t[2],r),e}function _n(t,e,r,n){let a,i,s,o,c,f,u,g,l,h,y,p,m,d,x,T,v=Ce(e),C=Ce(e),O=(S,E,R)=>{d=S[E],m=S[R],S[E]=d-p*(m+d*h),S[R]=m+p*(d-m*h)};for(Pf(e,n),c=0;c<e;c++)v[c]=r[c]=t[c+c*e],C[c]=0;for(a=0;a<Nf;a++){for(y=0,c=0;c<e-1;c++)for(o=c+1;o<e;o++)y+=Math.abs(t[c*e+o]);if(y===0)break;for(a<3?u=.2*y/(e*e):u=0,c=0;c<e-1;c++)for(o=c+1;o<e;o++)if(d=100*Math.abs(t[c*e+o]),a>3&&Math.abs(r[c])+d===Math.abs(r[c])&&Math.abs(r[o])+d===Math.abs(r[o]))t[c*e+o]=0;else if(Math.abs(t[c*e+o])>u){for(m=r[o]-r[c],Math.abs(m)+d===Math.abs(m)?l=t[c*e+o]/m:(g=.5*m/t[c*e+o],l=1/(Math.abs(g)+Math.sqrt(1+g*g)),g<0&&(l=-l)),x=1/Math.sqrt(1+l*l),p=l*x,h=p/(1+x),m=l*t[c*e+o],C[c]-=m,C[o]+=m,r[c]-=m,r[o]+=m,t[c*e+o]=0,i=0;i<=c-1;i++)O(t,i*e+c,i*e+o);for(i=c+1;i<=o-1;i++)O(t,c*e+i,i*e+o);for(i=o+1;i<e;i++)O(t,c*e+i,o*e+i);for(i=0;i<e;i++)O(n,i*e+c,i*e+o)}for(c=0;c<e;c++)v[c]+=C[c],r[c]=v[c],C[c]=0}if(a>=Nf)return Vr("vtkMath::Jacobi: Error extracting eigenfunctions"),0;for(i=0;i<e-1;i++){for(s=i,T=r[s],a=i+1;a<e;a++)(r[a]>=T||Math.abs(r[a]-T)<1e-12)&&(s=a,T=r[s]);s!==i&&(r[s]=r[i],r[i]=T,En(n,e,i,s))}let M=(e>>1)+(e&1);for(f=0,a=0;a<e*e;a++)n[a]>=0&&f++;if(f<M)for(a=0;a<e;a++)n[a*e+i]*=-1;return 1}function Af(t,e){let r=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];r[0]=t[0]+t[4]+t[8],r[5]=t[0]-t[4]-t[8],r[10]=-t[0]+t[4]-t[8],r[15]=-t[0]-t[4]+t[8],r[1]=r[4]=t[7]-t[5],r[2]=r[8]=t[2]-t[6],r[3]=r[12]=t[3]-t[1],r[6]=r[9]=t[3]+t[1],r[7]=r[13]=t[2]+t[6],r[11]=r[14]=t[7]+t[5];let n=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],a=[0,0,0,0];_n([...r],4,a,n),e[0]=n[0],e[1]=n[4],e[2]=n[8],e[3]=n[12]}function bm(t,e,r){let n=t[0]*e[0],a=t[0]*e[1],i=t[0]*e[2],s=t[0]*e[3],o=t[1]*e[0],c=t[1]*e[1],f=t[1]*e[2],u=t[1]*e[3],g=t[2]*e[0],l=t[2]*e[1],h=t[2]*e[2],y=t[2]*e[3],p=t[3]*e[0],m=t[3]*e[1],d=t[3]*e[2],x=t[3]*e[3];r[0]=n-c-h-x,r[1]=a+o+y-d,r[2]=i-u+g+m,r[3]=s+f-l+p}function Kf(t,e){for(let l=0;l<9;l++)e[l]=t[l];let r=Ce(3),n=Ce(3),a;for(let l=0;l<3;l++){let h=Math.abs(e[l*3]),y=Math.abs(e[l*3+1]),p=Math.abs(e[l*3+2]);a=y>h?y:h,a=p>a?p:a,r[l]=1,a!==0&&(r[l]/=a)}let i=Math.abs(e[0])*r[0],s=Math.abs(e[3])*r[1],o=Math.abs(e[6])*r[2];n[0]=0,a=i,s>=a&&(a=s,n[0]=1),o>=a&&(n[0]=2),n[0]!==0&&(En(e,3,n[0],0),r[n[0]]=r[0]);let c=Math.abs(e[4])*r[1],f=Math.abs(e[7])*r[2];n[1]=1,a=c,f>=a&&(n[1]=2,En(e,3,1,2)),n[2]=2;let u=0;if(Ba(e)<0){u=1;for(let l=0;l<9;l++)e[l]=-e[l]}let g=Ce(4);if(Af(e,g),$f(g,e),u)for(let l=0;l<9;l++)e[l]=-e[l];n[1]!==1&&En(e,3,n[1],1),n[0]!==0&&En(e,3,n[0],0)}function Xf(t,e,r){let n,a,i,s,o,c;if(_n([...t],3,e,r),e[0]===e[1]&&e[0]===e[2]){jf(r);return}for(Zr(r,r),n=0;n<3;n++)if(e[(n+1)%3]===e[(n+2)%3]){for(c=Math.abs(r[n*3]),s=0,a=1;a<3;a++)c<(o=Math.abs(r[n*3+a]))&&(c=o,s=a);s!==n&&(o=e[s],e[s]=e[n],e[n]=o,Mn(r,3,n,s)),r[s*3+s]<0&&(r[s*3]=-r[s*3],r[s*3+1]=-r[s*3+1],r[s*3+2]=-r[s*3+2]),a=(s+1)%3,i=(s+2)%3,r[a*3]=0,r[a*3+1]=0,r[a*3+2]=0,r[a*3+a]=1;let f=Ge([r[s*3],r[s*3+1],r[s*3+2]],[r[a*3],r[a*3+1],r[a*3+2]],[]);et(f);let u=Ge(f,[r[s*3],r[s*3+1],r[s*3+2]],[]);for(let g=0;g<3;g++)r[i*3+g]=f[g],r[a*3+g]=u[g];Zr(r,r);return}for(c=Math.abs(r[0]),s=0,n=1;n<3;n++)c<(o=Math.abs(r[n*3]))&&(c=o,s=n);if(s!==0){let f=e[s];e[s]=e[0],e[0]=f,Mn(r,3,s,0)}if(Math.abs(r[4])<Math.abs(r[7])){let f=e[2];e[2]=e[1],e[1]=f,Mn(r,3,1,2)}for(n=0;n<2;n++)r[n*3+n]<0&&(r[n*3]=-r[n*3],r[n*3+1]=-r[n*3+1],r[n*3+2]=-r[n*3+2]);Ba(r)<0&&(r[6]=-r[6],r[7]=-r[7],r[8]=-r[8]),Zr(r,r)}function zm(t,e,r,n){let a,i=[...t],s=Ba(i);if(s<0)for(a=0;a<9;a++)i[a]=-i[a];Kf(i,e),Zr(i,i),Es(i,e,n),Xf(n,r,n),Es(e,n,e),Zr(n,n),s<0&&(r[0]=-r[0],r[1]=-r[1],r[2]=-r[2])}function Vs(t,e,r){let n,a,i,s,o=0,c,f,u,g=Ce(r);for(n=0;n<r;n++){for(s=0,a=0;a<r;a++)(u=Math.abs(t[n*r+a]))>s&&(s=u);if(s===0)return Vr("Unable to factor linear system"),0;g[n]=1/s}for(a=0;a<r;a++){for(n=0;n<a;n++){for(c=t[n*r+a],i=0;i<n;i++)c-=t[n*r+i]*t[i*r+a];t[n*r+a]=c}for(s=0,n=a;n<r;n++){for(c=t[n*r+a],i=0;i<a;i++)c-=t[n*r+i]*t[i*r+a];t[n*r+a]=c,(f=g[n]*Math.abs(c))>=s&&(s=f,o=n)}if(a!==o){for(i=0;i<r;i++)f=t[o*r+i],t[o*r+i]=t[a*r+i],t[a*r+i]=f;g[o]=g[a]}if(e[a]=o,Math.abs(t[a*r+a])<=1e-12)return Vr("Unable to factor linear system"),0;if(a!==r-1)for(f=1/t[a*r+a],n=a+1;n<r;n++)t[n*r+a]*=f}return 1}function Ls(t,e,r,n){let a,i,s,o,c;for(s=-1,a=0;a<n;a++){if(o=e[a],c=r[o],r[o]=r[a],s>=0)for(i=s;i<=a-1;i++)c-=t[a*n+i]*r[i];else c!==0&&(s=a);r[a]=c}for(a=n-1;a>=0;a--){for(c=r[a],i=a+1;i<n;i++)c-=t[a*n+i]*r[i];r[a]=c/t[a*n+a]}}function _s(t,e,r){if(r===2){let a=Ce(2),i=Re(t[0],t[1],t[2],t[3]);return i===0?0:(a[0]=(t[3]*e[0]-t[1]*e[1])/i,a[1]=(-(t[2]*e[0])+t[0]*e[1])/i,e[0]=a[0],e[1]=a[1],1)}if(r===1)return t[0]===0?0:(e[0]/=t[0],1);let n=Ce(r);return Vs(t,n,r)===0?0:(Ls(t,n,e,r),1)}function Na(t,e,r,n=null,a=null){let i=n||Ce(r),s=a||Ce(r);if(Vs(t,i,r,s)===0)return null;for(let o=0;o<r;o++){for(let c=0;c<r;c++)s[c]=0;s[o]=1,Ls(t,i,s,r);for(let c=0;c<r;c++)e[c*r+o]=s[c]}return e}function Wm(t,e){let r=+Number.MAX_VALUE,n=-Number.MAX_VALUE;for(let a=0;a<e;a++)for(let i=a;i<e;i++)Math.abs(t[a*e+i])>n&&(n=Math.abs(t[a*e+i]));for(let a=0;a<e;a++)Math.abs(t[a*e+a])<r&&(r=Math.abs(t[a*e+a]));return r===0?Number.MAX_VALUE:n/r}function Im(t,e,r){return _n(t,3,e,r)}function Ms(t,e,r,n){if(t<r)return Vr("Insufficient number of samples. Underdetermined."),0;let a,i,s,o=Ce(r*r),c=Ce(r),f=Ce(r*r);for(s=0;s<t;s++)for(a=0;a<r;a++)for(i=a;i<r;i++)o[a*r+i]+=e[s*r+a]*e[s*r+i];for(a=0;a<r;a++)for(i=0;i<a;i++)o[a*r+i]=o[i*r+a];for(_n(o,r,c,f),a=0;a<r;a++)n[a]=f[a*r+r-1];return 1}function Hm(t,e,r,n,a,i,s=!0){if(t<r||t<a)return Vr("Insufficient number of samples. Underdetermined."),0;let o=Ce(a),c=1,f,u=0,g,l,h,y=0;if(s){for(l=0;l<a;l++)o[l]=1;for(g=0;g<t;g++)for(l=0;l<a;l++)Math.abs(n[g*a+l])>1e-12&&(c=0,o[l]=0);if(c&&a===1)return Vr("Detected homogeneous system (Y=0), calling SolveHomogeneousLeastSquares()"),Ms(t,e,r,i);if(c)y=1;else for(l=0;l<a;l++)o[l]&&(y=1)}y&&(f=Ce(r),u=Ms(t,e,r,f));let p=Ce(r*r),m=Ce(r*r),d=Ce(r*a);for(h=0;h<t;h++)for(g=0;g<r;g++){for(l=g;l<r;l++)p[g*r+l]+=e[h*r+g]*e[h*r+l];for(l=0;l<a;l++)d[g*a+l]+=e[h*r+g]*n[h*a+l]}for(g=0;g<r;g++)for(l=0;l<g;l++)p[g*r+l]=p[l*r+g];let x=Na(p,m,r);if(x)for(g=0;g<r;g++)for(l=0;l<a;l++)for(i[g*a+l]=0,h=0;h<r;h++)i[g*a+l]+=m[g*r+h]*d[h*a+l];if(y){for(l=0;l<a;l++)if(o[l])for(g=0;g<r;g++)i[g*a+l]=f[g*a]}return y?u&&x:x}function jm(t,e=[0,.5,1]){switch(t.length){case 3:return e[0]=parseInt(t[0],16)*17/255,e[1]=parseInt(t[1],16)*17/255,e[2]=parseInt(t[2],16)*17/255,e;case 4:return e[0]=parseInt(t[1],16)*17/255,e[1]=parseInt(t[2],16)*17/255,e[2]=parseInt(t[3],16)*17/255,e;case 6:return e[0]=parseInt(t.substr(0,2),16)/255,e[1]=parseInt(t.substr(2,2),16)/255,e[2]=parseInt(t.substr(4,2),16)/255,e;case 7:return e[0]=parseInt(t.substr(1,2),16)/255,e[1]=parseInt(t.substr(3,2),16)/255,e[2]=parseInt(t.substr(5,2),16)/255,e;case 9:return e[0]=parseInt(t.substr(1,2),16)/255,e[1]=parseInt(t.substr(3,2),16)/255,e[2]=parseInt(t.substr(5,2),16)/255,e[3]=parseInt(t.substr(7,2),16)/255,e;default:return e}}function Qr(t,e){let r,n,[a,i,s]=t,o=1/3,c=1/6,f=2/3,u=a,g=a;i>u?u=i:i<g&&(g=i),s>u?u=s:s<g&&(g=s);let l=u;l>0?n=(u-g)/u:n=0,n>0?(a===u?r=c*(i-s)/(u-g):i===u?r=o+c*(s-a)/(u-g):r=f+c*(a-i)/(u-g),r<0&&(r+=1)):r=0,e[0]=r,e[1]=n,e[2]=l}function Qt(t,e){let[r,n,a]=t,i=1/3,s=1/6,o=2/3,c=5/6,f,u,g;r>s&&r<=i?(u=1,f=(i-r)/s,g=0):r>i&&r<=.5?(u=1,g=(r-i)/s,f=0):r>.5&&r<=o?(g=1,u=(o-r)/s,f=0):r>o&&r<=c?(g=1,f=(r-o)/s,u=0):r>c&&r<=1?(f=1,g=(1-r)/s,u=0):(f=1,u=r/s,g=0),f=n*f+(1-n),u=n*u+(1-n),g=n*g+(1-n),f*=a,u*=a,g*=a,e[0]=f,e[1]=u,e[2]=g}function Yf(t,e){let[r,n,a]=t,i=(r+16)/116,s=n/500+i,o=i-a/200;i**3>.008856?i**=3:i=(i-16/116)/7.787,s**3>.008856?s**=3:s=(s-16/116)/7.787,o**3>.008856?o**=3:o=(o-16/116)/7.787;let c=.9505,f=1,u=1.089;e[0]=c*s,e[1]=f*i,e[2]=u*o}function qf(t,e){let[r,n,a]=t,i=.9505,s=1,o=1.089,c=r/i,f=n/s,u=a/o;c>.008856?c**=1/3:c=7.787*c+16/116,f>.008856?f**=1/3:f=7.787*f+16/116,u>.008856?u**=1/3:u=7.787*u+16/116,e[0]=116*f-16,e[1]=500*(c-f),e[2]=200*(f-u)}function Zf(t,e){let[r,n,a]=t,i=r*3.2406+n*-1.5372+a*-.4986,s=r*-.9689+n*1.8758+a*.0415,o=r*.0557+n*-.204+a*1.057;i>.0031308?i=1.055*i**(1/2.4)-.055:i*=12.92,s>.0031308?s=1.055*s**(1/2.4)-.055:s*=12.92,o>.0031308?o=1.055*o**(1/2.4)-.055:o*=12.92;let c=i;c<s&&(c=s),c<o&&(c=o),c>1&&(i/=c,s/=c,o/=c),i<0&&(i=0),s<0&&(s=0),o<0&&(o=0),e[0]=i,e[1]=s,e[2]=o}function Qf(t,e){let[r,n,a]=t;r>.04045?r=((r+.055)/1.055)**2.4:r/=12.92,n>.04045?n=((n+.055)/1.055)**2.4:n/=12.92,a>.04045?a=((a+.055)/1.055)**2.4:a/=12.92,e[0]=r*.4124+n*.3576+a*.1805,e[1]=r*.2126+n*.7152+a*.0722,e[2]=r*.0193+n*.1192+a*.9505}function fr(t,e){let r=[0,0,0];Qf(t,r),qf(r,e)}function Bn(t,e){let r=[0,0,0];Yf(t,r),Zf(r,e)}function Fn(t){return t[0]=1,t[1]=-1,t[2]=1,t[3]=-1,t[4]=1,t[5]=-1,t}function Un(t){return!(t[1]-t[0]<0)}function Pm(t,e,r){return r[0]=Math.min(t[0],e[0]),r[1]=Math.max(t[0],e[0]),r[2]=Math.min(t[1],e[1]),r[3]=Math.max(t[1],e[1]),r[4]=Math.min(t[2],e[2]),r[5]=Math.max(t[2],e[2]),r}function Yt(t,e,r){return t<e?e:t>r?r:t}function Ga(t,e,r,n=[0,0,0]){return n[0]=Yt(t[0],e[0],r[0]),n[1]=Yt(t[1],e[1],r[1]),n[2]=Yt(t[2],e[2],r[2]),n}function $m(t,e){let r=0;return e[0]!==e[1]&&(t<e[0]?r=e[0]:t>e[1]?r=e[1]:r=t,r=(r-e[0])/(e[1]-e[0])),r}var Am=Dn("GetScalarTypeFittingRange"),Km=Dn("GetAdjustedScalarRange");function Xm(t,e){if(!t||!e)return 0;for(let r=0;r<6;r+=2)if(t[r]<e[r]||t[r]>e[r+1]||t[r+1]<e[r]||t[r+1]>e[r+1])return 0;return 1}function Ym(t,e,r){if(!t||!e)return 0;for(let n=0;n<6;n+=2)if(t[n]+r[n/2]<e[n]||t[n]-r[n/2]>e[n+1]||t[n+1]+r[n/2]<e[n]||t[n+1]-r[n/2]>e[n+1])return 0;return 1}function qm(t,e,r){if(!t||!e||!r)return 0;for(let n=0;n<3;n++)if(t[n]+r[n]<e[2*n]||t[n]-r[n]>e[2*n+1])return 0;return 1}function Zm(t,e,r,n){let a=Ce(3),i=Ce(3),s=Ce(3),o=Ce(3),c=Ce(3),f=Ce(3);for(let v=0;v<3;++v)a[v]=t[v]-e[v],i[v]=e[v]-r[v],s[v]=r[v]-t[v],o[v]=-a[v],c[v]=-i[v],f[v]=-s[v];let u=ft(o),g=ft(c),l=ft(s),h=Ce(3);Ge(a,i,h);let y=ft(h),p=u*g*l/(2*y),m=2*y*y,d=g*g*ee(a,f)/m,x=l*l*ee(o,i)/m,T=u*u*ee(s,c)/m;for(let v=0;v<3;++v)n[v]=d*t[v]+x*e[v]+T*r[v];return p}var Qm=1/0,Jm=-1/0,Bs=t=>!Number.isFinite(t),{isFinite:ey,isNaN:Ds}=Number,Lr=Ds;function Fs(){return[].concat([Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_VALUE,-Number.MAX_VALUE])}function ty(t){let e=-1,r=-1;for(let n=0;n<t.length;n++){let a=Math.abs(t[n]);a>e&&(r=n,e=a)}return r}function ry(t){let e=1/0,r=-1;for(let n=0;n<t.length;n++){let a=Math.abs(t[n]);a<e&&(r=n,e=a)}return r}function ny(t,e=3){let r=new Array(e),n=new Array(e);for(let i=0;i<e;++i)r[i]=i,n[i]=i;for(let i=e-1;i>0;i--){let s=-1/0,o=0,c=0;for(let f=0;f<=i;++f){let u=r[f];for(let g=0;g<=i;++g){let l=n[g],h=Math.abs(t[u+e*l]);h>s&&(s=h,o=f,c=g)}}[r[i],r[o]]=[r[o],r[i]],[n[i],n[c]]=[n[c],n[i]]}let a=new Array(e*e).fill(0);for(let i=0;i<e;++i){let s=r[i]+e*n[i];a[s]=t[s]<0?-1:1}return a}function Jf(t){let e=Math.floor(t*255);return e>15?e.toString(16):`0${e.toString(16)}`}function ay(t,e="#"){return`${e}${t.map(Jf).join("")}`}function Va(t){return Math.round(t*255)}function iy(t){return t.length===3?`rgb(${t.map(Va).join(", ")})`:`rgba(${Va(t[0]||0)}, ${Va(t[1]||0)}, ${Va(t[2]||0)}, ${t[3]||0})`}var Oe={Pi:tm,ldexp:rm,radiansFromDegrees:ye,degreesFromRadians:qt,round:nm,floor:Vn,ceil:am,ceilLog2:um,min:im,max:sm,arrayMin:om,arrayMax:cm,arrayRange:fm,isPowerOfTwo:pm,nearestPowerOfTwo:Ln,factorial:lm,binomial:gm,beginCombination:hm,nextCombination:vm,randomSeed:dm,getSeed:Tm,random:mm,gaussian:ym,add:Zt,subtract:De,multiplyScalar:zf,multiplyScalar2D:Wf,multiplyAccumulate:_a,multiplyAccumulate2D:Sm,dot:ee,outer:xm,cross:Ge,norm:ft,normalize:et,perpendiculars:Cm,projectVector:Om,projectVector2D:wm,distance2BetweenPoints:ze,angleBetweenVectors:Rm,gaussianAmplitude:Em,gaussianWeight:Mm,dot2D:Rs,outer2D:Dm,norm2D:Hf,normalize2D:Vm,determinant2x2:Re,LUFactor3x3:Lm,LUSolve3x3:_m,linearSolve3x3:Bm,multiply3x3_vect3:Fm,multiply3x3_mat3:Es,multiplyMatrix:Um,transpose3x3:Zr,invert3x3:Nm,identity3x3:jf,identity:Pf,isIdentity:Gm,isIdentity3x3:km,determinant3x3:Ba,quaternionToMatrix3x3:$f,areEquals:Fa,areMatricesEqual:cr,roundNumber:La,roundVector:Ua,matrix3x3ToQuaternion:Af,multiplyQuaternion:bm,orthogonalize3x3:Kf,diagonalize3x3:Xf,singularValueDecomposition3x3:zm,solveLinearSystem:_s,invertMatrix:Na,luFactorLinearSystem:Vs,luSolveLinearSystem:Ls,estimateMatrixCondition:Wm,jacobi:Im,jacobiN:_n,solveHomogeneousLeastSquares:Ms,solveLeastSquares:Hm,hex2float:jm,rgb2hsv:Qr,hsv2rgb:Qt,lab2xyz:Yf,xyz2lab:qf,xyz2rgb:Zf,rgb2xyz:Qf,rgb2lab:fr,lab2rgb:Bn,uninitializeBounds:Fn,areBoundsInitialized:Un,computeBoundsFromPoints:Pm,clampValue:Yt,clampVector:Ga,clampAndNormalizeValue:$m,getScalarTypeFittingRange:Am,getAdjustedScalarRange:Km,extentIsWithinOtherExtent:Xm,boundsIsWithinOtherBounds:Ym,pointIsWithinBounds:qm,solve3PointCircle:Zm,inf:Qm,negInf:Jm,isInf:Bs,isNan:Ds,isNaN:Ds,isFinite:ey,createUninitializedBounds:Fs,getMajorAxisIndex:ty,getMinorAxisIndex:ry,getSparseOrthogonalMatrix:ny,floatToHex2:Jf,floatRGB2HexCode:ay,float2CssRGBA:iy};var{vtkWarningMacro:sy}=w,{DefaultDataType:oy}=ms;function Us(t,e,r){let n=t.length,a=Number.MAX_VALUE,i=-Number.MAX_VALUE,s,o;for(o=e;o<n;o+=r)if(!Number.isNaN(t[o])){a=t[o],i=a;break}for(;o<n;o+=r)s=t[o],s<a?a=s:s>i&&(i=s);return{min:a,max:i}}function cy(){let t=Number.MAX_VALUE,e=-Number.MAX_VALUE,r=0,n=0;return{add(a){t>a&&(t=a),e<a&&(e=a),r++,n+=a},get(){return{min:t,max:e,count:r,sum:n,mean:n/r}},getRange(){return{min:t,max:e}}}}function tu(t,e=0,r=1){if(e<0&&r>1){let n=t.length/r,a=new Float64Array(n);for(let i=0,s=0;i<n;++i){for(let o=s+r;s<o;++s)a[i]+=t[s]*t[s];a[i]**=.5}return Us(a,0,1)}return Us(t,e<0?0:e,r)}function eu(t,e=0){let r=t||[];for(;r.length<=e;)r.push(null);return r}function Ns(t){return Object.prototype.toString.call(t).slice(8,-1)}function fy(t){let e=t.getNumberOfComponents(),r=0,n=new Array(e);for(let a=0;a<t.getNumberOfTuples();++a){t.getTuple(a,n);let i=Oe.norm(n,e);i>r&&(r=i)}return r}var uy={computeRange:tu,createRangeHelper:cy,fastComputeRange:Us,getDataType:Ns,getMaxNorm:fy};function ly(t,e){e.classHierarchy.push("vtkDataArray");function r(n){let a=t.getNumberOfComponents(),i=e.values.length/(a>0?a:1);if(n!==i&&n>i){let s=e.values;e.values=w.newTypedArray(e.dataType,(n+i)*a),e.values.set(s)}}t.dataChange=()=>{e.ranges=null,t.modified()},t.allocate=n=>{!Number.isInteger(n)||n<0||r(t.getNumberOfTuples()+n)},t.resize=n=>{if(!Number.isInteger(n)||n<0)return!1;r(n);let a=n*t.getNumberOfComponents();return e.size!==a?(e.size=a,t.dataChange(),!0):!1},t.initialize=()=>(t.resize(0),t),t.getElementComponentSize=()=>e.values.BYTES_PER_ELEMENT,t.getComponent=(n,a=0)=>e.values[n*e.numberOfComponents+a],t.setComponent=(n,a,i)=>{let s=n*e.numberOfComponents+a;Object.is(i,e.values[s])||(e.values[s]=i,t.dataChange())},t.getValue=n=>e.values[n],t.setValue=(n,a)=>{Object.is(a,e.values[n])||(e.values[n]=a,t.dataChange())},t.getData=()=>e.size===e.values.length?e.values:e.values.subarray(0,e.size),t.getRange=(n=-1)=>{let a=n;a<0&&(a=e.numberOfComponents===1?0:e.numberOfComponents);let i=null;return e.ranges||(e.ranges=eu(e.ranges,e.numberOfComponents)),i=e.ranges[a],i?(e.rangeTuple[0]=i.min,e.rangeTuple[1]=i.max,e.rangeTuple):(i=tu(t.getData(),n,e.numberOfComponents),e.ranges[a]=i,e.rangeTuple[0]=i.min,e.rangeTuple[1]=i.max,e.rangeTuple)},t.setRange=(n,a)=>{e.ranges||(e.ranges=eu(e.ranges,e.numberOfComponents));let i={min:n.min,max:n.max};return e.ranges[a]=i,e.rangeTuple[0]=i.min,e.rangeTuple[1]=i.max,e.rangeTuple},t.getRanges=(n=!0)=>{if(!n)return structuredClone(e.ranges);let a=[];for(let i=0;i<e.numberOfComponents;i++){let[s,o]=t.getRange(i),c={min:s,max:o};a.push(c)}if(e.numberOfComponents>1){let[i,s]=t.getRange(-1),o={min:i,max:s};a.push(o)}return a},t.setTuple=(n,a)=>{let i=n*e.numberOfComponents,s=!1;for(let o=0;o<e.numberOfComponents;o++){let c=i+o,f=e.values[c];e.values[c]=a[o],Object.is(e.values[c],f)||(s=!0)}return s&&t.dataChange(),s},t.setTuples=(n,a)=>{let i=n*e.numberOfComponents,s=Math.min(a.length,e.size-i),o=!1;for(let c=0;c<s;){let f=e.values[i];e.values[i]=a[c],Object.is(e.values[i],f)||(o=!0),i++,c++}return o&&t.dataChange(),o},t.insertTuple=(n,a)=>{if(!Number.isInteger(n)||n<0)throw new RangeError("idx must be a nonnegative integer");let i=e.size<=n*e.numberOfComponents;i&&(r(n+1),e.size=(n+1)*e.numberOfComponents);let s=t.setTuple(n,a);return i&&!s&&t.dataChange(),n},t.insertTuples=(n,a)=>{if(!Number.isInteger(n)||n<0)throw new RangeError("idx must be a nonnegative integer");if(a.length%e.numberOfComponents!==0)throw new RangeError("tuples.length must be a multiple of numberOfComponents");let i=n+a.length/e.numberOfComponents,s=e.size<i*e.numberOfComponents;s&&(r(i),e.size=i*e.numberOfComponents);let o=t.setTuples(n,a);return s&&!o&&t.dataChange(),i},t.insertNextTuple=n=>{let a=e.size/e.numberOfComponents;return t.insertTuple(a,n)},t.insertNextTuples=n=>{let a=e.size/e.numberOfComponents;return t.insertTuples(a,n)},t.findTuple=(n,a=qr)=>{for(let i=0;i<e.size;i+=e.numberOfComponents)if(Math.abs(n[0]-e.values[i])<=a){let s=!0;for(let o=1;o<e.numberOfComponents;++o)if(Math.abs(n[o]-e.values[i+o])>a){s=!1;break}if(s)return i/e.numberOfComponents}return-1},t.getTuple=(n,a=[])=>{let i=e.numberOfComponents||1,s=n*i;switch(i){case 4:a[3]=e.values[s+3];case 3:a[2]=e.values[s+2];case 2:a[1]=e.values[s+1];case 1:a[0]=e.values[s];break;default:for(let o=i-1;o>=0;--o)a[o]=e.values[s+o]}return a},t.getTuples=(n,a)=>{let i=(n??0)*e.numberOfComponents,s=(a??t.getNumberOfTuples())*e.numberOfComponents,o=t.getData().subarray(i,s);return o.length>0?o:null},t.getTupleLocation=(n=1)=>n*e.numberOfComponents,t.getNumberOfComponents=()=>e.numberOfComponents,t.getNumberOfValues=()=>e.size,t.getNumberOfTuples=()=>e.size/e.numberOfComponents,t.getDataType=()=>e.dataType,t.setNumberOfComponents=n=>!Number.isInteger(n)||n<=0||e.size%n!==0?(sy("numberOfComponents must be a positive integer that divides the array size"),!1):e.numberOfComponents!==n?(e.numberOfComponents=n,t.dataChange(),!0):!1,t.newClone=()=>nu({empty:!0,name:e.name,dataType:e.dataType,numberOfComponents:e.numberOfComponents,ranges:structuredClone(e.ranges)}),t.getName=()=>(e.name||(t.modified(),e.name=`vtkDataArray${t.getMTime()}`),e.name),t.setData=(n,a)=>{if(!ArrayBuffer.isView(n)||n instanceof DataView)throw new TypeError("Array must be a TypedArray");let i=a??e.numberOfComponents;e.values=n,e.size=n.length,e.dataType=Ns(n),e.numberOfComponents=1,Number.isInteger(i)&&i>0&&e.size%i===0&&(e.numberOfComponents=i),t.dataChange()},t.getState=({preserveTypedArrays:n=!1}={})=>{if(e.deleted)return null;let a={...e,vtkClass:t.getClassName()};n||(a.values=Array.from(a.values)),delete a.buffer,Object.keys(a).forEach(s=>{a[s]||delete a[s]});let i={};return Object.keys(a).sort().forEach(s=>{i[s]=a[s]}),i.mtime&&delete i.mtime,i},t.deepCopy=n=>{let a=t.getDataType(),i=e.values;t.shallowCopy(n);let s=structuredClone(n.getRanges(!1));i?.length>=n.getNumberOfValues()&&a===n.getDataType()?(i.set(n.getData()),e.values=i):e.values=n.getData().slice(),e.ranges=s,e.rangeTuple=[0,0],t.modified()},t.interpolateTuple=(n,a,i,s,o,c)=>{let f=e.numberOfComponents||1;if(f!==a.getNumberOfComponents()||f!==s.getNumberOfComponents())throw new RangeError("numberOfComponents must match");let u=a.getTuple(i),g=s.getTuple(o),l=[];switch(l.length=f,f){case 4:l[3]=u[3]+(g[3]-u[3])*c;case 3:l[2]=u[2]+(g[2]-u[2])*c;case 2:l[1]=u[1]+(g[1]-u[1])*c;case 1:l[0]=u[0]+(g[0]-u[0])*c;break;default:for(let h=0;h<f;h++)l[h]=u[h]+(g[h]-u[h])*c}return t.insertTuple(n,l)}}var py={name:"",numberOfComponents:1,dataType:oy,rangeTuple:[0,0]};function ru(t,e,r={}){if(Object.assign(e,py,r),Array.isArray(r.values)&&r.dataType===void 0&&console.warn("vtkDataArray.newInstance: no dataType provided, converting to Float32Array"),!e.empty&&!e.values&&!e.size)throw new TypeError("Cannot create vtkDataArray object without: size > 0, values");if(e.values?Array.isArray(e.values)&&(e.values=w.newTypedArrayFrom(e.dataType,e.values)):e.values=w.newTypedArray(e.dataType,e.size),e.values&&(e.size=e.size??e.values.length,e.dataType=Ns(e.values)),w.obj(t,e),w.set(t,e,["name"]),!Number.isInteger(e.numberOfComponents)||e.numberOfComponents<=0||e.size%e.numberOfComponents!==0)throw new RangeError("numberOfComponents must be a positive integer that divides model.size");ly(t,e)}var nu=w.newInstance(ru,"vtkDataArray"),Z={newInstance:nu,extend:ru,...uy,...ms};var{isVtkObject:gy}=w;function au(t){let e=[];for(let r=0;r<t.length;r+=t[r]+1)e.push(t[r]);return e}function iu(t){let e=0;for(let r=0;r<t.length;)r+=t[r]+1,e++;return e}var hy={extractCellSizes:au,getNumberOfCells:iu};function vy(t,e){e.classHierarchy.push("vtkCellArray");let r={...t};t.getNumberOfCells=n=>(e.numberOfCells!==void 0&&!n||(e.cellSizes?e.numberOfCells=e.cellSizes.length:e.numberOfCells=iu(t.getData())),e.numberOfCells),t.getCellSizes=n=>(e.cellSizes!==void 0&&!n||(e.cellSizes=au(t.getData())),e.cellSizes),t.resize=n=>{let a=t.getNumberOfTuples();r.resize(n);let i=t.getNumberOfTuples();i<a&&(i===0?(e.numberOfCells=0,e.cellSizes=[]):(e.numberOfCells=void 0,e.cellSizes=void 0))},t.setData=n=>{r.setData(n,1),e.numberOfCells=void 0,e.cellSizes=void 0},t.getCell=n=>{let a=n,i=e.values[a++];return e.values.subarray(a,a+i)},t.insertNextCell=n=>{let a;gy(n)?a=n.getPointsIds():a=n;let i=t.getNumberOfCells(),s=a.length,o=new Array(s+1);o[0]=s;for(let c=0;c<s;++c)o[c+1]=a[c];return t.insertNextTuples(o),++e.numberOfCells,e.cellSizes!=null&&e.cellSizes.push(a.length),i},t.getMaxCellSize=()=>t.getCellSizes().reduce((n,a)=>Math.max(n,a),0)}function dy(t){return{empty:!0,numberOfComponents:1,dataType:re.UNSIGNED_INT,...t}}function su(t,e,r={}){Z.extend(t,e,dy(r)),vy(t,e)}var Ty=w.newInstance(su,"vtkCellArray"),je={newInstance:Ty,extend:su,...hy};var ou={FLAT:0,GOURAUD:1,PHONG:2,PBR:3},Pe={POINTS:0,WIREFRAME:1,SURFACE:2},my=ou,Gs={Shading:ou,Representation:Pe,Interpolation:my};var $e={Off:0,PolygonOffset:1},ks=$e.PolygonOffset,ka=$e.Off,yy=["VTK_RESOLVE_OFF","VTK_RESOLVE_POLYGON_OFFSET"];function Sy(){return ks}function xy(t){let e=ks===t;return ks=t,e}function Cy(){return ka}function ba(t=0){let e=ka===t;return ka=t,e}function Oy(){return ba($e.Off)}function wy(){return ba($e.Off)}function Ry(){return ba($e.PolygonOffset)}function Ey(){return yy[ka]}var za={Resolve:$e,getResolveCoincidentTopologyAsString:Ey,getResolveCoincidentTopologyPolygonOffsetFaces:Sy,getResolveCoincidentTopology:Cy,setResolveCoincidentTopology:ba,setResolveCoincidentTopologyPolygonOffsetFaces:xy,setResolveCoincidentTopologyToDefault:Oy,setResolveCoincidentTopologyToOff:wy,setResolveCoincidentTopologyToPolygonOffset:Ry};function cu(t,e,r){r.forEach(n=>{t[`get${n.method}`]=()=>e[n.key],t[`set${n.method}`]=w.objectSetterMap.object(t,e,{name:n.key,params:["factor","offset"]})})}var bs=["Polygon","Line","Point"],My={Polygon:{factor:2,offset:0},Line:{factor:1,offset:-1},Point:{factor:0,offset:-2}},Dy=()=>{},_r={modified:Dy};cu(_r,My,bs.map(t=>({key:t,method:`ResolveCoincidentTopology${t}OffsetParameters`})));function Vy(t,e){e.resolveCoincidentTopology===void 0&&(e.resolveCoincidentTopology=!1),w.setGet(t,e,["resolveCoincidentTopology"]),e.topologyOffset={Polygon:{factor:0,offset:0},Line:{factor:0,offset:0},Point:{factor:0,offset:0}},Object.keys(za).forEach(r=>{t[r]=za[r]}),Object.keys(_r).filter(r=>r!=="modified").forEach(r=>{t[r]=_r[r]}),cu(t,e.topologyOffset,bs.map(r=>({key:r,method:`RelativeCoincidentTopology${r}OffsetParameters`}))),t.getCoincidentTopologyPolygonOffsetParameters=()=>{let r=_r.getResolveCoincidentTopologyPolygonOffsetParameters(),n=t.getRelativeCoincidentTopologyPolygonOffsetParameters();return{factor:r.factor+n.factor,offset:r.offset+n.offset}},t.getCoincidentTopologyLineOffsetParameters=()=>{let r=_r.getResolveCoincidentTopologyLineOffsetParameters(),n=t.getRelativeCoincidentTopologyLineOffsetParameters();return{factor:r.factor+n.factor,offset:r.offset+n.offset}},t.getCoincidentTopologyPointOffsetParameter=()=>{let r=_r.getResolveCoincidentTopologyPointOffsetParameters(),n=t.getRelativeCoincidentTopologyPointOffsetParameters();return{factor:r.factor+n.factor,offset:r.offset+n.offset}}}var zs={implementCoincidentTopologyMethods:Vy,staticOffsetAPI:_r,otherStaticMethods:za,CATEGORIES:bs,Resolve:$e};var Ly={NONE:-1,I:0,J:1,K:2,X:3,Y:4,Z:5},Wa={SlicingMode:Ly};var Qe={NEAREST:0,LINEAR:1};var Br={CLAMP_TO_EDGE:0,REPEAT:1,MIRRORED_REPEAT:2},X={NEAREST:0,LINEAR:1,NEAREST_MIPMAP_NEAREST:2,NEAREST_MIPMAP_LINEAR:3,LINEAR_MIPMAP_NEAREST:4,LINEAR_MIPMAP_LINEAR:5},Ws={Wrap:Br,Filter:X};var fu=new Float32Array(1),_y=new Int32Array(fu.buffer);function By(t){fu[0]=t;let e=_y[0],r=e>>16&32768,n=e>>12&2047,a=e>>23&255;return a<103?r:a>142?(r|=31744,r|=(a===255?0:1)&&e&8388607,r):a<113?(n|=2048,r|=(n>>114-a)+(n>>113-a&1),r):(r|=a-112<<10|n>>1,r+=n&1,r)}function Fy(t){let e=(t&32768)>>15,r=(t&31744)>>10,n=t&1023;return r===0?(e?-1:1)*2**-14*(n/1024):r===31?n?NaN:(e?-1:1)*(1/0):(e?-1:1)*2**(r-15)*(1+n/1024)}var Jt={fromHalf:Fy,toHalf:By};function Uy(){try{let n=new Int16Array([0,32767]),a=[1,1],i=document.createElement("canvas");i.width=4,i.height=4;let s=i.getContext("webgl2");if(!s)return!1;let o=s.getExtension("EXT_texture_norm16");if(!o)return!1;let c=`#version 300 es
    void main() {
      gl_PointSize = ${4 .toFixed(1)};
      gl_Position = vec4(0, 0, 0, 1);
    }
  `,f=`#version 300 es
    precision highp float;
    precision highp int;
    precision highp sampler2D;

    uniform sampler2D u_image;

    out vec4 color;

    void main() {
        vec4 intColor = texture(u_image, gl_PointCoord.xy);
        color = vec4(vec3(intColor.rrr), 1);
    }
    `,u=s.createShader(s.VERTEX_SHADER);if(s.shaderSource(u,c),s.compileShader(u),!s.getShaderParameter(u,s.COMPILE_STATUS))return!1;let g=s.createShader(s.FRAGMENT_SHADER);if(s.shaderSource(g,f),s.compileShader(g),!s.getShaderParameter(g,s.COMPILE_STATUS))return!1;let l=s.createProgram();if(s.attachShader(l,u),s.attachShader(l,g),s.linkProgram(l),!s.getProgramParameter(l,s.LINK_STATUS))return!1;let h=s.createTexture();s.bindTexture(s.TEXTURE_2D,h),s.texImage2D(s.TEXTURE_2D,0,o.R16_SNORM_EXT,2,1,0,s.RED,s.SHORT,n),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.useProgram(l),s.drawArrays(s.POINTS,0,1);let y=new Uint8Array(4);s.readPixels(a[0],a[1],1,1,s.RGBA,s.UNSIGNED_BYTE,y);let[p,m,d]=y,x=s.getExtension("WEBGL_lose_context");return x&&x.loseContext(),p===m&&m===d&&p!==0}catch{return!1}}var Is;function uu(){return Is===void 0&&(Is=Uy()),Is}var pu=On(ua(),1),{Wrap:er,Filter:ke}=Ws,{VtkDataTypes:Te}=Z,{vtkDebugMacro:Hs,vtkErrorMacro:Jr,vtkWarningMacro:lu,requiredParam:ge}=we,{toHalf:Ny}=Jt;function Gy(t,e){e.classHierarchy.push("vtkOpenGLTexture");function r(){return{internalFormat:e.internalFormat,format:e.format,openGLDataType:e.openGLDataType,width:e.width,height:e.height}}t.render=(h=null)=>{if(h?e._openGLRenderWindow=h:(e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer"),e._openGLRenderWindow=e._openGLRenderer.getLastAncestorOfType("vtkOpenGLRenderWindow")),e.context=e._openGLRenderWindow.getContext(),e.renderable.getInterpolate()?(e.generateMipmap?t.setMinificationFilter(ke.LINEAR_MIPMAP_LINEAR):t.setMinificationFilter(ke.LINEAR),t.setMagnificationFilter(ke.LINEAR)):(t.setMinificationFilter(ke.NEAREST),t.setMagnificationFilter(ke.NEAREST)),e.renderable.getRepeat()&&(t.setWrapR(er.REPEAT),t.setWrapS(er.REPEAT),t.setWrapT(er.REPEAT)),e.renderable.getInputData()&&e.renderable.setImage(null),!e.handle||e.renderable.getMTime()>e.textureBuildTime.getMTime()){if(e.renderable.getImageBitmap()!==null&&(e.renderable.getInterpolate()&&(e.generateMipmap=!0,t.setMinificationFilter(ke.LINEAR_MIPMAP_LINEAR)),e.renderable.getImageBitmap()&&e.renderable.getImageLoaded()&&(t.create2DFromImageBitmap(e.renderable.getImageBitmap()),t.activate(),t.sendParameters(),e.textureBuildTime.modified())),e.renderable.getImage()!==null&&(e.renderable.getInterpolate()&&(e.generateMipmap=!0,t.setMinificationFilter(ke.LINEAR_MIPMAP_LINEAR)),e.renderable.getImage()&&e.renderable.getImageLoaded()&&(t.create2DFromImage(e.renderable.getImage()),t.activate(),t.sendParameters(),e.textureBuildTime.modified())),e.renderable.getCanvas()!==null){e.renderable.getInterpolate()&&(e.generateMipmap=!0,t.setMinificationFilter(ke.LINEAR_MIPMAP_LINEAR));let p=e.renderable.getCanvas();t.create2DFromRaw({width:p.width,height:p.height,numComps:4,dataType:Te.UNSIGNED_CHAR,data:p,flip:!0}),t.activate(),t.sendParameters(),e.textureBuildTime.modified()}if(e.renderable.getJsImageData()!==null){let p=e.renderable.getJsImageData();e.renderable.getInterpolate()&&(e.generateMipmap=!0,t.setMinificationFilter(ke.LINEAR_MIPMAP_LINEAR)),t.create2DFromRaw({width:p.width,height:p.height,numComps:4,dataType:Te.UNSIGNED_CHAR,data:p.data,flip:!0}),t.activate(),t.sendParameters(),e.textureBuildTime.modified()}let y=e.renderable.getInputData(0);if(y&&y.getPointData().getScalars()){let p=y.getExtent(),m=y.getPointData().getScalars(),d=[];for(let x=0;x<e.renderable.getNumberOfInputPorts();++x){let T=e.renderable.getInputData(x),v=T?T.getPointData().getScalars().getData():null;v&&d.push(v)}e.renderable.getInterpolate()&&m.getNumberOfComponents()===4&&(e.generateMipmap=!0,t.setMinificationFilter(ke.LINEAR_MIPMAP_LINEAR)),d.length%6===0?t.createCubeFromRaw({width:p[1]-p[0]+1,height:p[3]-p[2]+1,numComps:m.getNumberOfComponents(),dataType:m.getDataType(),data:d}):t.create2DFromRaw({width:p[1]-p[0]+1,height:p[3]-p[2]+1,numComps:m.getNumberOfComponents(),dataType:m.getDataType(),data:m.getData()}),t.activate(),t.sendParameters(),e.textureBuildTime.modified()}}e.handle&&t.activate()};let n=()=>{if(!((e.minificationFilter===ke.LINEAR||e.magnificationFilter===ke.LINEAR)&&!uu()))return e.oglNorm16Ext};t.destroyTexture=()=>{t.deactivate(),e.context&&e.handle&&e.context.deleteTexture(e.handle),e._prevTexParams=null,e.handle=0,e.numberOfDimensions=0,e.target=0,e.components=0,e.width=0,e.height=0,e.depth=0,t.resetFormatAndType()},t.createTexture=()=>{e.handle||(e.handle=e.context.createTexture(),e.target&&(e.context.bindTexture(e.target,e.handle),e.context.texParameteri(e.target,e.context.TEXTURE_MIN_FILTER,t.getOpenGLFilterMode(e.minificationFilter)),e.context.texParameteri(e.target,e.context.TEXTURE_MAG_FILTER,t.getOpenGLFilterMode(e.magnificationFilter)),e.context.texParameteri(e.target,e.context.TEXTURE_WRAP_S,t.getOpenGLWrapMode(e.wrapS)),e.context.texParameteri(e.target,e.context.TEXTURE_WRAP_T,t.getOpenGLWrapMode(e.wrapT)),e.context.texParameteri(e.target,e.context.TEXTURE_WRAP_R,t.getOpenGLWrapMode(e.wrapR)),e.context.bindTexture(e.target,null)))},t.getTextureUnit=()=>e._openGLRenderWindow?e._openGLRenderWindow.getTextureUnitForTexture(t):-1,t.activate=()=>{e._openGLRenderWindow.activateTexture(t),t.bind()},t.deactivate=()=>{e._openGLRenderWindow&&e._openGLRenderWindow.deactivateTexture(t)},t.releaseGraphicsResources=(h=e._openGLRenderWindow)=>{h&&e.handle&&(h.isDeleted()||h.deactivateTexture(t),e.context.deleteTexture(e.handle),e._prevTexParams=null,e.handle=0,e.numberOfDimensions=0,e.target=0,e.format=0,e.openGLDataType=0,e.components=0,e.width=0,e.height=0,e.depth=0,e.allocatedGPUMemoryInBytes=0),e.shaderProgram&&(e.shaderProgram.releaseGraphicsResources(h),e.shaderProgram=null)},t.delete=at(()=>t.releaseGraphicsResources(),t.delete),t.bind=()=>{e.context.bindTexture(e.target,e.handle),e.autoParameters&&t.getMTime()>e.sendParametersTime.getMTime()&&t.sendParameters()},t.isBound=()=>{let h=!1;if(e.context&&e.handle){let y=0;switch(e.target){case e.context.TEXTURE_2D:y=e.context.TEXTURE_BINDING_2D;break;default:lu("impossible case")}h=e.context.getIntegerv(y)===e.handle}return h},t.sendParameters=()=>{e.context.texParameteri(e.target,e.context.TEXTURE_WRAP_S,t.getOpenGLWrapMode(e.wrapS)),e.context.texParameteri(e.target,e.context.TEXTURE_WRAP_T,t.getOpenGLWrapMode(e.wrapT)),e.context.texParameteri(e.target,e.context.TEXTURE_WRAP_R,t.getOpenGLWrapMode(e.wrapR)),e.context.texParameteri(e.target,e.context.TEXTURE_MIN_FILTER,t.getOpenGLFilterMode(e.minificationFilter)),e.context.texParameteri(e.target,e.context.TEXTURE_MAG_FILTER,t.getOpenGLFilterMode(e.magnificationFilter)),e.context.texParameteri(e.target,e.context.TEXTURE_BASE_LEVEL,e.baseLevel),e.context.texParameteri(e.target,e.context.TEXTURE_MAX_LEVEL,e.maxLevel),e.sendParametersTime.modified()},t.getInternalFormat=(h,y)=>(e._forceInternalFormat||(e.internalFormat=t.getDefaultInternalFormat(h,y)),e.internalFormat||Hs(`Unable to find suitable internal format for T=${h} NC= ${y}`),[e.context.R32F,e.context.RG32F,e.context.RGB32F,e.context.RGBA32F].includes(e.internalFormat)&&!e.context.getExtension("OES_texture_float_linear")&&lu("Failed to load OES_texture_float_linear. Texture filtering is not available for *32F internal formats."),e.internalFormat),t.getDefaultInternalFormat=(h,y)=>{let p=0;return p=e._openGLRenderWindow.getDefaultTextureInternalFormat(h,y,n(),t.useHalfFloat()),p||(p||(Hs("Unsupported internal texture type!"),Hs(`Unable to find suitable internal format for T=${h} NC= ${y}`)),p)},t.useHalfFloat=()=>e.enableUseHalfFloat&&e.canUseHalfFloat,t.setInternalFormat=h=>{e._forceInternalFormat=!0,h!==e.internalFormat&&(e.internalFormat=h,t.modified())},t.getFormat=(h,y)=>(e.format=t.getDefaultFormat(h,y),e.format),t.getDefaultFormat=(h,y)=>{switch(y){case 1:return e.context.RED;case 2:return e.context.RG;case 3:return e.context.RGB;case 4:return e.context.RGBA;default:return e.context.RGB}},t.resetFormatAndType=()=>{e._prevTexParams=null,e.format=0,e.internalFormat=0,e._forceInternalFormat=!1,e.openGLDataType=0},t.getDefaultDataType=h=>{let y=t.useHalfFloat();switch(h){case Te.UNSIGNED_CHAR:return e.context.UNSIGNED_BYTE;case(n()&&!y&&Te.SHORT):return e.context.SHORT;case(n()&&!y&&Te.UNSIGNED_SHORT):return e.context.UNSIGNED_SHORT;case(y&&Te.SHORT):case(y&&Te.UNSIGNED_SHORT):return e.context.HALF_FLOAT;case Te.FLOAT:case Te.VOID:default:return e.context.FLOAT}},t.getOpenGLDataType=(h,y=!1)=>((!e.openGLDataType||y)&&(e.openGLDataType=t.getDefaultDataType(h)),e.openGLDataType),t.getShiftAndScale=()=>{let h=0,y=1;switch(e.openGLDataType){case e.context.BYTE:y=127.5,h=y-128;break;case e.context.UNSIGNED_BYTE:y=255,h=0;break;case e.context.SHORT:y=32767.5,h=y-32768;break;case e.context.UNSIGNED_SHORT:y=65536,h=0;break;case e.context.INT:y=21474836475e-1,h=y-2147483648;break;case e.context.UNSIGNED_INT:y=4294967295,h=0;break;case e.context.FLOAT:}return{shift:h,scale:y}},t.getOpenGLFilterMode=h=>{switch(h){case ke.NEAREST:return e.context.NEAREST;case ke.LINEAR:return e.context.LINEAR;case ke.NEAREST_MIPMAP_NEAREST:return e.context.NEAREST_MIPMAP_NEAREST;case ke.NEAREST_MIPMAP_LINEAR:return e.context.NEAREST_MIPMAP_LINEAR;case ke.LINEAR_MIPMAP_NEAREST:return e.context.LINEAR_MIPMAP_NEAREST;case ke.LINEAR_MIPMAP_LINEAR:return e.context.LINEAR_MIPMAP_LINEAR;default:return e.context.NEAREST}},t.getOpenGLWrapMode=h=>{switch(h){case er.CLAMP_TO_EDGE:return e.context.CLAMP_TO_EDGE;case er.REPEAT:return e.context.REPEAT;case er.MIRRORED_REPEAT:return e.context.MIRRORED_REPEAT;default:return e.context.CLAMP_TO_EDGE}};function a(h){let[y,p,m,d,x,T]=h;return[p-y+1,d-m+1,T-x+1]}function i(h){let[y,p,m]=a(h);return y*p*m}function s(h,y,p,m,d){let[x,T,v,C,O,M]=p,[S,E]=y,R=S*E,D=d;for(let V=O;V<=M;V++){let U=V*R;for(let B=v;B<=C;B++){let _=U+B*S;for(let N=_+x,k=_+T;N<=k;N++,D++)m[D]=h[N]}}}function o(h,y,p=null){let m=new(p||h.constructor)(y.reduce((T,v)=>T+i(v),0)),d=[e.width,e.height,e.depth],x=0;return y.forEach(T=>{s(h,d,T,m,x),x+=i(T)}),m}t.updateArrayDataTypeForGL=(h,y,p=!1,m=[])=>{let d=[],x=e.width*e.height*e.components;p&&(x*=e.depth);let T=!!m.length;if(h!==Te.FLOAT&&e.openGLDataType===e.context.FLOAT)for(let v=0;v<y.length;v++)if(y[v])if(T)d.push(o(y[v],m,Float32Array));else{let C=y[v].length>x?y[v].subarray(0,x):y[v];d.push(new Float32Array(C))}else d.push(null);if(h!==Te.UNSIGNED_CHAR&&e.openGLDataType===e.context.UNSIGNED_BYTE)for(let v=0;v<y.length;v++)if(y[v])if(T)d.push(o(y[v],m,Uint8Array));else{let C=y[v].length>x?y[v].subarray(0,x):y[v];d.push(new Uint8Array(C))}else d.push(null);if(e.openGLDataType===e.context.HALF_FLOAT)for(let v=0;v<y.length;v++)if(y[v]){let C=T?o(y[v],m):y[v],O=new Uint16Array(T?C.length:x),M=O.length;for(let S=0;S<M;S++)O[S]=Ny(C[S]);d.push(O)}else d.push(null);if(d.length===0)for(let v=0;v<y.length;v++)d.push(T&&y[v]?o(y[v],m):y[v]);return d};function c(h){return e._openGLRenderWindow?!(e.resizable||e.renderable?.getResizable()||e._openGLRenderWindow.getGLInformations().RENDERER.value.match(/WebKit/gi)&&navigator.platform.match(/Mac/gi)&&n()&&(h===Te.UNSIGNED_SHORT||h===Te.SHORT)):!1}t.create2DFromRaw=({width:h=ge("width"),height:y=ge("height"),numComps:p=ge("numComps"),dataType:m=ge("dataType"),data:d=ge("data"),flip:x=!1}={})=>{if(t.getOpenGLDataType(m,!0),t.getInternalFormat(m,p),t.getFormat(m,p),!e.internalFormat||!e.format||!e.openGLDataType)return Jr("Failed to determine texture parameters."),!1;e.target=e.context.TEXTURE_2D,e.components=p,e.width=h,e.height=y,e.depth=1,e.numberOfDimensions=2,e._openGLRenderWindow.activateTexture(t),t.createTexture(),t.bind();let T=[d],v=t.updateArrayDataTypeForGL(m,T);return e.context.pixelStorei(e.context.UNPACK_FLIP_Y_WEBGL,x),e.context.pixelStorei(e.context.UNPACK_ALIGNMENT,1),c(m)?(e.context.texStorage2D(e.target,1,e.internalFormat,e.width,e.height),v[0]!=null&&e.context.texSubImage2D(e.target,0,0,0,e.width,e.height,e.format,e.openGLDataType,v[0])):e.context.texImage2D(e.target,0,e.internalFormat,e.width,e.height,0,e.format,e.openGLDataType,v[0]),e.generateMipmap&&e.context.generateMipmap(e.target),x&&e.context.pixelStorei(e.context.UNPACK_FLIP_Y_WEBGL,!1),e.allocatedGPUMemoryInBytes=e.width*e.height*e.depth*p*e._openGLRenderWindow.getDefaultTextureByteSize(m,n(),t.useHalfFloat()),t.deactivate(),!0},t.createCubeFromRaw=({width:h=ge("width"),height:y=ge("height"),numComps:p=ge("numComps"),dataType:m=ge("dataType"),data:d=ge("data")}={})=>{if(t.getOpenGLDataType(m),t.getInternalFormat(m,p),t.getFormat(m,p),!e.internalFormat||!e.format||!e.openGLDataType)return Jr("Failed to determine texture parameters."),!1;e.target=e.context.TEXTURE_CUBE_MAP,e.components=p,e.width=h,e.height=y,e.depth=1,e.numberOfDimensions=2,e._openGLRenderWindow.activateTexture(t),e.maxLevel=d.length/6-1,t.createTexture(),t.bind();let x=t.updateArrayDataTypeForGL(m,d),T=[],v=e.width,C=e.height;for(let O=0;O<x.length;O++){O%6===0&&O!==0&&(v/=2,C/=2),T[O]=Xr(m,C*v*e.components);for(let M=0;M<C;++M){let S=M*v*e.components,E=(C-M-1)*v*e.components;T[O].set(x[O].slice(E,E+v*e.components),S)}}e.context.pixelStorei(e.context.UNPACK_ALIGNMENT,1),c(m)&&e.context.texStorage2D(e.target,6,e.internalFormat,e.width,e.height);for(let O=0;O<6;O++){let M=0,S=e.width,E=e.height;for(;S>=1&&E>=1;){let R=null;M<=e.maxLevel&&(R=T[6*M+O]),c(m)?R!=null&&e.context.texSubImage2D(e.context.TEXTURE_CUBE_MAP_POSITIVE_X+O,M,0,0,S,E,e.format,e.openGLDataType,R):e.context.texImage2D(e.context.TEXTURE_CUBE_MAP_POSITIVE_X+O,M,e.internalFormat,S,E,0,e.format,e.openGLDataType,R),M++,S/=2,E/=2}}return e.allocatedGPUMemoryInBytes=e.width*e.height*e.depth*p*e._openGLRenderWindow.getDefaultTextureByteSize(m,n(),t.useHalfFloat()),t.deactivate(),!0},t.createDepthFromRaw=({width:h=ge("width"),height:y=ge("height"),dataType:p=ge("dataType"),data:m=ge("data")}={})=>(t.getOpenGLDataType(p),e.format=e.context.DEPTH_COMPONENT,p===Te.FLOAT?e.internalFormat=e.context.DEPTH_COMPONENT32F:e.internalFormat=e.context.DEPTH_COMPONENT16,!e.internalFormat||!e.format||!e.openGLDataType?(Jr("Failed to determine texture parameters."),!1):(e.target=e.context.TEXTURE_2D,e.components=1,e.width=h,e.height=y,e.depth=1,e.numberOfDimensions=2,e._openGLRenderWindow.activateTexture(t),t.createTexture(),t.bind(),e.context.pixelStorei(e.context.UNPACK_ALIGNMENT,1),c(p)?(e.context.texStorage2D(e.target,1,e.internalFormat,e.width,e.height),m!=null&&e.context.texSubImage2D(e.target,0,0,0,e.width,e.height,e.format,e.openGLDataType,m)):e.context.texImage2D(e.target,0,e.internalFormat,e.width,e.height,0,e.format,e.openGLDataType,m),e.generateMipmap&&e.context.generateMipmap(e.target),e.allocatedGPUMemoryInBytes=e.width*e.height*e.depth*e.components*e._openGLRenderWindow.getDefaultTextureByteSize(p,n(),t.useHalfFloat()),t.deactivate(),!0)),t.create2DFromImage=h=>{if(t.getOpenGLDataType(Te.UNSIGNED_CHAR),t.getInternalFormat(Te.UNSIGNED_CHAR,4),t.getFormat(Te.UNSIGNED_CHAR,4),!e.internalFormat||!e.format||!e.openGLDataType)return Jr("Failed to determine texture parameters."),!1;e.target=e.context.TEXTURE_2D,e.components=4,e.depth=1,e.numberOfDimensions=2,e._openGLRenderWindow.activateTexture(t),t.createTexture(),t.bind();let y=h,p=h.width,m=h.height,d=!0;if(window.chrome){let x=new OffscreenCanvas(Ln(h.width),Ln(h.height));p=x.width,m=x.height;let T=x.getContext("2d");T.translate(0,x.height),T.scale(1,-1),T.drawImage(h,0,0,h.width,h.height,0,0,x.width,x.height),y=x,d=!1}return e.width=p,e.height=m,e.context.pixelStorei(e.context.UNPACK_FLIP_Y_WEBGL,d),e.context.pixelStorei(e.context.UNPACK_ALIGNMENT,1),c(Te.UNSIGNED_CHAR)?(e.context.texStorage2D(e.target,1,e.internalFormat,e.width,e.height),e.context.texSubImage2D(e.target,0,0,0,e.width,e.height,e.format,e.openGLDataType,y)):e.context.texImage2D(e.target,0,e.internalFormat,e.width,e.height,0,e.format,e.openGLDataType,y),e.generateMipmap&&e.context.generateMipmap(e.target),e.allocatedGPUMemoryInBytes=e.width*e.height*e.depth*e.components*e._openGLRenderWindow.getDefaultTextureByteSize(Te.UNSIGNED_CHAR,n(),t.useHalfFloat()),t.deactivate(),!0},t.create2DFromImageBitmap=h=>(t.getOpenGLDataType(Te.UNSIGNED_CHAR),t.getInternalFormat(Te.UNSIGNED_CHAR,4),t.getFormat(Te.UNSIGNED_CHAR,4),!e.internalFormat||!e.format||!e.openGLDataType?(Jr("Failed to determine texture parameters."),!1):(e.target=e.context.TEXTURE_2D,e.components=4,e.depth=1,e.numberOfDimensions=2,e._openGLRenderWindow.activateTexture(t),t.createTexture(),t.bind(),e.context.pixelStorei(e.context.UNPACK_ALIGNMENT,1),e.width=h.width,e.height=h.height,c(Te.UNSIGNED_CHAR)?(e.context.texStorage2D(e.target,1,e.internalFormat,e.width,e.height),e.context.texSubImage2D(e.target,0,0,0,e.width,e.height,e.format,e.openGLDataType,h)):e.context.texImage2D(e.target,0,e.internalFormat,e.width,e.height,0,e.format,e.openGLDataType,h),e.generateMipmap&&e.context.generateMipmap(e.target),e.allocatedGPUMemoryInBytes=e.width*e.height*e.depth*e.components*e._openGLRenderWindow.getDefaultTextureByteSize(Te.UNSIGNED_CHAR,n(),t.useHalfFloat()),t.deactivate(),!0));function f(h,y,p){let m=new Array(p),d=new Array(p);for(let x=0;x<p;++x)m[x]=h[x],d[x]=y[x]-h[x]||1;return{scale:d,offset:m}}function u(h,y){for(let p=0;p<h.length;p++){let m=h[p],d=y[p]+m;if(m<-2048||m>2048||d<-2048||d>2048)return!1}return!0}function g(h,y,p,m){t.getOpenGLDataType(h);let d=u(y,p)||m;e.canUseHalfFloat=(e.openGLDataType===e.context.FLOAT&&e.context.getExtension("OES_texture_float_linear")===null&&d||e.openGLDataType===e.context.HALF_FLOAT)&&d}function l(h,y){let p=h.getNumberOfComponents(),m=h.getDataType(),d=h.getData(),x=new Array(p),T=new Array(p);for(let C=0;C<p;++C){let[O,M]=h.getRange(C);x[C]=O,T[C]=M}let v=f(x,T,p);return g(m,v.offset,v.scale,y),t.useHalfFloat()||t.getOpenGLDataType(m,!0),{numComps:p,dataType:m,data:d,scaleOffsets:v}}t.create2DFilterableFromRaw=({width:h=ge("width"),height:y=ge("height"),numComps:p=ge("numComps"),dataType:m=ge("dataType"),data:d=ge("data"),preferSizeOverAccuracy:x=!1,ranges:T=void 0}={})=>t.create2DFilterableFromDataArray({width:h,height:y,dataArray:Z.newInstance({numberOfComponents:p,dataType:m,values:d,ranges:T}),preferSizeOverAccuracy:x}),t.create2DFilterableFromDataArray=({width:h=ge("width"),height:y=ge("height"),dataArray:p=ge("dataArray"),preferSizeOverAccuracy:m=!1}={})=>{let{numComps:d,dataType:x,data:T}=l(p,m);t.create2DFromRaw({width:h,height:y,numComps:d,dataType:x,data:T})},t.updateVolumeInfoForGL=(h,y)=>{let p=!1,m=t.useHalfFloat();(!e.volumeInfo?.scale||!e.volumeInfo?.offset)&&(e.volumeInfo={scale:new Array(y),offset:new Array(y)});for(let d=0;d<y;++d)e.volumeInfo.scale[d]=1,e.volumeInfo.offset[d]=0;if(n()&&!m&&h===Te.SHORT){for(let d=0;d<y;++d)e.volumeInfo.scale[d]=32767;p=!0}if(n()&&!m&&h===Te.UNSIGNED_SHORT){for(let d=0;d<y;++d)e.volumeInfo.scale[d]=65535;p=!0}if(h===Te.UNSIGNED_CHAR){for(let d=0;d<y;++d)e.volumeInfo.scale[d]=255;p=!0}return(h===Te.FLOAT||m&&(h===Te.SHORT||h===Te.UNSIGNED_SHORT))&&(p=!0),p},t.create3DFromRaw=({width:h=ge("width"),height:y=ge("height"),depth:p=ge("depth"),numComps:m=ge("numComps"),dataType:d=ge("dataType"),data:x=ge("data"),updatedExtents:T=[]}={})=>{let v=d,C=x;if(!t.updateVolumeInfoForGL(v,m)&&C){let R=h*y*p,D=structuredClone(e.volumeInfo),V=new Float32Array(R*m);e.volumeInfo.offset=D.offset,e.volumeInfo.scale=D.scale;let U=0,B=D.scale.map(_=>1/_);for(let _=0;_<R;_++)for(let N=0;N<m;N++)V[U]=(C[U]-D.offset[N])*B[N],U++;v=Te.FLOAT,C=V}if(t.getOpenGLDataType(v),t.getInternalFormat(v,m),t.getFormat(v,m),!e.internalFormat||!e.format||!e.openGLDataType)return Jr("Failed to determine texture parameters."),!1;e.target=e.context.TEXTURE_3D,e.components=m,e.width=h,e.height=y,e.depth=p,e.numberOfDimensions=3,e._openGLRenderWindow.activateTexture(t),t.createTexture(),t.bind();let O=T.length>0,M=!O||!(0,pu.default)(e._prevTexParams,r()),S=[C],E=t.updateArrayDataTypeForGL(v,S,!0,M?[]:T);if(e.context.pixelStorei(e.context.UNPACK_ALIGNMENT,1),M)c(v)?(e.context.texStorage3D(e.target,1,e.internalFormat,e.width,e.height,e.depth),E[0]!=null&&e.context.texSubImage3D(e.target,0,0,0,0,e.width,e.height,e.depth,e.format,e.openGLDataType,E[0])):e.context.texImage3D(e.target,0,e.internalFormat,e.width,e.height,e.depth,0,e.format,e.openGLDataType,E[0]),e._prevTexParams=r();else if(O){let R=E[0],D=0;for(let V=0;V<T.length;V++){let U=T[V],B=a(U),_=i(U),N=new R.constructor(R.buffer,D,_);D+=N.byteLength,e.context.texSubImage3D(e.target,0,U[0],U[2],U[4],B[0],B[1],B[2],e.format,e.openGLDataType,N)}}return e.generateMipmap&&e.context.generateMipmap(e.target),e.allocatedGPUMemoryInBytes=e.width*e.height*e.depth*e.components*e._openGLRenderWindow.getDefaultTextureByteSize(v,n(),t.useHalfFloat()),t.deactivate(),!0},t.create3DFilterableFromRaw=({width:h=ge("width"),height:y=ge("height"),depth:p=ge("depth"),numComps:m=ge("numComps"),dataType:d=ge("dataType"),data:x=ge("data"),preferSizeOverAccuracy:T=!1,ranges:v=void 0,updatedExtents:C=[]}={})=>t.create3DFilterableFromDataArray({width:h,height:y,depth:p,dataArray:Z.newInstance({numberOfComponents:m,dataType:d,values:x,ranges:v}),preferSizeOverAccuracy:T,updatedExtents:C}),t.create3DFilterableFromDataArray=({width:h=ge("width"),height:y=ge("height"),depth:p=ge("depth"),dataArray:m=ge("dataArray"),preferSizeOverAccuracy:d=!1,updatedExtents:x=[]}={})=>{let{numComps:T,dataType:v,data:C,scaleOffsets:O}=l(m,d),M=[],S=[];for(let E=0;E<T;++E)M[E]=0,S[E]=1;return e.volumeInfo={scale:S,offset:M,dataComputedScale:O.scale,dataComputedOffset:O.offset,width:h,height:y,depth:p},t.create3DFromRaw({width:h,height:y,depth:p,numComps:T,dataType:v,data:C,updatedExtents:x})},t.setOpenGLRenderWindow=h=>{e._openGLRenderWindow!==h&&(t.releaseGraphicsResources(),e._openGLRenderWindow=h,e.context=null,h&&(e.context=e._openGLRenderWindow.getContext()))},t.getMaximumTextureSize=h=>h&&h.isCurrent()?h.getIntegerv(h.MAX_TEXTURE_SIZE):-1,t.enableUseHalfFloat=h=>{e.enableUseHalfFloat=h}}var ky={_openGLRenderWindow:null,_forceInternalFormat:!1,_prevTexParams:null,context:null,handle:0,sendParametersTime:null,textureBuildTime:null,numberOfDimensions:0,target:0,format:0,openGLDataType:0,components:0,width:0,height:0,depth:0,autoParameters:!0,wrapS:er.CLAMP_TO_EDGE,wrapT:er.CLAMP_TO_EDGE,wrapR:er.CLAMP_TO_EDGE,minificationFilter:ke.NEAREST,magnificationFilter:ke.NEAREST,minLOD:-1e3,maxLOD:1e3,baseLevel:0,maxLevel:1e3,generateMipmap:!1,oglNorm16Ext:null,allocatedGPUMemoryInBytes:0,enableUseHalfFloat:!0,canUseHalfFloat:!1};function gu(t,e,r={}){Object.assign(e,ky,r),ve.extend(t,e,r),e.sendParametersTime={},pe(e.sendParametersTime,{mtime:0}),e.textureBuildTime={},pe(e.textureBuildTime,{mtime:0}),wn(t,e,["format","openGLDataType"]),de(t,e,["keyMatrixTime","minificationFilter","magnificationFilter","wrapS","wrapT","wrapR","generateMipmap","oglNorm16Ext"]),Ee(t,e,["width","height","volumeInfo","components","handle","target","allocatedGPUMemoryInBytes"]),or(t,e,["openGLRenderWindow"]),Gy(t,e)}var hu=ue(gu,"vtkOpenGLTexture"),Se={newInstance:hu,extend:gu,...Ws};_e("vtkTexture",hu);var{vtkErrorMacro:by}=w;function zy(t,e){e.classHierarchy.push("vtkShader"),t.compile=()=>{let r=e.context.VERTEX_SHADER;if(!e.source||!e.source.length||e.shaderType==="Unknown")return!1;switch(e.handle!==0&&(e.context.deleteShader(e.handle),e.handle=0),e.shaderType){case"Fragment":r=e.context.FRAGMENT_SHADER;break;default:r=e.context.VERTEX_SHADER}if(e.handle=e.context.createShader(r),e.context.shaderSource(e.handle,e.source),e.context.compileShader(e.handle),!e.context.getShaderParameter(e.handle,e.context.COMPILE_STATUS)){let n=e.context.getShaderInfoLog(e.handle);return by(`Error compiling shader '${e.source}': ${n}`),e.context.deleteShader(e.handle),e.handle=0,!1}return!0},t.cleanup=()=>{e.shaderType==="Unknown"||e.handle===0||(e.context.deleteShader(e.handle),e.handle=0,e.dirty=!0)}}var Wy={shaderType:"Unknown",source:"",error:"",handle:0,dirty:!1,context:null};function vu(t,e,r={}){Object.assign(e,Wy,r),w.obj(t,e),w.setGet(t,e,["shaderType","source","error","handle","context"]),zy(t,e)}var Iy=w.newInstance(vu,"vtkShader"),Ia={newInstance:Iy,extend:vu};var{vtkErrorMacro:Ft}=w;function Hy(t,e,r,n){let a=typeof r=="string"?r:r.join(`
`),i=n===!1?e:new RegExp(e,"g"),s=t.replace(i,a);return{replace:s!==a,result:s}}function jy(t,e){e.classHierarchy.push("vtkShaderProgram"),t.compileShader=()=>e.vertexShader.compile()?e.fragmentShader.compile()?!t.attachShader(e.vertexShader)||!t.attachShader(e.fragmentShader)?(Ft(e.error),0):t.link()?(t.setCompiled(!0),1):(Ft(`Links failed: ${e.error}`),0):(Ft(e.fragmentShader.getSource().split(`
`).map((r,n)=>`${n}: ${r}`).join(`
`)),Ft(e.fragmentShader.getError()),0):(Ft(e.vertexShader.getSource().split(`
`).map((r,n)=>`${n}: ${r}`).join(`
`)),Ft(e.vertexShader.getError()),0),t.cleanup=()=>{e.shaderType==="Unknown"||e.handle===0||(t.release(),e.vertexShaderHandle!==0&&(e.context.detachShader(e.handle,e.vertexShaderHandle),e.vertexShaderHandle=0),e.fragmentShaderHandle!==0&&(e.context.detachShader(e.handle,e.fragmentShaderHandle),e.fragmentShaderHandle=0),e.context.deleteProgram(e.handle),e.handle=0,t.setCompiled(!1))},t.bind=()=>!e.linked&&!t.link()?!1:(e.context.useProgram(e.handle),t.setBound(!0),!0),t.isBound=()=>!!e.bound,t.release=()=>{e.context.useProgram(null),t.setBound(!1)},t.setContext=r=>{e.vertexShader.setContext(r),e.fragmentShader.setContext(r),e.geometryShader.setContext(r)},t.link=()=>e.linked?!0:e.handle===0?(e.error="Program has not been initialized, and/or does not have shaders.",!1):(e.uniformLocs={},e.context.linkProgram(e.handle),e.context.getProgramParameter(e.handle,e.context.LINK_STATUS)?(t.setLinked(!0),e.attributeLocs={},!0):(Ft(`Error linking shader ${e.context.getProgramInfoLog(e.handle)}`),e.context.deleteProgram(e.handle),e.handle=0,e.vertexShaderHandle=0,e.fragmentShaderHandle=0,!1)),t.setUniformMatrix=(r,n)=>{let a=t.findUniform(r);if(a===-1)return e.error=`Could not set uniform ${r} . No such uniform.`,!1;let i=new Float32Array(n);return e.context.uniformMatrix4fv(a,!1,i),!0},t.setUniformMatrix3x3=(r,n)=>{let a=t.findUniform(r);if(a===-1)return e.error=`Could not set uniform ${r} . No such uniform.`,!1;let i=new Float32Array(n);return e.context.uniformMatrix3fv(a,!1,i),!0},t.setUniformf=(r,n)=>{let a=t.findUniform(r);return a===-1?(e.error=`Could not set uniform ${r} . No such uniform.`,!1):(e.context.uniform1f(a,n),!0)},t.setUniformfv=(r,n)=>{let a=t.findUniform(r);return a===-1?(e.error=`Could not set uniform ${r} . No such uniform.`,!1):(e.context.uniform1fv(a,n),!0)},t.setUniformi=(r,n)=>{let a=t.findUniform(r);return a===-1?(e.error=`Could not set uniform ${r} . No such uniform.`,!1):(e.context.uniform1i(a,n),!0)},t.setUniformiv=(r,n)=>{let a=t.findUniform(r);return a===-1?(e.error=`Could not set uniform ${r} . No such uniform.`,!1):(e.context.uniform1iv(a,n),!0)},t.setUniform2f=(r,n,a)=>{let i=t.findUniform(r);if(i===-1)return e.error=`Could not set uniform ${r} . No such uniform.`,!1;if(a===void 0)throw new RangeError("Invalid number of values for array");return e.context.uniform2f(i,n,a),!0},t.setUniform2fv=(r,n)=>{let a=t.findUniform(r);return a===-1?(e.error=`Could not set uniform ${r} . No such uniform.`,!1):(e.context.uniform2fv(a,n),!0)},t.setUniform2i=(r,n,a)=>{let i=t.findUniform(r);if(i===-1)return e.error=`Could not set uniform ${r} . No such uniform.`,!1;if(a===void 0)throw new RangeError("Invalid number of values for array");return e.context.uniform2i(i,n,a),!0},t.setUniform2iv=(r,n)=>{let a=t.findUniform(r);return a===-1?(e.error=`Could not set uniform ${r} . No such uniform.`,!1):(e.context.uniform2iv(a,n),!0)},t.setUniform3f=(r,n,a,i)=>{let s=t.findUniform(r);if(s===-1)return e.error=`Could not set uniform ${r} . No such uniform.`,!1;if(i===void 0)throw new RangeError("Invalid number of values for array");return e.context.uniform3f(s,n,a,i),!0},t.setUniform3fArray=(r,n)=>{let a=t.findUniform(r);if(a===-1)return e.error=`Could not set uniform ${r} . No such uniform.`,!1;if(!Array.isArray(n)||n.length!==3)throw new RangeError("Invalid number of values for array");return e.context.uniform3f(a,n[0],n[1],n[2]),!0},t.setUniform3fv=(r,n)=>{let a=t.findUniform(r);return a===-1?(e.error=`Could not set uniform ${r} . No such uniform.`,!1):(e.context.uniform3fv(a,n),!0)},t.setUniform3i=(r,...n)=>{let a=t.findUniform(r);if(a===-1)return e.error=`Could not set uniform ${r} . No such uniform.`,!1;let i=n;if(i.length===1&&Array.isArray(i[0])&&(i=i[0]),i.length!==3)throw new RangeError("Invalid number of values for array");return e.context.uniform3i(a,i[0],i[1],i[2]),!0},t.setUniform3iv=(r,n)=>{let a=t.findUniform(r);return a===-1?(e.error=`Could not set uniform ${r} . No such uniform.`,!1):(e.context.uniform3iv(a,n),!0)},t.setUniform4f=(r,...n)=>{let a=t.findUniform(r);if(a===-1)return e.error=`Could not set uniform ${r} . No such uniform.`,!1;let i=n;if(i.length===1&&Array.isArray(i[0])&&(i=i[0]),i.length!==4)throw new RangeError("Invalid number of values for array");return e.context.uniform4f(a,i[0],i[1],i[2],i[3]),!0},t.setUniform4fv=(r,n)=>{let a=t.findUniform(r);return a===-1?(e.error=`Could not set uniform ${r} . No such uniform.`,!1):(e.context.uniform4fv(a,n),!0)},t.setUniform4i=(r,...n)=>{let a=t.findUniform(r);if(a===-1)return e.error=`Could not set uniform ${r} . No such uniform.`,!1;let i=n;if(i.length===1&&Array.isArray(i[0])&&(i=i[0]),i.length!==4)throw new RangeError("Invalid number of values for array");return e.context.uniform4i(a,i[0],i[1],i[2],i[3]),!0},t.setUniform4iv=(r,n)=>{let a=t.findUniform(r);return a===-1?(e.error=`Could not set uniform ${r} . No such uniform.`,!1):(e.context.uniform4iv(a,n),!0)},t.findUniform=r=>{if(!r||!e.linked)return-1;let n=e.uniformLocs[r];return n!==void 0?n:(n=e.context.getUniformLocation(e.handle,r),n===null?(e.error=`Uniform ${r} not found in current shader program.`,e.uniformLocs[r]=-1,-1):(e.uniformLocs[r]=n,n))},t.isUniformUsed=r=>{if(!r)return!1;let n=e.uniformLocs[r];return n!==void 0?n!==null:e.linked?(n=e.context.getUniformLocation(e.handle,r),e.uniformLocs[r]=n,n!==null):(Ft("attempt to find uniform when the shader program is not linked"),!1)},t.isAttributeUsed=r=>{if(!r)return!1;if(r in e.attributeLocs)return!0;if(!e.linked)return Ft("attempt to find uniform when the shader program is not linked"),!1;let n=e.context.getAttribLocation(e.handle,r);return n===-1?!1:(e.attributeLocs[r]=n,!0)},t.attachShader=r=>{if(r.getHandle()===0)return e.error="Shader object was not initialized, cannot attach it.",!1;if(r.getShaderType()==="Unknown")return e.error="Shader object is of type Unknown and cannot be used.",!1;if(e.handle===0){let n=e.context.createProgram();if(n===0)return e.error="Could not create shader program.",!1;e.handle=n,e.linked=!1}return r.getShaderType()==="Vertex"&&(e.vertexShaderHandle!==0&&e.context.detachShader(e.handle,e.vertexShaderHandle),e.vertexShaderHandle=r.getHandle()),r.getShaderType()==="Fragment"&&(e.fragmentShaderHandle!==0&&e.context.detachShader(e.handle,e.fragmentShaderHandle),e.fragmentShaderHandle=r.getHandle()),e.context.attachShader(e.handle,r.getHandle()),t.setLinked(!1),!0},t.detachShader=r=>{if(r.getHandle()===0)return e.error="shader object was not initialized, cannot attach it.",!1;if(r.getShaderType()==="Unknown")return e.error="Shader object is of type Unknown and cannot be used.",!1;switch(e.handle===0&&(e.error="This shader program has not been initialized yet."),r.getShaderType()){case"Vertex":return e.vertexShaderHandle!==r.getHandle()?(e.error="The supplied shader was not attached to this program.",!1):(e.context.detachShader(e.handle,r.getHandle()),e.vertexShaderHandle=0,e.linked=!1,!0);case"Fragment":return e.fragmentShaderHandle!==r.getHandle()?(e.error="The supplied shader was not attached to this program.",!1):(e.context.detachShader(e.handle,r.getHandle()),e.fragmentShaderHandle=0,e.linked=!1,!0);default:return!1}},t.setContext=r=>{e.context=r,e.vertexShader.setContext(r),e.fragmentShader.setContext(r),e.geometryShader.setContext(r)},t.setLastCameraMTime=r=>{e.lastCameraMTime=r}}var Py={vertexShaderHandle:0,fragmentShaderHandle:0,geometryShaderHandle:0,vertexShader:null,fragmentShader:null,geometryShader:null,linked:!1,bound:!1,compiled:!1,error:"",handle:0,numberOfOutputs:0,attributesLocs:null,uniformLocs:null,md5Hash:0,context:null,lastCameraMTime:null};function du(t,e,r={}){Object.assign(e,Py,r),e.attributesLocs={},e.uniformLocs={},e.vertexShader=Ia.newInstance(),e.vertexShader.setShaderType("Vertex"),e.fragmentShader=Ia.newInstance(),e.fragmentShader.setShaderType("Fragment"),e.geometryShader=Ia.newInstance(),e.geometryShader.setShaderType("Geometry"),w.obj(t,e),w.get(t,e,["lastCameraMTime"]),w.setGet(t,e,["error","handle","compiled","bound","md5Hash","vertexShader","fragmentShader","geometryShader","linked"]),jy(t,e)}var H={newInstance:w.newInstance(du,"vtkShaderProgram"),extend:du,substitute:Hy};var Ut={ARRAY_BUFFER:0,ELEMENT_ARRAY_BUFFER:1,TEXTURE_BUFFER:2},js={ObjectType:Ut};var{ObjectType:Ha}=js,$y={};function Ay(t,e){e.classHierarchy.push("vtkOpenGLBufferObject");function r(o){switch(o){case Ha.ELEMENT_ARRAY_BUFFER:return e.context.ELEMENT_ARRAY_BUFFER;case Ha.TEXTURE_BUFFER:if("TEXTURE_BUFFER"in e.context)return e.context.TEXTURE_BUFFER;case Ha.ARRAY_BUFFER:default:return e.context.ARRAY_BUFFER}}let n=null,a=null,i=!0,s="";t.getType=()=>n,t.setType=o=>{n=o},t.getHandle=()=>a,t.isReady=()=>i===!1,t.generateBuffer=o=>{let c=r(o);return a===null&&(a=e.context.createBuffer(),n=o),r(n)===c},t.upload=(o,c)=>t.generateBuffer(c)?(e.context.bindBuffer(r(n),a),e.context.bufferData(r(n),o,e.context.STATIC_DRAW),e.allocatedGPUMemoryInBytes=o.length*o.BYTES_PER_ELEMENT,i=!1,!0):(s="Trying to upload array buffer to incompatible buffer.",!1),t.bind=()=>a?(e.context.bindBuffer(r(n),a),!0):!1,t.release=()=>a?(e.context.bindBuffer(r(n),null),!0):!1,t.releaseGraphicsResources=()=>{a!==null&&(e.context.bindBuffer(r(n),null),e.context.deleteBuffer(a),a=null,e.allocatedGPUMemoryInBytes=0)},t.setOpenGLRenderWindow=o=>{e._openGLRenderWindow!==o&&(t.releaseGraphicsResources(),e._openGLRenderWindow=o,e.context=null,o&&(e.context=e._openGLRenderWindow.getContext()))},t.getError=()=>s}var Ky={objectType:Ha.ARRAY_BUFFER,context:null,allocatedGPUMemoryInBytes:0};function Tu(t,e,r={}){Object.assign(e,Ky,r),w.obj(t,e),w.get(t,e,["_openGLRenderWindow","allocatedGPUMemoryInBytes"]),w.moveToProtected(t,e,["openGLRenderWindow"]),Ay(t,e)}var Xy=w.newInstance(Tu),ja={newInstance:Xy,extend:Tu,...$y,...js};function Ps(t){let e=0,r=0;for(let a=0;a<3;++a){let i=t.getRange(a),s=i[1]-i[0];e+=s*s;let o=.5*(i[1]+i[0]);r+=o*o}let n=e>0&&(Math.abs(r)/e>1e6||Math.abs(Math.log10(e))>3||e===0&&r>1e6);if(n){let a=new Float64Array(3),i=new Float64Array(3);for(let s=0;s<3;++s){let o=t.getRange(s),c=o[1]-o[0];a[s]=.5*(o[1]+o[0]),i[s]=c>0?1/c:1}return{useShiftAndScale:n,coordShift:a,coordScale:i}}return{useShiftAndScale:n,coordShift:new Float32Array([0,0,0]),coordScale:new Float32Array([1,1,1])}}function mu(t,e){let r=new Float64Array(3);W.inverse(r,e);let n=new Float64Array(16);return L.fromRotationTranslationScale(n,Me.create(),t,r),n}var{vtkErrorMacro:yu}=w;function Yy(t,e){return t===null||e===null?!1:!(W.exactEquals(t,[0,0,0])&&W.exactEquals(e,[1,1,1]))}function qy(t){return!t.forceFlatten&&!t.haveCellScalars&&!t.haveCellNormals&&!t.useTCoordsPerCell}var $s={anythingToPoints(t,e,r,n,a){for(let i=0;i<t;++i)a(e[r+i],n)},linesToWireframe(t,e,r,n,a){for(let i=0;i<t-1;++i)a(e[r+i],n),a(e[r+i+1],n)},polysToWireframe(t,e,r,n,a){if(t>2)for(let i=0;i<t;++i)a(e[r+i],n),a(e[r+(i+1)%t],n)},stripsToWireframe(t,e,r,n,a){if(t>2){for(let i=0;i<t-1;++i)a(e[r+i],n),a(e[r+i+1],n);for(let i=0;i<t-2;i++)a(e[r+i],n),a(e[r+i+2],n)}},polysToSurface(t,e,r,n,a){for(let i=0;i<t-2;i++)a(e[r],n),a(e[r+i+1],n),a(e[r+i+2],n)},stripsToSurface(t,e,r,n,a){for(let i=0;i<t-2;i++)a(e[r+i],n),a(e[r+i+1+i%2],n),a(e[r+i+1+(i+1)%2],n)}},As={anythingToPoints(t){return t},linesToWireframe(t){return t>1?(t-1)*2:0},polysToWireframe(t){return t>2?t*2:0},stripsToWireframe(t){return t>2?t*4-6:0},polysToSurface(t){return t>2?(t-2)*3:0},stripsToSurface(t){return t>2?(t-2)*3:0}};function Su(t,e){return e===Pe.POINTS||t==="verts"?{build:$s.anythingToPoints,count:As.anythingToPoints}:e===Pe.WIREFRAME||t==="lines"?{build:$s[`${t}ToWireframe`],count:As[`${t}ToWireframe`]}:{build:$s[`${t}ToSurface`],count:As[`${t}ToSurface`]}}function xu(t,e){let r=0;for(let n=0;n<t.length;n+=t[n]+1)r+=e(t[n]);return r}function Cu(t,e,r,n){let a=e;for(let i=0;i<t.length;i+=t[i]+1)r(t[i],t,i+1,a,n),a++;return a}function Zy(t,e,r,n){let a=t.getData(),{build:i,count:s}=Su(e,r),o=xu(a,s),c=n.points.getNumberOfPoints()<=65535?new Uint16Array(o):new Uint32Array(o),f=0;return{indices:c,cellCount:Cu(a,0,i,u=>{c[f++]=u})}}function Qy(t,e){e.classHierarchy.push("vtkOpenGLCellArrayBufferObject"),t.setType(Ut.ARRAY_BUFFER),t.createVBO=(a,i,s,o,c=null)=>{if(!a.getData()||!a.getData().length)return e.elementCount=0,e.indexed=!1,0;e.blockSize=3,e.vertexOffset=0,e.normalOffset=0,e.tCoordOffset=0,e.tCoordComponents=0,e.colorComponents=0,e.colorOffset=0,e.customData=[];let f=o.points.getData(),u=null,g=null,l=null,h=o.colors?o.colors.getNumberOfComponents():0,y=o.tcoords?o.tcoords.getNumberOfComponents():0;o.normals&&(e.normalOffset=4*e.blockSize,e.blockSize+=3,u=o.normals.getData()),o.customAttributes&&o.customAttributes.forEach(k=>{k&&(e.customData.push({data:k.getData(),offset:4*e.blockSize,components:k.getNumberOfComponents(),name:k.getName()}),e.blockSize+=k.getNumberOfComponents())}),o.tcoords&&(e.tCoordOffset=4*e.blockSize,e.tCoordComponents=y,e.blockSize+=y,g=o.tcoords.getData()),o.colors?(e.colorComponents=o.colors.getNumberOfComponents(),e.colorOffset=0,l=o.colors.getData(),e.colorBO||(e.colorBO=ja.newInstance()),e.colorBO.setOpenGLRenderWindow(e._openGLRenderWindow)):e.colorBO=null,e.stride=4*e.blockSize;let p=0,m=0,d=0,x=0,T=0;if(qy(o)){let{indices:k,cellCount:F}=Zy(a,i,s,o);e.indexBO||(e.indexBO=ja.newInstance()),e.indexBO.setOpenGLRenderWindow(e._openGLRenderWindow),e.indexBO.upload(k,Ut.ELEMENT_ARRAY_BUFFER),k instanceof Uint16Array?e.indexElementType=e.context.UNSIGNED_SHORT:e.indexElementType=e.context.UNSIGNED_INT;let G=o.points.getNumberOfPoints(),b=new Float32Array(G*e.blockSize),z=0,{useShiftAndScale:I,coordShift:P,coordScale:Q}=Ps(o.points);I?t.setCoordShiftAndScale(P,Q):e.coordShiftAndScaleEnabled===!0&&t.setCoordShiftAndScale(null,null);for(let $=0;$<G;$++)if(p=$*3,e.coordShiftAndScaleEnabled?(b[z++]=(f[p++]-e.coordShift[0])*e.coordScale[0],b[z++]=(f[p++]-e.coordShift[1])*e.coordScale[1],b[z++]=(f[p++]-e.coordShift[2])*e.coordScale[2]):(b[z++]=f[p++],b[z++]=f[p++],b[z++]=f[p++]),u!==null&&(m=$*3,b[z++]=u[m++],b[z++]=u[m++],b[z++]=u[m++]),e.customData.forEach(J=>{T=$*J.components;for(let Y=0;Y<J.components;++Y)b[z++]=J.data[T++]}),g!==null){d=$*y;for(let J=0;J<y;++J)b[z++]=g[d++]}if(t.upload(b,Ut.ARRAY_BUFFER),e.colorBO){let $=new Uint8Array(G*4),J=0;for(let Y=0;Y<G;Y++)x=Y*h,$[J++]=l[x++],$[J++]=l[x++],$[J++]=l[x++],h===4?$[J++]=l[x++]:$[J++]=255;e.colorBOStride=4,e.colorBO.upload($,Ut.ARRAY_BUFFER)}return e.elementCount=k.length,e.indexed=!0,F}e.indexBO&&e.indexBO.releaseGraphicsResources(),e.indexed=!1,e.indexElementType=null;let v,{build:C,count:O}=Su(i,s),M=a.getData(),S=xu(M,O),E=null,R=new Float32Array(S*e.blockSize);l&&(E=new Uint8Array(S*4));let D=0,V=0,{useShiftAndScale:U,coordShift:B,coordScale:_}=Ps(o.points);if(U?t.setCoordShiftAndScale(B,_):e.coordShiftAndScaleEnabled===!0&&t.setCoordShiftAndScale(null,null),c)if(!c.points&&!c.cells)c.points=new Int32Array(S),c.cells=new Int32Array(S);else{let k=new Int32Array(S+c.points.length);k.set(c.points),c.points=k;let F=new Int32Array(S+c.cells.length);F.set(c.cells),c.cells=F}let N=o.vertexOffset;return v=function(F,G){if(c&&(c.points[N]=F,c.cells[N]=G),++N,p=F*3,e.coordShiftAndScaleEnabled?(R[D++]=(f[p++]-e.coordShift[0])*e.coordScale[0],R[D++]=(f[p++]-e.coordShift[1])*e.coordScale[1],R[D++]=(f[p++]-e.coordShift[2])*e.coordScale[2]):(R[D++]=f[p++],R[D++]=f[p++],R[D++]=f[p++]),u!==null&&(o.haveCellNormals?m=G*3:m=F*3,R[D++]=u[m++],R[D++]=u[m++],R[D++]=u[m++]),e.customData.forEach(b=>{T=F*b.components;for(let z=0;z<b.components;++z)R[D++]=b.data[T++]}),g!==null){o.useTCoordsPerCell?d=G*y:d=F*y;for(let b=0;b<y;++b)R[D++]=g[d++]}l!==null&&(o.haveCellScalars?x=G*h:x=F*h,E[V++]=l[x++],E[V++]=l[x++],E[V++]=l[x++],E[V++]=h===4?l[x++]:255)},Cu(M,o.cellOffset,C,v),e.elementCount=S,t.upload(R,Ut.ARRAY_BUFFER),e.colorBO&&(e.colorBOStride=4,e.colorBO.upload(E,Ut.ARRAY_BUFFER)),a.getNumberOfCells()},t.setCoordShiftAndScale=(a,i)=>{if(a!==null&&(a.constructor!==Float64Array||a.length!==3)){yu("Wrong type for coordShift, expected vec3 or null");return}if(i!==null&&(i.constructor!==Float64Array||i.length!==3)){yu("Wrong type for coordScale, expected vec3 or null");return}(e.coordShift===null||a===null||!W.equals(a,e.coordShift))&&(e.coordShift=a),(e.coordScale===null||i===null||!W.equals(i,e.coordScale))&&(e.coordScale=i),e.coordShiftAndScaleEnabled=Yy(e.coordShift,e.coordScale),e.coordShiftAndScaleEnabled?e.inverseShiftAndScaleMatrix=mu(e.coordShift,e.coordScale):e.inverseShiftAndScaleMatrix=null};let r=t.releaseGraphicsResources;t.releaseGraphicsResources=()=>{r(),e.indexBO&&e.indexBO.releaseGraphicsResources(),e.colorBO&&e.colorBO.releaseGraphicsResources(),e.indexed=!1};let n=t.getAllocatedGPUMemoryInBytes;t.getAllocatedGPUMemoryInBytes=()=>n()+(e.indexBO?e.indexBO.getAllocatedGPUMemoryInBytes():0)+(e.colorBO?e.colorBO.getAllocatedGPUMemoryInBytes():0)}var Jy={elementCount:0,indexed:!1,indexBO:null,indexElementType:null,stride:0,colorBOStride:0,vertexOffset:0,normalOffset:0,tCoordOffset:0,tCoordComponents:0,colorOffset:0,colorComponents:0,tcoordBO:null,customData:[],coordShift:null,coordScale:null,coordShiftAndScaleEnabled:!1,inverseShiftAndScaleMatrix:null};function Ou(t,e,r={}){Object.assign(e,Jy,r),ja.extend(t,e,r),w.setGet(t,e,["colorBO","elementCount","stride","colorBOStride","vertexOffset","normalOffset","tCoordOffset","tCoordComponents","colorOffset","colorComponents","customData","indexed","indexBO","indexElementType"]),w.get(t,e,["coordShift","coordScale","coordShiftAndScaleEnabled","inverseShiftAndScaleMatrix"]),Qy(t,e)}var eS=w.newInstance(Ou),wu={newInstance:eS,extend:Ou};function tS(t,e){e.classHierarchy.push("vtkOpenGLVertexArrayObject"),t.initialize=()=>{e.handleVAO=e.context.createVertexArray()},t.isReady=()=>e.handleVAO!==0,t.bind=()=>{t.isReady()||t.initialize(),e.context.bindVertexArray(e.handleVAO)},t.release=()=>{e.context&&e.context.bindVertexArray(null)},t.shaderProgramChanged=()=>{t.release(),e.handleVAO&&e.context&&e.context.deleteVertexArray(e.handleVAO),e.handleVAO=0,e.handleProgram=0},t.releaseGraphicsResources=()=>{t.shaderProgramChanged(),e.handleVAO&&e.context&&e.context.deleteVertexArray(e.handleVAO),e.handleVAO=0,e.handleProgram=0},t.addAttributeArray=(r,n,a,i,s,o,c,f)=>t.addAttributeArrayWithDivisor(r,n,a,i,s,o,c,f,0,!1),t.addAttributeArrayWithDivisor=(r,n,a,i,s,o,c,f,u,g)=>{if(!r||!r.isBound()||n.getHandle()===0||n.getType()!==Ut.ARRAY_BUFFER||(e.handleProgram===0&&(e.handleProgram=r.getHandle()),t.isReady()||t.initialize(),!t.isReady()||e.handleProgram!==r.getHandle()))return!1;let l=e.context,h=l.getAttribLocation(e.handleProgram,a);return h===-1?!1:(n.bind(),l.enableVertexAttribArray(h),l.vertexAttribPointer(h,c,o,f,s,i),u>0&&l.vertexAttribDivisor(h,1),!0)},t.addAttributeMatrixWithDivisor=(r,n,a,i,s,o,c,f,u)=>{let g=t.addAttributeArrayWithDivisor(r,n,a,i,s,o,c,f,u,!0);if(!g)return g;let l=e.context,h=l.getAttribLocation(e.handleProgram,a);for(let y=1;y<c;y++)l.enableVertexAttribArray(h+y),l.vertexAttribPointer(h+y,c,o,f,s,i+s*y/c),u>0&&l.vertexAttribDivisor(h+y,1);return!0},t.removeAttributeArray=r=>!(!t.isReady()||e.handleProgram===0),t.setOpenGLRenderWindow=r=>{e._openGLRenderWindow!==r&&(t.releaseGraphicsResources(),e._openGLRenderWindow=r,e.context=null,r&&(e.context=e._openGLRenderWindow.getContext()))}}var rS={handleVAO:0,handleProgram:0,context:null};function Ru(t,e,r={}){Object.assign(e,rS,r),w.obj(t,e),tS(t,e)}var nS=w.newInstance(Ru,"vtkOpenGLVertexArrayObject"),en={newInstance:nS,extend:Ru};var ur={Start:0,Points:0,Lines:1,Tris:2,TriStrips:3,TrisEdges:4,TriStripsEdges:5,End:6};function aS(t,e){e.classHierarchy.push("vtkOpenGLHelper"),t.setOpenGLRenderWindow=r=>{e.context=r.getContext(),e.program||(e.program=H.newInstance()),e.program.setContext(e.context),e.VAO.setOpenGLRenderWindow(r),e.CABO.setOpenGLRenderWindow(r)},t.releaseGraphicsResources=r=>{e.VAO.releaseGraphicsResources(),e.CABO.releaseGraphicsResources(),e.CABO.setElementCount(0)},t.drawArrays=(r,n,a,i)=>{if(e.CABO.getElementCount()){let s=t.getOpenGLMode(a),o=t.haveWideLines(r,n),c=e.context,f;e.pointPicking&&(f=c.getParameter(c.DEPTH_WRITEMASK),c.depthMask(!1)),s===c.LINES&&o?(t.updateShaders(r,n,i),e.CABO.getIndexed()?(e.CABO.getIndexBO().bind(),c.drawElementsInstanced(s,e.CABO.getElementCount(),e.CABO.getIndexElementType(),0,2*Math.ceil(n.getProperty().getLineWidth()))):c.drawArraysInstanced(s,0,e.CABO.getElementCount(),2*Math.ceil(n.getProperty().getLineWidth()))):(c.lineWidth(n.getProperty().getLineWidth()),t.updateShaders(r,n,i),e.CABO.getIndexed()?(e.CABO.getIndexBO().bind(),c.drawElements(s,e.CABO.getElementCount(),e.CABO.getIndexElementType(),0)):c.drawArrays(s,0,e.CABO.getElementCount()),c.lineWidth(1));let u=3;return s===c.POINTS?u=1:s===c.LINES&&(u=2),e.pointPicking&&c.depthMask(f),e.CABO.getElementCount()/u}return 0},t.getOpenGLMode=r=>{if(e.pointPicking)return e.context.POINTS;let n=e.primitiveType;return r===Pe.POINTS||n===ur.Points?e.context.POINTS:r===Pe.WIREFRAME||n===ur.Lines||n===ur.TrisEdges||n===ur.TriStripsEdges?e.context.LINES:e.context.TRIANGLES},t.haveWideLines=(r,n)=>n.getProperty().getLineWidth()>1?!(e.CABO.getOpenGLRenderWindow()&&e.CABO.getOpenGLRenderWindow().getHardwareMaximumLineWidth()>=n.getProperty().getLineWidth()):!1,t.getNeedToRebuildShaders=(r,n,a)=>!!(a.getNeedToRebuildShaders(t,r,n)||t.getProgram()===0||t.getShaderSourceTime().getMTime()<a.getMTime()||t.getShaderSourceTime().getMTime()<n.getMTime()),t.updateShaders=(r,n,a)=>{if(t.getNeedToRebuildShaders(r,n,a)){let i={Vertex:null,Fragment:null,Geometry:null};a.buildShaders(i,r,n);let s=e.CABO.getOpenGLRenderWindow().getShaderCache().readyShaderProgramArray(i.Vertex,i.Fragment,i.Geometry);s!==t.getProgram()&&(t.setProgram(s),t.getVAO().releaseGraphicsResources()),t.getShaderSourceTime().modified()}else e.CABO.getOpenGLRenderWindow().getShaderCache().readyShaderProgram(t.getProgram());t.getVAO().bind(),a.setMapperShaderParameters(t,r,n),a.setPropertyShaderParameters(t,r,n),a.setCameraShaderParameters(t,r,n),a.setLightingShaderParameters(t,r,n),a.invokeShaderCallbacks(t,r,n)},t.setMapperShaderParameters=(r,n,a)=>{if(t.haveWideLines(r,n)){t.getProgram().setUniform2f("viewportSize",a.usize,a.vsize);let i=parseFloat(n.getProperty().getLineWidth()),s=i/2;t.getProgram().setUniformf("lineWidthStepSize",i/Math.ceil(i)),t.getProgram().setUniformf("halfLineWidth",s)}e.primitiveType===ur.Points||n.getProperty().getRepresentation()===Pe.POINTS?t.getProgram().setUniformf("pointSize",n.getProperty().getPointSize()):e.pointPicking&&t.getProgram().setUniformf("pointSize",t.getPointPickingPrimitiveSize())},t.replaceShaderPositionVC=(r,n,a)=>{let i=r.Vertex;i=H.substitute(i,"//VTK::PositionVC::Dec",["//VTK::PositionVC::Dec","uniform float pointSize;"]).result,i=H.substitute(i,"//VTK::PositionVC::Impl",["//VTK::PositionVC::Impl","  gl_PointSize = pointSize;"],!1).result,t.getOpenGLMode(a.getProperty().getRepresentation())===e.context.LINES&&t.haveWideLines(n,a)&&(i=H.substitute(i,"//VTK::PositionVC::Dec",["//VTK::PositionVC::Dec","uniform vec2 viewportSize;","uniform float lineWidthStepSize;","uniform float halfLineWidth;"]).result,i=H.substitute(i,"//VTK::PositionVC::Impl",["//VTK::PositionVC::Impl"," if (halfLineWidth > 0.0)","   {","   float offset = float(gl_InstanceID / 2) * lineWidthStepSize - halfLineWidth;","   vec4 tmpPos = gl_Position;","   vec3 tmpPos2 = tmpPos.xyz / tmpPos.w;","   tmpPos2.x = tmpPos2.x + 2.0 * mod(float(gl_InstanceID), 2.0) * offset / viewportSize[0];","   tmpPos2.y = tmpPos2.y + 2.0 * mod(float(gl_InstanceID + 1), 2.0) * offset / viewportSize[1];","   gl_Position = vec4(tmpPos2.xyz * tmpPos.w, tmpPos.w);","   }"]).result),r.Vertex=i},t.getPointPickingPrimitiveSize=()=>e.primitiveType===ur.Points?2:e.primitiveType===ur.Lines?4:6,t.getAllocatedGPUMemoryInBytes=()=>t.getCABO().getAllocatedGPUMemoryInBytes()}var iS={context:null,program:null,shaderSourceTime:null,VAO:null,attributeUpdateTime:null,CABO:null,primitiveType:0,pointPicking:!1};function Eu(t,e,r={}){Object.assign(e,iS,r),w.obj(t,e),e.shaderSourceTime={},w.obj(e.shaderSourceTime),e.attributeUpdateTime={},w.obj(e.attributeUpdateTime),w.setGet(t,e,["program","shaderSourceTime","VAO","attributeUpdateTime","CABO","primitiveType","pointPicking"]),e.program=H.newInstance(),e.VAO=en.newInstance(),e.CABO=wu.newInstance(),aS(t,e)}var sS=w.newInstance(Eu);var Nt={newInstance:sS,extend:Eu,primTypes:ur};var Pa=`//VTK::System::Dec

/*=========================================================================

  Program:   Visualization Toolkit
  Module:    vtkPolyDataVS.glsl

  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
  All rights reserved.
  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.

     This software is distributed WITHOUT ANY WARRANTY; without even
     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
     PURPOSE.  See the above copyright notice for more information.

=========================================================================*/

attribute vec4 vertexMC;

// frag position in VC
//VTK::PositionVC::Dec

// optional normal declaration
//VTK::Normal::Dec

// extra lighting parameters
//VTK::Light::Dec

// Texture coordinates
//VTK::TCoord::Dec

// material property values
//VTK::Color::Dec

// clipping plane vars
//VTK::Clip::Dec

// camera and actor matrix values
//VTK::Camera::Dec

// Apple Bug
//VTK::PrimID::Dec

// picking support
//VTK::Picking::Dec

void main()
{
  //VTK::Color::Impl

  //VTK::Normal::Impl

  //VTK::TCoord::Impl

  //VTK::Clip::Impl

  //VTK::PrimID::Impl

  //VTK::PositionVC::Impl

  //VTK::Light::Impl

  //VTK::Picking::Impl
}
`;var $a=`//VTK::System::Dec

/*=========================================================================

  Program:   Visualization Toolkit
  Module:    vtkPolyDataFS.glsl

  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
  All rights reserved.
  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.

     This software is distributed WITHOUT ANY WARRANTY; without even
     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
     PURPOSE.  See the above copyright notice for more information.

=========================================================================*/
// Template for the polydata mappers fragment shader

uniform int PrimitiveIDOffset;

// VC position of this fragment
//VTK::PositionVC::Dec

// optional color passed in from the vertex shader, vertexColor
//VTK::Color::Dec

// optional surface normal declaration
//VTK::Normal::Dec

// extra lighting parameters
//VTK::Light::Dec

// define vtkImageLabelOutlineOn
//VTK::ImageLabelOutlineOn

// Texture coordinates
//VTK::TCoord::Dec

// picking support
//VTK::Picking::Dec

// Depth Peeling Support
//VTK::DepthPeeling::Dec

// clipping plane vars
//VTK::Clip::Dec

// label outline 
//VTK::LabelOutline::Dec

// the output of this shader
//VTK::Output::Dec

// Apple Bug
//VTK::PrimID::Dec

// handle coincident offsets
//VTK::Coincident::Dec

//VTK::ZBuffer::Dec

//VTK::LabelOutlineHelperFunction

void main()
{
  // VC position of this fragment. This should not branch/return/discard.
  //VTK::PositionVC::Impl

  // Place any calls that require uniform flow (e.g. dFdx) here.
  //VTK::UniformFlow::Impl

  // Set gl_FragDepth here (gl_FragCoord.z by default)
  //VTK::Depth::Impl

  // Early depth peeling abort:
  //VTK::DepthPeeling::PreColor

  // Apple Bug
  //VTK::PrimID::Impl

  //VTK::Clip::Impl

  //VTK::Color::Impl

  // Generate the normal if we are not passed in one
  //VTK::Normal::Impl

  //VTK::TCoord::Impl

  //VTK::Light::Impl

  if (gl_FragData[0].a <= 0.0)
    {
    discard;
    }

  //VTK::DepthPeeling::Impl

  //VTK::Picking::Impl

  // handle coincident offsets
  //VTK::Coincident::Impl

  //VTK::ZBuffer::Impl

  //VTK::RenderPassFragmentShader::Impl
}
`;function oS(t,e,r={}){t.replaceShaderCoincidentOffset=(n,a,i)=>{let s=t.getCoincidentParameters(a,i);if(s&&(s.factor!==0||s.offset!==0)){let o=n.Fragment;o=H.substitute(o,"//VTK::Coincident::Dec",["uniform float cfactor;","uniform float coffset;"]).result,s.factor!==0?(o=H.substitute(o,"//VTK::UniformFlow::Impl",["float cscale = length(vec2(dFdx(gl_FragCoord.z),dFdy(gl_FragCoord.z)));","//VTK::UniformFlow::Impl"],!1).result,o=H.substitute(o,"//VTK::Depth::Impl","gl_FragDepth = gl_FragCoord.z + cfactor*cscale + 0.000016*coffset;").result):o=H.substitute(o,"//VTK::Depth::Impl","gl_FragDepth = gl_FragCoord.z + 0.000016*coffset;").result,n.Fragment=o}}}function cS(t,e,r={}){t.applyShaderReplacements=(n,a,i)=>{let s=null;if(a&&(s=a.ShaderReplacements),s)for(let o=0;o<s.length;o++){let c=s[o];if(i&&c.replaceFirst||!i&&!c.replaceFirst){let f=c.shaderType,u=n[f];n[f]=H.substitute(u,c.originalValue,c.replacementValue,c.replaceAll).result}}},t.buildShaders=(n,a,i)=>{t.getReplacedShaderTemplate(n,a,i),e.lastRenderPassShaderReplacement=e.currentRenderPass?e.currentRenderPass.getShaderReplacement():null,e.lastRenderPassShaderReplacement&&e.lastRenderPassShaderReplacement(n);let s=e.renderable.getViewSpecificProperties().OpenGL;t.applyShaderReplacements(n,s,!0),t.replaceShaderValues(n,a,i),t.applyShaderReplacements(n,s)},t.getReplacedShaderTemplate=(n,a,i)=>{let s=e.renderable.getViewSpecificProperties().OpenGL;t.getShaderTemplate(n,a,i);let o=n.Vertex;if(s){let u=s.VertexShaderCode;u!==void 0&&u!==""&&(o=u)}n.Vertex=o;let c=n.Fragment;if(s){let u=s.FragmentShaderCode;u!==void 0&&u!==""&&(c=u)}n.Fragment=c;let f=n.Geometry;if(s){let u=s.GeometryShaderCode;u!==void 0&&(f=u)}n.Geometry=f}}var Gt={implementReplaceShaderCoincidentOffset:oS,implementBuildShadersWithReplacements:cS};function mt(t,e,r){return t.length>0?`${t.map(n=>n?.getMTime()??"x").join("/")}-${e}-${r}`:"0"}function tn(t,e){return`${e.getMTime()}`}var{vtkErrorMacro:rn}=we,{SlicingMode:ut}=Wa;function fS(t){let e=t.split(`
`),r=[];for(let n=0;n<e.length;++n){let a=e[n].trim();a.length>0&&r.push(a)}return r}function uS(t,e){e.classHierarchy.push("vtkOpenGLImageMapper");function r(n){e.tris.releaseGraphicsResources(n),e.openGLTexture.releaseGraphicsResources(n),[e._defaultColorTexture,e._defaultPwfTexture].forEach(a=>a?.oglObject.releaseGraphicsResources(n)),e._defaultColorTexture=null,e._defaultPwfTexture=null,[e._colorTransferFunc,e._pwFunc,e._labelOutlineThicknessArray,e._labelOutlineOpacity].forEach(a=>n.unregisterGraphicsResourceUser(a,t))}t.buildPass=n=>{if(n){e.currentRenderPass=null,e.openGLImageSlice=t.getFirstAncestorOfType("vtkOpenGLImageSlice"),e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer");let a=e._openGLRenderWindow;e._openGLRenderWindow=e._openGLRenderer.getLastAncestorOfType("vtkOpenGLRenderWindow"),a&&!a.isDeleted()&&a!==e._openGLRenderWindow&&r(a),e.context=e._openGLRenderWindow.getContext(),e.tris.setOpenGLRenderWindow(e._openGLRenderWindow);let i=e._openGLRenderer.getRenderable();e.openGLCamera=e._openGLRenderer.getViewNodeFor(i.getActiveCamera(),e.openGLCamera),e.renderable.isA("vtkImageMapper")&&e.renderable.getSliceAtFocalPoint()&&e.renderable.setSliceFromCamera(i.getActiveCamera())}},t.translucentPass=(n,a)=>{n&&(e.currentRenderPass=a,t.render())},t.zBufferPass=n=>{n&&(e.haveSeenDepthRequest=!0,e.renderDepth=!0,t.render(),e.renderDepth=!1)},t.opaqueZBufferPass=n=>t.zBufferPass(n),t.opaquePass=n=>{n&&t.render()},t.getCoincidentParameters=(n,a)=>e.renderable.getResolveCoincidentTopology()==$e.PolygonOffset?e.renderable.getCoincidentTopologyPolygonOffsetParameters():null,t.render=()=>{let n=e.openGLImageSlice.getRenderable(),a=e._openGLRenderer.getRenderable();t.renderPiece(a,n)},t.getShaderTemplate=(n,a,i)=>{n.Vertex=Pa,n.Fragment=$a,n.Geometry=""},t.replaceShaderValues=(n,a,i)=>{let s=n.Vertex,o=n.Fragment;s=H.substitute(s,"//VTK::Camera::Dec",["uniform mat4 MCPCMatrix;"]).result,s=H.substitute(s,"//VTK::PositionVC::Impl",["  gl_Position = MCPCMatrix * vertexMC;"]).result,s=H.substitute(s,"//VTK::TCoord::Impl","tcoordVCVSOutput = tcoordMC;").result,s=H.substitute(s,"//VTK::TCoord::Dec","attribute vec2 tcoordMC; varying vec2 tcoordVCVSOutput;").result;let c=e.openGLTexture.getComponents(),f=i.getProperty().getIndependentComponents(),u=["varying vec2 tcoordVCVSOutput;","uniform float cshift0;","uniform float cscale0;","uniform float pwfshift0;","uniform float pwfscale0;","uniform sampler2D texture1;","uniform sampler2D colorTexture1;","uniform sampler2D pwfTexture1;","uniform float opacity;"];if(i.getProperty().getUseLabelOutline()&&(u=u.concat(["uniform sampler2D labelOutlineTexture1;","uniform sampler2D labelOutlineOpacityTexture1;"])),f){for(let g=1;g<c;g++)u=u.concat([`uniform float cshift${g};`,`uniform float cscale${g};`,`uniform float pwfshift${g};`,`uniform float pwfscale${g};`]);switch(c){case 1:u=u.concat(["uniform float mix0;","#define height0 0.5"]);break;case 2:u=u.concat(["uniform float mix0;","uniform float mix1;","#define height0 0.25","#define height1 0.75"]);break;case 3:u=u.concat(["uniform float mix0;","uniform float mix1;","uniform float mix2;","#define height0 0.17","#define height1 0.5","#define height2 0.83"]);break;case 4:u=u.concat(["uniform float mix0;","uniform float mix1;","uniform float mix2;","uniform float mix3;","#define height0 0.125","#define height1 0.375","#define height2 0.625","#define height3 0.875"]);break;default:rn("Unsupported number of independent coordinates.")}}if(o=H.substitute(o,"//VTK::TCoord::Dec",u).result,i.getProperty().getUseLabelOutline()===!0&&(o=H.substitute(o,"//VTK::LabelOutline::Dec",["uniform float vpWidth;","uniform float vpHeight;","uniform float vpOffsetX;","uniform float vpOffsetY;","uniform mat4 PCWCMatrix;","uniform mat4 vWCtoIDX;","uniform ivec3 imageDimensions;","uniform int sliceAxis;"]).result,o=H.substitute(o,"//VTK::ImageLabelOutlineOn","#define vtkImageLabelOutlineOn").result,o=H.substitute(o,"//VTK::LabelOutlineHelperFunction",["#ifdef vtkImageLabelOutlineOn","vec3 fragCoordToIndexSpace(vec4 fragCoord) {","  vec4 pcPos = vec4(","    (fragCoord.x / vpWidth - vpOffsetX - 0.5) * 2.0,","    (fragCoord.y / vpHeight - vpOffsetY - 0.5) * 2.0,","    (fragCoord.z - 0.5) * 2.0,","    1.0);","","  vec4 worldCoord = PCWCMatrix * pcPos;","  vec4 vertex = (worldCoord/worldCoord.w);","","  vec3 index = (vWCtoIDX * vertex).xyz;","","  // half voxel fix for labelmapOutline","  return (index + vec3(0.5)) / vec3(imageDimensions);","}","vec2 getSliceCoords(vec3 coord, int axis) {","  if (axis == 0) return coord.yz;","  if (axis == 1) return coord.xz;","  if (axis == 2) return coord.xy;","}","#endif"]).result),f){let g=["r","g","b","a"],l=["vec4 tvalue = texture2D(texture1, tcoordVCVSOutput);"];for(let h=0;h<c;h++)l=l.concat([`vec3 tcolor${h} = mix${h} * texture2D(colorTexture1, vec2(tvalue.${g[h]} * cscale${h} + cshift${h}, height${h})).rgb;`,`float compWeight${h} = mix${h} * texture2D(pwfTexture1, vec2(tvalue.${g[h]} * pwfscale${h} + pwfshift${h}, height${h})).r;`]);switch(c){case 1:l=l.concat(["gl_FragData[0] = vec4(tcolor0.rgb, opacity);"]);break;case 2:l=l.concat(["float weightSum = compWeight0 + compWeight1;","gl_FragData[0] = vec4(vec3((tcolor0.rgb * (compWeight0 / weightSum)) + (tcolor1.rgb * (compWeight1 / weightSum))), opacity);"]);break;case 3:l=l.concat(["float weightSum = compWeight0 + compWeight1 + compWeight2;","gl_FragData[0] = vec4(vec3((tcolor0.rgb * (compWeight0 / weightSum)) + (tcolor1.rgb * (compWeight1 / weightSum)) + (tcolor2.rgb * (compWeight2 / weightSum))), opacity);"]);break;case 4:l=l.concat(["float weightSum = compWeight0 + compWeight1 + compWeight2 + compWeight3;","gl_FragData[0] = vec4(vec3((tcolor0.rgb * (compWeight0 / weightSum)) + (tcolor1.rgb * (compWeight1 / weightSum)) + (tcolor2.rgb * (compWeight2 / weightSum)) + (tcolor3.rgb * (compWeight3 / weightSum))), opacity);"]);break;default:rn("Unsupported number of independent coordinates.")}o=H.substitute(o,"//VTK::TCoord::Impl",l).result}else switch(c){case 1:o=H.substitute(o,"//VTK::TCoord::Impl",[...fS(`
                #ifdef vtkImageLabelOutlineOn
                  vec3 centerPosIS = fragCoordToIndexSpace(gl_FragCoord);
                  float centerValue = texture2D(texture1, getSliceCoords(centerPosIS, sliceAxis)).r;
                  bool pixelOnBorder = false;
                  vec3 tColor = texture2D(colorTexture1, vec2(centerValue * cscale0 + cshift0, 0.5)).rgb;
                  float scalarOpacity = texture2D(pwfTexture1, vec2(centerValue * pwfscale0 + pwfshift0, 0.5)).r;
                  float opacityToUse = scalarOpacity * opacity;
                  int segmentIndex = int(centerValue * 255.0);
                  float textureCoordinate = float(segmentIndex - 1) / 1024.0;
                  float textureValue = texture2D(labelOutlineTexture1, vec2(textureCoordinate, 0.5)).r;
                  float outlineOpacity = texture2D(labelOutlineOpacityTexture1, vec2(textureCoordinate, 0.5)).r;
                  int actualThickness = int(textureValue * 255.0);

                  if (segmentIndex == 0){
                    gl_FragData[0] = vec4(0.0, 0.0, 0.0, 0.0);
                    return;
                  }

                  for (int i = -actualThickness; i <= actualThickness; i++) {
                    for (int j = -actualThickness; j <= actualThickness; j++) {
                      if (i == 0 && j == 0) {
                        continue;
                      }
                      vec4 neighborPixelCoord = vec4(gl_FragCoord.x + float(i),
                        gl_FragCoord.y + float(j),
                        gl_FragCoord.z, gl_FragCoord.w);
                      vec3 neighborPosIS = fragCoordToIndexSpace(neighborPixelCoord);
                      float value = texture2D(texture1, getSliceCoords(neighborPosIS, sliceAxis)).r;
                      if (value != centerValue) {
                        pixelOnBorder = true;
                        break;
                      }
                    }
                    if (pixelOnBorder == true) {
                      break;
                    }
                  }
                  if (pixelOnBorder == true) {
                    gl_FragData[0] = vec4(tColor, outlineOpacity);
                  }
                  else {
                    gl_FragData[0] = vec4(tColor, opacityToUse);
                  }
                #else
                  float intensity = texture2D(texture1, tcoordVCVSOutput).r;
                  vec3 tcolor = texture2D(colorTexture1, vec2(intensity * cscale0 + cshift0, 0.5)).rgb;
                  float scalarOpacity = texture2D(pwfTexture1, vec2(intensity * pwfscale0 + pwfshift0, 0.5)).r;
                  gl_FragData[0] = vec4(tcolor, scalarOpacity * opacity);
                #endif
                `)]).result;break;case 2:o=H.substitute(o,"//VTK::TCoord::Impl",["vec4 tcolor = texture2D(texture1, tcoordVCVSOutput);","float intensity = tcolor.r*cscale0 + cshift0;","gl_FragData[0] = vec4(texture2D(colorTexture1, vec2(intensity, 0.5)).rgb, pwfscale0*tcolor.g + pwfshift0);"]).result;break;case 3:o=H.substitute(o,"//VTK::TCoord::Impl",["vec4 tcolor = cscale0*texture2D(texture1, tcoordVCVSOutput.st) + cshift0;","gl_FragData[0] = vec4(texture2D(colorTexture1, vec2(tcolor.r,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.g,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.b,0.5)).r, opacity);"]).result;break;default:o=H.substitute(o,"//VTK::TCoord::Impl",["vec4 tcolor = cscale0*texture2D(texture1, tcoordVCVSOutput.st) + cshift0;","gl_FragData[0] = vec4(texture2D(colorTexture1, vec2(tcolor.r,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.g,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.b,0.5)).r, tcolor.a);"]).result}e.haveSeenDepthRequest&&(o=H.substitute(o,"//VTK::ZBuffer::Dec","uniform int depthRequest;").result,o=H.substitute(o,"//VTK::ZBuffer::Impl",["if (depthRequest == 1) {","float iz = floor(gl_FragCoord.z*65535.0 + 0.1);","float rf = floor(iz/256.0)/255.0;","float gf = mod(iz,256.0)/255.0;","gl_FragData[0] = vec4(rf, gf, 0.0, 1.0); }"]).result),n.Vertex=s,n.Fragment=o,t.replaceShaderClip(n,a,i),t.replaceShaderCoincidentOffset(n,a,i)},t.replaceShaderClip=(n,a,i)=>{let s=n.Vertex,o=n.Fragment;if(e.renderable.getNumberOfClippingPlanes()){let c=e.renderable.getNumberOfClippingPlanes();c>6&&(le("OpenGL has a limit of 6 clipping planes"),c=6),s=H.substitute(s,"//VTK::Clip::Dec",["uniform int numClipPlanes;","uniform vec4 clipPlanes[6];","varying float clipDistancesVSOutput[6];"]).result,s=H.substitute(s,"//VTK::Clip::Impl",["for (int planeNum = 0; planeNum < 6; planeNum++)","    {","    if (planeNum >= numClipPlanes)","        {","        break;","        }","    clipDistancesVSOutput[planeNum] = dot(clipPlanes[planeNum], vertexMC);","    }"]).result,o=H.substitute(o,"//VTK::Clip::Dec",["uniform int numClipPlanes;","varying float clipDistancesVSOutput[6];"]).result,o=H.substitute(o,"//VTK::Clip::Impl",["for (int planeNum = 0; planeNum < 6; planeNum++)","    {","    if (planeNum >= numClipPlanes)","        {","        break;","        }","    if (clipDistancesVSOutput[planeNum] < 0.0) discard;","    }"]).result}n.Vertex=s,n.Fragment=o},t.getNeedToRebuildShaders=(n,a,i)=>{let s=e.openGLTexture.getComponents(),o=i.getProperty().getIndependentComponents(),c=!1;return(!e.currentRenderPass&&e.lastRenderPassShaderReplacement||e.currentRenderPass&&e.currentRenderPass.getShaderReplacement()!==e.lastRenderPassShaderReplacement)&&(c=!0),c||e.lastHaveSeenDepthRequest!==e.haveSeenDepthRequest||n.getProgram()?.getHandle()===0||n.getShaderSourceTime().getMTime()<e.renderable.getMTime()||n.getShaderSourceTime().getMTime()<e.currentInput.getMTime()||n.getShaderSourceTime().getMTime()<i.getProperty().getMTime()||e.lastTextureComponents!==s||e.lastIndependentComponents!==o?(e.lastHaveSeenDepthRequest=e.haveSeenDepthRequest,e.lastTextureComponents=s,e.lastIndependentComponents=o,!0):!1},t.updateShaders=(n,a,i)=>{if(e.lastBoundBO=n,t.getNeedToRebuildShaders(n,a,i)){let s={Vertex:null,Fragment:null,Geometry:null};t.buildShaders(s,a,i);let o=e._openGLRenderWindow.getShaderCache().readyShaderProgramArray(s.Vertex,s.Fragment,s.Geometry);o!==n.getProgram()&&(n.setProgram(o),n.getVAO().releaseGraphicsResources()),n.getShaderSourceTime().modified()}else e._openGLRenderWindow.getShaderCache().readyShaderProgram(n.getProgram());n.getVAO().bind(),t.setMapperShaderParameters(n,a,i),t.setCameraShaderParameters(n,a,i),t.setPropertyShaderParameters(n,a,i)},t.setMapperShaderParameters=(n,a,i)=>{n.getCABO().getElementCount()&&(e.VBOBuildTime>n.getAttributeUpdateTime().getMTime()||n.getShaderSourceTime().getMTime()>n.getAttributeUpdateTime().getMTime())&&(n.getProgram().isAttributeUsed("vertexMC")&&(n.getVAO().addAttributeArray(n.getProgram(),n.getCABO(),"vertexMC",n.getCABO().getVertexOffset(),n.getCABO().getStride(),e.context.FLOAT,3,e.context.FALSE)||rn("Error setting vertexMC in shader VAO.")),n.getProgram().isAttributeUsed("tcoordMC")&&n.getCABO().getTCoordOffset()&&(n.getVAO().addAttributeArray(n.getProgram(),n.getCABO(),"tcoordMC",n.getCABO().getTCoordOffset(),n.getCABO().getStride(),e.context.FLOAT,n.getCABO().getTCoordComponents(),e.context.FALSE)||rn("Error setting tcoordMC in shader VAO.")),n.getAttributeUpdateTime().modified());let s=e.openGLTexture.getTextureUnit();n.getProgram().setUniformi("texture1",s);let o=e.openGLTexture.getComponents(),c=i.getProperty().getIndependentComponents();if(c)for(let l=0;l<o;l++)n.getProgram().setUniformf(`mix${l}`,i.getProperty().getComponentWeight(l));let f=e.openGLTexture.getShiftAndScale();for(let l=0;l<o;l++){let h=i.getProperty().getColorWindow(),y=i.getProperty().getColorLevel(),p=c?l:0,m=i.getProperty().getRGBTransferFunction(p);if(m&&i.getProperty().getUseLookupTableScalarRange()){let T=m.getRange();h=T[1]-T[0],y=.5*(T[1]+T[0])}let d=f.scale/h,x=(f.shift-y)/h+.5;n.getProgram().setUniformf(`cshift${l}`,x),n.getProgram().setUniformf(`cscale${l}`,d)}for(let l=0;l<o;l++){let h=1,y=0,p=c?l:0,m=i.getProperty().getPiecewiseFunction(p);if(m){let d=m.getRange(),x=d[1]-d[0],T=.5*(d[0]+d[1]);h=f.scale/x,y=(f.shift-T)/x+.5}n.getProgram().setUniformf(`pwfshift${l}`,y),n.getProgram().setUniformf(`pwfscale${l}`,h)}if(e.haveSeenDepthRequest&&n.getProgram().setUniformi("depthRequest",e.renderDepth?1:0),n.getProgram().isUniformUsed("coffset")){let l=t.getCoincidentParameters(a,i);n.getProgram().setUniformf("coffset",l.offset),n.getProgram().isUniformUsed("cfactor")&&n.getProgram().setUniformf("cfactor",l.factor)}let u=e.colorTexture.getTextureUnit();n.getProgram().setUniformi("colorTexture1",u);let g=e.pwfTexture.getTextureUnit();if(n.getProgram().setUniformi("pwfTexture1",g),i.getProperty().getUseLabelOutline()){let l=e.labelOutlineThicknessTexture.getTextureUnit();n.getProgram().setUniformi("labelOutlineTexture1",l);let h=e.labelOutlineOpacityTexture.getTextureUnit();n.getProgram().setUniformi("labelOutlineOpacityTexture1",h)}if(e.renderable.getNumberOfClippingPlanes()){let l=e.renderable.getNumberOfClippingPlanes();l>6&&(le("OpenGL has a limit of 6 clipping planes"),l=6);let h=n.getCABO().getCoordShiftAndScaleEnabled()?n.getCABO().getInverseShiftAndScaleMatrix():null,y=h?L.copy(e.imagematinv,i.getMatrix()):i.getMatrix();h&&(L.transpose(y,y),L.multiply(y,y,h),L.transpose(y,y)),L.transpose(e.imagemat,e.currentInput.getIndexToWorld()),L.multiply(e.imagematinv,y,e.imagemat);let p=[];for(let m=0;m<l;m++){let d=[];e.renderable.getClippingPlaneInDataCoords(e.imagematinv,m,d);for(let x=0;x<4;x++)p.push(d[x])}n.getProgram().setUniformi("numClipPlanes",l),n.getProgram().setUniform4fv("clipPlanes",p)}},t.setCameraShaderParameters=(n,a,i)=>{let s=n.getProgram(),o=e.openGLImageSlice.getKeyMatrices(),c=e.currentInput,f=c.getIndexToWorld();L.multiply(e.imagemat,o.mcwc,f);let u=e.openGLCamera.getKeyMatrices(a);if(L.multiply(e.imagemat,u.wcpc,e.imagemat),n.getCABO().getCoordShiftAndScaleEnabled()){let g=n.getCABO().getInverseShiftAndScaleMatrix();L.multiply(e.imagemat,e.imagemat,g)}if(s.setUniformMatrix("MCPCMatrix",e.imagemat),i.getProperty().getUseLabelOutline()===!0){let g=c.getWorldToIndex(),l=c.getDimensions(),h=e.renderable.getClosestIJKAxis().ijkMode;h===ut.NONE&&(h=ut.K),s.setUniform3i("imageDimensions",l[0],l[1],l[2]),s.setUniformi("sliceAxis",h),s.setUniformMatrix("vWCtoIDX",g);let y=e.openGLCamera.getKeyMatrices(a);L.invert(e.projectionToWorld,y.wcpc),e.openGLCamera.getKeyMatrices(a),s.setUniformMatrix("PCWCMatrix",e.projectionToWorld);let p=t.getRenderTargetSize();s.setUniformf("vpWidth",p[0]),s.setUniformf("vpHeight",p[1]);let m=t.getRenderTargetOffset();s.setUniformf("vpOffsetX",m[0]/p[0]),s.setUniformf("vpOffsetY",m[1]/p[1])}},t.setPropertyShaderParameters=(n,a,i)=>{let s=n.getProgram(),o=i.getProperty().getOpacity();s.setUniformf("opacity",o)},t.renderPieceStart=(n,a)=>{t.updateBufferObjects(n,a),e.lastBoundBO=null},t.renderPieceDraw=(n,a)=>{let i=e.context;e.openGLTexture.activate(),e.colorTexture.activate(),a.getProperty().getUseLabelOutline()&&(e.labelOutlineThicknessTexture.activate(),e.labelOutlineOpacityTexture.activate()),e.pwfTexture.activate(),e.tris.getCABO().getElementCount()&&(t.updateShaders(e.tris,n,a),i.drawArrays(i.TRIANGLES,0,e.tris.getCABO().getElementCount()),e.tris.getVAO().release()),e.openGLTexture.deactivate(),e.colorTexture.deactivate(),a.getProperty().getUseLabelOutline()&&(e.labelOutlineThicknessTexture.deactivate(),e.labelOutlineOpacityTexture.deactivate()),e.pwfTexture.deactivate()},t.renderPieceFinish=(n,a)=>{},t.renderPiece=(n,a)=>{if(t.invokeEvent({type:"StartEvent"}),e.renderable.update(),e.currentInput=e.renderable.getCurrentImage(),t.invokeEvent({type:"EndEvent"}),!e.currentInput){rn("No input!");return}t.renderPieceStart(n,a),t.renderPieceDraw(n,a),t.renderPieceFinish(n,a)},t.updateBufferObjects=(n,a)=>{t.getNeedToRebuildBufferObjects(n,a)&&t.buildBufferObjects(n,a)},t.getNeedToRebuildBufferObjects=(n,a)=>e.VBOBuildTime.getMTime()<t.getMTime()||e.VBOBuildTime.getMTime()<a.getMTime()||e.VBOBuildTime.getMTime()<e.renderable.getMTime()||e.VBOBuildTime.getMTime()<a.getProperty().getMTime()||e.VBOBuildTime.getMTime()<e.currentInput.getMTime()||!e.openGLTexture?.getHandle()||!e.colorTexture?.getHandle()||a.getProperty().getUseLabelOutline()&&(!e.labelOutlineThicknessTexture?.getHandle()||!e.labelOutlineOpacityTexture?.getHandle())||!e.pwfTexture?.getHandle(),t.buildBufferObjects=(n,a)=>{let i=e.currentInput;if(!i)return;let s=i.getPointData()&&i.getPointData().getScalars();if(!s)return;let o=s.getDataType(),c=s.getNumberOfComponents(),f=a.getProperty(),u=f.getInterpolationType(),g=f.getIndependentComponents(),l=g?c:1,h=g?2*l:1,y=[];for(let N=0;N<l;++N)y.push(f.getRGBTransferFunction(N));let p=mt(y,g,l),m=f.getRGBTransferFunction(),d=e.renderable.getColorTextureWidth();d<=0&&(d=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));let x=m?p:`default-${d}-${u}`,T=m?e._openGLRenderWindow.getGraphicsResourceForObject(m):e._defaultColorTexture;if(!T?.oglObject?.getHandle()||T?.hash!==x){e.colorTexture=Se.newInstance({resizable:!0}),e.colorTexture.setOpenGLRenderWindow(e._openGLRenderWindow);let N=d*h*3,k=new Uint8ClampedArray(N);if(u===Qe.NEAREST?(e.colorTexture.setMinificationFilter(X.NEAREST),e.colorTexture.setMagnificationFilter(X.NEAREST)):(e.colorTexture.setMinificationFilter(X.LINEAR),e.colorTexture.setMagnificationFilter(X.LINEAR)),m){let F=new Float32Array(d*3);for(let G=0;G<l;G++){let b=f.getRGBTransferFunction(G),z=b.getRange();if(b.getTable(z[0],z[1],d,F,1),g)for(let I=0;I<d*3;I++)k[G*d*6+I]=255*F[I],k[G*d*6+I+d*3]=255*F[I];else for(let I=0;I<d*3;I++)k[G*d*6+I]=255*F[I]}e.colorTexture.resetFormatAndType(),e.colorTexture.create2DFromRaw({width:d,height:h,numComps:3,dataType:re.UNSIGNED_CHAR,data:k})}else{for(let F=0;F<d*3;++F)k[F]=255*F/((d-1)*3),k[F+1]=255*F/((d-1)*3),k[F+2]=255*F/((d-1)*3);e.colorTexture.create2DFromRaw({width:d,height:1,numComps:3,dataType:re.UNSIGNED_CHAR,data:k})}m?(e._openGLRenderWindow.setGraphicsResourceForObject(m,e.colorTexture,p),m!==e._colorTransferFunc&&(e._openGLRenderWindow.registerGraphicsResourceUser(m,t),e._openGLRenderWindow.unregisterGraphicsResourceUser(e._colorTransferFunc,t)),e._colorTransferFunc=m):(e._defaultColorTexture?.oglObject.releaseGraphicsResources(e._openGLRenderWindow),e._defaultColorTexture={oglObject:e.colorTexture,hash:x})}else e.colorTexture=T.oglObject;let v=[];for(let N=0;N<l;++N)v.push(f.getPiecewiseFunction(N));let C=mt(v,g,l),O=f.getPiecewiseFunction(),M=e.renderable.getOpacityTextureWidth();M<=0&&(M=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));let S=O?C:`default-${M}-${u}`,E=O?e._openGLRenderWindow.getGraphicsResourceForObject(O):e._defaultPwfTexture;if(!E?.oglObject?.getHandle()||E?.hash!==S){let N=M*h,k=new Uint8ClampedArray(N);if(e.pwfTexture=Se.newInstance({resizable:!0}),e.pwfTexture.setOpenGLRenderWindow(e._openGLRenderWindow),u===Qe.NEAREST?(e.pwfTexture.setMinificationFilter(X.NEAREST),e.pwfTexture.setMagnificationFilter(X.NEAREST)):(e.pwfTexture.setMinificationFilter(X.LINEAR),e.pwfTexture.setMagnificationFilter(X.LINEAR)),O){let F=new Float32Array(N),G=new Float32Array(M);for(let b=0;b<l;++b){let z=f.getPiecewiseFunction(b);if(z===null)F.fill(1);else{let I=z.getRange();if(z.getTable(I[0],I[1],M,G,1),g)for(let P=0;P<M;P++)F[b*M*2+P]=G[P],F[b*M*2+P+M]=G[P];else for(let P=0;P<M;P++)F[b*M*2+P]=G[P]}}e.pwfTexture.resetFormatAndType(),e.pwfTexture.create2DFromRaw({width:M,height:h,numComps:1,dataType:re.FLOAT,data:F})}else k.fill(255),e.pwfTexture.create2DFromRaw({width:M,height:1,numComps:1,dataType:re.UNSIGNED_CHAR,data:k});O?(e._openGLRenderWindow.setGraphicsResourceForObject(O,e.pwfTexture,C),O!==e._pwFunc&&(e._openGLRenderWindow.registerGraphicsResourceUser(O,t),e._openGLRenderWindow.unregisterGraphicsResourceUser(e._pwFunc,t)),e._pwFunc=O):(e._defaultPwfTexture?.oglObject.releaseGraphicsResources(e._openGLRenderWindow),e._defaultPwfTexture={oglObject:e.pwfTexture,hash:S})}else e.pwfTexture=E.oglObject;a.getProperty().getUseLabelOutline()&&(t.updatelabelOutlineThicknessTexture(a),t.updateLabelOutlineOpacityTexture(a));let{ijkMode:R}=e.renderable.getClosestIJKAxis(),D=e.renderable.getSlice();R!==e.renderable.getSlicingMode()&&(D=e.renderable.getSliceAtPosition(D));let V=e.renderable.isA("vtkImageArrayMapper")?e.renderable.getSubSlice():Math.round(D),U=i.getExtent(),B;R===ut.I&&(B=V-U[0]),R===ut.J&&(B=V-U[2]),(R===ut.K||R===ut.NONE)&&(B=V-U[4]);let _=`${D}A${i.getMTime()}A${s.getMTime()}B${t.getMTime()}C${e.renderable.getSlicingMode()}D${a.getProperty().getInterpolationType()}`;if(e.VBOBuildString!==_){let N=i.getDimensions();e.openGLTexture||(e.openGLTexture=Se.newInstance({resizable:!0})),e.openGLTexture.setOpenGLRenderWindow(e._openGLRenderWindow),e.openGLTexture.setOglNorm16Ext(e.context.getExtension("EXT_texture_norm16")),u===Qe.NEAREST?(new Set([1,3,4]).has(c)&&o===re.UNSIGNED_CHAR&&!g?(e.openGLTexture.setGenerateMipmap(!0),e.openGLTexture.setMinificationFilter(X.NEAREST)):e.openGLTexture.setMinificationFilter(X.NEAREST),e.openGLTexture.setMagnificationFilter(X.NEAREST)):(c===4&&o===re.UNSIGNED_CHAR&&!g?(e.openGLTexture.setGenerateMipmap(!0),e.openGLTexture.setMinificationFilter(X.LINEAR_MIPMAP_LINEAR)):e.openGLTexture.setMinificationFilter(X.LINEAR),e.openGLTexture.setMagnificationFilter(X.LINEAR)),e.openGLTexture.setWrapS(Br.CLAMP_TO_EDGE),e.openGLTexture.setWrapT(Br.CLAMP_TO_EDGE);let k=N[0]*N[1]*c,F=new Float32Array(12),G=new Float32Array(8);for(let A=0;A<4;A++)G[A*2]=A%2?1:0,G[A*2+1]=A>1?1:0;let b=[ut.X,ut.Y,ut.Z].includes(e.renderable.getSlicingMode())?D:V,z=i.getSpatialExtent(),I=s.getData(),P=null;if(R===ut.I){P=new I.constructor(N[2]*N[1]*c);let A=0;for(let se=0;se<N[2];se++)for(let ae=0;ae<N[1];ae++){let ce=(B+ae*N[0]+se*N[0]*N[1])*c;A=(se*N[1]+ae)*c;let ie=ce+c;for(;ce<ie;)P[A++]=I[ce++]}N[0]=N[1],N[1]=N[2],F[0]=b,F[1]=z[2],F[2]=z[4],F[3]=b,F[4]=z[3],F[5]=z[4],F[6]=b,F[7]=z[2],F[8]=z[5],F[9]=b,F[10]=z[3],F[11]=z[5]}else if(R===ut.J){P=new I.constructor(N[2]*N[0]*c);let A=0;for(let se=0;se<N[2];se++)for(let ae=0;ae<N[0];ae++){let ce=(ae+B*N[0]+se*N[0]*N[1])*c;A=(se*N[0]+ae)*c;let ie=ce+c;for(;ce<ie;)P[A++]=I[ce++]}N[1]=N[2],F[0]=z[0],F[1]=b,F[2]=z[4],F[3]=z[1],F[4]=b,F[5]=z[4],F[6]=z[0],F[7]=b,F[8]=z[5],F[9]=z[1],F[10]=b,F[11]=z[5]}else R===ut.K||R===ut.NONE?(P=I.subarray(B*k,(B+1)*k),F[0]=z[0],F[1]=z[2],F[2]=b,F[3]=z[1],F[4]=z[2],F[5]=b,F[6]=z[0],F[7]=z[3],F[8]=b,F[9]=z[1],F[10]=z[3],F[11]=b):rn("Reformat slicing not yet supported.");let Q=s.getRanges();e.openGLTexture.resetFormatAndType(),e.openGLTexture.create2DFilterableFromRaw({width:N[0],height:N[1],numComps:c,dataType:s.getDataType(),data:P,preferSizeOverAccuracy:!!e.renderable.getPreferSizeOverAccuracy?.(),ranges:Q}),e.openGLTexture.activate(),e.openGLTexture.sendParameters(),e.openGLTexture.deactivate();let $=Z.newInstance({numberOfComponents:3,values:F});$.setName("points");let J=Z.newInstance({numberOfComponents:2,values:G});J.setName("tcoords");let Y=new Uint16Array(8);Y[0]=3,Y[1]=0,Y[2]=1,Y[3]=3,Y[4]=3,Y[5]=0,Y[6]=3,Y[7]=2;let j=je.newInstance({values:Y});e.tris.getCABO().createVBO(j,"polys",Pe.SURFACE,{points:$,tcoords:J,cellOffset:0,forceFlatten:!0}),e.VBOBuildString=_}e.VBOBuildTime.modified()},t.updateLabelOutlineOpacityTexture=n=>{let a=n.getProperty().getLabelOutlineOpacity();typeof a=="number"&&(e._cachedLabelOutlineOpacityObj?.[0]===a?a=e._cachedLabelOutlineOpacityObj:a=[a],e._cachedLabelOutlineOpacityObj=a);let i=e._openGLRenderWindow.getGraphicsResourceForObject(a),s=`${a.join("-")}`;if(!i?.oglObject?.getHandle()||i?.hash!==s){let o=e.renderable.getLabelOutlineTextureWidth();o<=0&&(o=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));let c=1,f=o*c,u=new Float32Array(f);for(let g=0;g<o;++g)u[g]=a[g]??a[0];e.labelOutlineOpacityTexture=Se.newInstance({resizable:!1}),e.labelOutlineOpacityTexture.setOpenGLRenderWindow(e._openGLRenderWindow),e.labelOutlineOpacityTexture.resetFormatAndType(),e.labelOutlineOpacityTexture.setMinificationFilter(X.NEAREST),e.labelOutlineOpacityTexture.setMagnificationFilter(X.NEAREST),e.labelOutlineOpacityTexture.create2DFromRaw({width:o,height:c,numComps:1,dataType:re.FLOAT,data:u}),a&&(e._openGLRenderWindow.setGraphicsResourceForObject(a,e.labelOutlineOpacityTexture,s),a!==e._labelOutlineOpacity&&(e._openGLRenderWindow.registerGraphicsResourceUser(a,t),e._openGLRenderWindow.unregisterGraphicsResourceUser(e._labelOutlineOpacity,t)),e._labelOutlineOpacity=a)}else e.labelOutlineOpacityTexture=i.oglObject},t.updatelabelOutlineThicknessTexture=n=>{let a=n.getProperty().getLabelOutlineThicknessByReference(),i=e._openGLRenderWindow.getGraphicsResourceForObject(a),s=`${a.join("-")}`;if(!i?.oglObject?.getHandle()||i?.hash!==s){let o=e.renderable.getLabelOutlineTextureWidth();o<=0&&(o=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));let c=1,f=o*c,u=new Uint8Array(f);for(let g=0;g<o;++g){let l=typeof a[g]<"u"?a[g]:a[0];u[g]=l}e.labelOutlineThicknessTexture=Se.newInstance({resizable:!1}),e.labelOutlineThicknessTexture.setOpenGLRenderWindow(e._openGLRenderWindow),e.labelOutlineThicknessTexture.resetFormatAndType(),e.labelOutlineThicknessTexture.setMinificationFilter(X.NEAREST),e.labelOutlineThicknessTexture.setMagnificationFilter(X.NEAREST),e.labelOutlineThicknessTexture.create2DFromRaw({width:o,height:c,numComps:1,dataType:re.UNSIGNED_CHAR,data:u}),a&&(e._openGLRenderWindow.setGraphicsResourceForObject(a,e.labelOutlineThicknessTexture,s),a!==e._labelOutlineThicknessArray&&(e._openGLRenderWindow.registerGraphicsResourceUser(a,t),e._openGLRenderWindow.unregisterGraphicsResourceUser(e._labelOutlineThicknessArray,t)),e._labelOutlineThicknessArray=a)}else e.labelOutlineThicknessTexture=i.oglObject},t.getRenderTargetSize=()=>{if(e._useSmallViewport)return[e._smallViewportWidth,e._smallViewportHeight];let{usize:n,vsize:a}=e._openGLRenderer.getTiledSizeAndOrigin();return[n,a]},t.getRenderTargetOffset=()=>{let{lowerLeftU:n,lowerLeftV:a}=e._openGLRenderer.getTiledSizeAndOrigin();return[n,a]},t.delete=at(()=>{e._openGLRenderWindow&&r(e._openGLRenderWindow)},t.delete)}var lS={VBOBuildTime:0,VBOBuildString:null,openGLTexture:null,tris:null,imagemat:null,imagematinv:null,colorTexture:null,pwfTexture:null,labelOutlineThicknessTexture:null,labelOutlineOpacityTexture:null,lastHaveSeenDepthRequest:!1,haveSeenDepthRequest:!1,lastTextureComponents:0};function pS(t,e,r={}){Object.assign(e,lS,r),ve.extend(t,e,r),Gt.implementReplaceShaderCoincidentOffset(t,e,r),Gt.implementBuildShadersWithReplacements(t,e,r),e.tris=Nt.newInstance(),e.imagemat=L.identity(new Float64Array(16)),e.imagematinv=L.identity(new Float64Array(16)),e.projectionToWorld=L.identity(new Float64Array(16)),e.idxToView=L.identity(new Float64Array(16)),e.idxNormalMatrix=ne.identity(new Float64Array(9)),e.modelToView=L.identity(new Float64Array(16)),e.projectionToView=L.identity(new Float64Array(16)),de(t,e,[]),e.VBOBuildTime={},pe(e.VBOBuildTime),uS(t,e)}var gS=ue(pS,"vtkOpenGLImageMapper");_e("vtkAbstractImageMapper",gS);function hS(t,e){e.classHierarchy.push("vtkOpenGLImageSlice"),t.buildPass=r=>{if(!(!e.renderable||!e.renderable.getVisibility())&&r){if(!e.renderable)return;e._openGLRenderWindow=t.getLastAncestorOfType("vtkOpenGLRenderWindow"),e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer"),e.context=e._openGLRenderWindow.getContext(),t.prepareNodes(),t.addMissingNode(e.renderable.getMapper()),t.removeUnusedNodes()}},t.traverseZBufferPass=r=>{!e.renderable||!e.renderable.getNestedVisibility()||e._openGLRenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(r,!0),e.children.forEach(n=>{n.traverse(r)}),t.apply(r,!1))},t.traverseOpaqueZBufferPass=r=>t.traverseOpaquePass(r),t.traverseOpaquePass=r=>{!e.renderable||!e.renderable.getNestedVisibility()||!e.renderable.getIsOpaque()||e._openGLRenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(r,!0),e.children.forEach(n=>{n.traverse(r)}),t.apply(r,!1))},t.traverseTranslucentPass=r=>{!e.renderable||!e.renderable.getNestedVisibility()||e.renderable.getIsOpaque()||e._openGLRenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(r,!0),e.children.forEach(n=>{n.traverse(r)}),t.apply(r,!1))},t.queryPass=(r,n)=>{if(r){if(!e.renderable||!e.renderable.getVisibility())return;e.renderable.getIsOpaque()?n.incrementOpaqueActorCount():n.incrementTranslucentActorCount()}},t.zBufferPass=(r,n)=>t.opaquePass(r,n),t.opaqueZBufferPass=(r,n)=>t.opaquePass(r,n),t.opaquePass=(r,n)=>{r&&e.context.depthMask(!0)},t.translucentPass=(r,n)=>{e.context.depthMask(!r)},t.getKeyMatrices=()=>(e.renderable.getMTime()>e.keyMatrixTime.getMTime()&&(L.copy(e.keyMatrices.mcwc,e.renderable.getMatrix()),L.transpose(e.keyMatrices.mcwc,e.keyMatrices.mcwc),e.keyMatrixTime.modified()),e.keyMatrices)}var vS={context:null,keyMatrixTime:null,keyMatrices:null};function dS(t,e,r={}){Object.assign(e,vS,r),ve.extend(t,e,r),e.keyMatrixTime={},pe(e.keyMatrixTime,{mtime:0}),e.keyMatrices={mcwc:L.identity(new Float64Array(16))},de(t,e,["context"]),hS(t,e)}var TS=ue(dS,"vtkOpenGLImageSlice");_e("vtkImageSlice",TS);var{vtkDebugMacro:mS}=we;function yS(t,e){e.classHierarchy.push("vtkOpenGLPixelSpaceCallbackMapper"),t.opaquePass=(r,n)=>{e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer"),e._openGLRenderWindow=e._openGLRenderer.getLastAncestorOfType("vtkOpenGLRenderWindow");let a=e._openGLRenderer.getAspectRatio(),i=e._openGLRenderer?e._openGLRenderer.getRenderable().getActiveCamera():null,s=e._openGLRenderer.getTiledSizeAndOrigin(),o=null;if(e.renderable.getUseZValues()){let c=n.getZBufferTexture(),f=Math.floor(c.getWidth()),u=Math.floor(c.getHeight()),g=e._openGLRenderWindow.getContext();c.bind();let l=n.getFramebuffer();l?l.saveCurrentBindingsAndBuffers():mS("No framebuffer to save/restore");let h=g.createFramebuffer();g.bindFramebuffer(g.FRAMEBUFFER,h),g.framebufferTexture2D(g.FRAMEBUFFER,g.COLOR_ATTACHMENT0,g.TEXTURE_2D,c.getHandle(),0),g.checkFramebufferStatus(g.FRAMEBUFFER)===g.FRAMEBUFFER_COMPLETE&&(o=new Uint8Array(f*u*4),g.viewport(0,0,f,u),g.readPixels(0,0,f,u,g.RGBA,g.UNSIGNED_BYTE,o)),l&&l.restorePreviousBindingsAndBuffers(),g.deleteFramebuffer(h)}e.renderable.invokeCallback(e.renderable.getInputData(),i,a,s,o)},t.queryPass=(r,n)=>{r&&e.renderable.getUseZValues()&&n.requestDepth()}}var SS={};function xS(t,e,r={}){Object.assign(e,SS,r),ve.extend(t,e,r),yS(t,e)}var CS=ue(xS,"vtkOpenGLPixelSpaceCallbackMapper");_e("vtkPixelSpaceCallbackMapper",CS);var{vtkDebugMacro:OS}=we;function wS(t,e){e.classHierarchy.push("vtkOpenGLRenderer"),t.buildPass=r=>{if(r){if(!e.renderable)return;e.renderable.updateLightGeometry(),t.updateLights(),t.prepareNodes(),t.addMissingNode(e.renderable.getActiveCamera()),t.addMissingNodes(e.renderable.getViewPropsWithNestedProps(),!0),t.removeUnusedNodes()}},t.updateLights=()=>{let r=0,n=e.renderable.getLightsByReference();for(let a=0;a<n.length;++a)n[a].getSwitch()>0&&r++;return r||(OS("No lights are on, creating one."),e.renderable.createLight()),r},t.zBufferPass=r=>{if(r){let n=0,a=e.context;e.renderable.getTransparent()||(e.context.clearColor(1,0,0,1),n|=a.COLOR_BUFFER_BIT),e.renderable.getPreserveDepthBuffer()||(a.clearDepth(1),n|=a.DEPTH_BUFFER_BIT,e.context.depthMask(!0));let i=t.getTiledSizeAndOrigin();a.enable(a.SCISSOR_TEST),a.scissor(i.lowerLeftU,i.lowerLeftV,i.usize,i.vsize),a.viewport(i.lowerLeftU,i.lowerLeftV,i.usize,i.vsize),a.colorMask(!0,!0,!0,!0),n&&a.clear(n),a.enable(a.DEPTH_TEST)}},t.opaqueZBufferPass=r=>t.zBufferPass(r),t.cameraPass=r=>{r&&t.clear()},t.getAspectRatio=()=>{let r=e._parent.getSizeByReference(),n=e.renderable.getViewportByReference();return r[0]*(n[2]-n[0])/((n[3]-n[1])*r[1])},t.getTiledSizeAndOrigin=()=>{let r=e.renderable.getViewportByReference(),n=[0,0,1,1],a=r[0]-n[0],i=r[1]-n[1],s=e._parent.normalizedDisplayToDisplay(a,i),o=Math.round(s[0]),c=Math.round(s[1]),f=r[2]-n[0],u=r[3]-n[1],g=e._parent.normalizedDisplayToDisplay(f,u),l=Math.round(g[0])-o,h=Math.round(g[1])-c;return l<0&&(l=0),h<0&&(h=0),{usize:l,vsize:h,lowerLeftU:o,lowerLeftV:c}},t.clear=()=>{let r=0,n=e.context;if(!e.renderable.getTransparent()){let i=e.renderable.getBackgroundByReference();n.clearColor(i[0],i[1],i[2],i[3]),r|=n.COLOR_BUFFER_BIT}e.renderable.getPreserveDepthBuffer()||(n.clearDepth(1),r|=n.DEPTH_BUFFER_BIT,n.depthMask(!0)),n.colorMask(!0,!0,!0,!0);let a=t.getTiledSizeAndOrigin();n.enable(n.SCISSOR_TEST),n.scissor(a.lowerLeftU,a.lowerLeftV,a.usize,a.vsize),n.viewport(a.lowerLeftU,a.lowerLeftV,a.usize,a.vsize),r&&n.clear(r),n.enable(n.DEPTH_TEST)},t.releaseGraphicsResources=()=>{e.selector!==null&&e.selector.releaseGraphicsResources(),e.renderable&&e.renderable.getViewProps().forEach(r=>{r.modified()})},t.setOpenGLRenderWindow=r=>{e._openGLRenderWindow!==r&&(t.releaseGraphicsResources(),e._openGLRenderWindow=r,e.context=null,r&&(e.context=e._openGLRenderWindow.getContext()))}}var RS={context:null,_openGLRenderWindow:null,selector:null};function ES(t,e,r={}){Object.assign(e,RS,r),ve.extend(t,e,r),Ee(t,e,["shaderCache"]),de(t,e,["selector"]),or(t,e,["openGLRenderWindow"]),wS(t,e)}var MS=ue(ES,"vtkOpenGLRenderer");_e("vtkRenderer",MS);function DS(t,e){e.classHierarchy.push("vtkImplicitFunction"),t.functionValue=r=>{if(!e.transform)return t.evaluateFunction(r);let n=[];return e.transform.transformPoint(r,n),t.evaluateFunction(n)},t.evaluateFunction=r=>{w.vtkErrorMacro("not implemented")}}var VS={};function Mu(t,e,r={}){Object.assign(e,VS,r),w.obj(t,e),w.setGet(t,e,["transform"]),DS(t,e)}var LS=w.newInstance(Mu,"vtkImplicitFunction"),Du={newInstance:LS,extend:Mu};var Ks=1e-6,Vu="coincide",Lu="disjoint";function _S(t,e,r){return t[0]*(r[0]-e[0])+t[1]*(r[1]-e[1])+t[2]*(r[2]-e[2])}function _u(t,e,r){let n=r[0]*(t[0]-e[0])+r[1]*(t[1]-e[1])+r[2]*(t[2]-e[2]);return Math.abs(n)}function Bu(t,e,r,n){let a=[];De(t,e,a);let i=ee(r,a);n[0]=t[0]-i*r[0],n[1]=t[1]-i*r[1],n[2]=t[2]-i*r[2]}function Fu(t,e,r){let n=ee(t,e),a=ee(e,e);return a===0&&(a=1),r[0]=t[0]-n*e[0]/a,r[1]=t[1]-n*e[1]/a,r[2]=t[2]-n*e[2]/a,r}function Uu(t,e,r,n){let a=[];De(t,e,a);let i=ee(r,a),s=ee(r,r);s!==0?(n[0]=t[0]-i*r[0]/s,n[1]=t[1]-i*r[1]/s,n[2]=t[2]-i*r[2]/s):(n[0]=t[0],n[1]=t[1],n[2]=t[2])}function Nu(t,e,r,n){let a={intersection:!1,betweenPoints:!1,t:Number.MAX_VALUE,x:[]},i=[],s=[];De(e,t,i),De(r,t,s);let o=ee(n,s),c=ee(n,i),f,u;return c<0?f=-c:f=c,o<0?u=-o*Ks:u=o*Ks,f<=u||(a.t=o/c,a.x[0]=t[0]+a.t*i[0],a.x[1]=t[1]+a.t*i[1],a.x[2]=t[2]+a.t*i[2],a.intersection=!0,a.betweenPoints=a.t>=0&&a.t<=1),a}function Gu(t,e,r,n){let a={intersection:!1,l0:[],l1:[],error:null},i=[];Ge(e,n,i);let s=i.map(g=>Math.abs(g));if(s[0]+s[1]+s[2]<Ks){let g=[];return De(t,r,g),ee(e,g)===0?a.error=Vu:a.error=Lu,a}let o;s[0]>s[1]&&s[0]>s[2]?o="x":s[1]>s[2]?o="y":o="z";let c=[],f=-ee(e,t),u=-ee(n,r);switch(o){case"x":c[0]=0,c[1]=(u*e[2]-f*n[2])/i[0],c[2]=(f*n[1]-u*e[1])/i[0];break;case"y":c[0]=(f*n[2]-u*e[2])/i[1],c[1]=0,c[2]=(u*e[0]-f*n[0])/i[1];break;case"z":c[0]=(u*e[1]-f*n[1])/i[2],c[1]=(f*n[0]-u*e[0])/i[2],c[2]=0}return a.l0=c,Zt(c,i,a.l1),a.intersection=!0,a}var BS={evaluate:_S,distanceToPlane:_u,projectPoint:Bu,projectVector:Fu,generalizedProjectPoint:Uu,intersectWithLine:Nu,intersectWithPlane:Gu,DISJOINT:Lu,COINCIDE:Vu};function FS(t,e){e.classHierarchy.push("vtkPlane"),t.distanceToPlane=r=>_u(r,e.origin,e.normal),t.projectPoint=(r,n)=>{Bu(r,e.origin,e.normal,n)},t.projectVector=(r,n)=>Fu(r,e.normal,n),t.push=r=>{if(r!==0)for(let n=0;n<3;n++)e.origin[n]+=r*e.normal[n]},t.generalizedProjectPoint=(r,n)=>{Uu(r,e.origin,e.normal,n)},t.evaluateFunction=(r,n,a)=>Array.isArray(r)?e.normal[0]*(r[0]-e.origin[0])+e.normal[1]*(r[1]-e.origin[1])+e.normal[2]*(r[2]-e.origin[2]):e.normal[0]*(r-e.origin[0])+e.normal[1]*(n-e.origin[1])+e.normal[2]*(a-e.origin[2]),t.evaluateGradient=r=>[e.normal[0],e.normal[1],e.normal[2]],t.intersectWithLine=(r,n)=>Nu(r,n,e.origin,e.normal),t.intersectWithPlane=(r,n)=>Gu(r,n,e.origin,e.normal)}var US={normal:[0,0,1],origin:[0,0,0]};function ku(t,e,r={}){Object.assign(e,US,r),Du.extend(t,e,r),w.setGetArray(t,e,["normal","origin"],3),FS(t,e)}var NS=w.newInstance(ku,"vtkPlane"),lt={newInstance:NS,extend:ku,...BS};var qa=[Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_VALUE,-Number.MAX_VALUE,Number.MAX_VALUE,-Number.MAX_VALUE];function bu(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]&&t[3]===e[3]&&t[4]===e[4]&&t[5]===e[5]}function tr(t){return t?.length>=6&&t[0]<=t[1]&&t[2]<=t[3]&&t[4]<=t[5]}function Xs(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t}function Ys(t){return Xs(t,qa)}function Ka(t,e,r,n){let[a,i,s,o,c,f]=t;return typeof e=="number"?(t[0]=a<e?a:e,t[1]=i>e?i:e,t[2]=s<r?s:r,t[3]=o>r?o:r,t[4]=c<n?c:n,t[5]=f>n?f:n):(t[0]=a<e[0]?a:e[0],t[1]=i>e[0]?i:e[0],t[2]=s<e[1]?s:e[1],t[3]=o>e[1]?o:e[1],t[4]=c<e[2]?c:e[2],t[5]=f>e[2]?f:e[2]),t}function qs(t,e){if(e.length===0)return t;if(Array.isArray(e[0]))for(let r=0;r<e.length;++r)Ka(t,...e[r]);else for(let r=0;r<e.length;r+=3)Ka(t,...e.slice(r,r+3));return t}function zu(t,e,r,n,a,i,s){let[o,c,f,u,g,l]=t;return s===void 0?(t[0]=Math.min(e[0],o),t[1]=Math.max(e[1],c),t[2]=Math.min(e[2],f),t[3]=Math.max(e[3],u),t[4]=Math.min(e[4],g),t[5]=Math.max(e[5],l)):(t[0]=Math.min(e,o),t[1]=Math.max(r,c),t[2]=Math.min(n,f),t[3]=Math.max(a,u),t[4]=Math.min(i,g),t[5]=Math.max(s,l)),t}function Wu(t,e,r,n){let[a,i,s,o,c,f]=t;return t[0]=e,t[1]=e>i?e:i,t[2]=r,t[3]=r>o?r:o,t[4]=n,t[5]=n>f?n:f,a!==e||s!==r||c!==n}function Iu(t,e,r,n){let[a,i,s,o,c,f]=t;return t[0]=e<a?e:a,t[1]=e,t[2]=r<s?r:s,t[3]=r,t[4]=n<c?n:c,t[5]=n,i!==e||o!==r||f!==n}function Zs(t,e){return e==null?GS(t):(t[0]-=e,t[1]+=e,t[2]-=e,t[3]+=e,t[4]-=e,t[5]+=e,t)}function GS(t){let e=[0,0,0],r=-1,n=0,a=0;for(let i=0;i<3;++i)a=t[i*2+1]-t[i*2],a>n&&(n=a,r=i),e[i]=a>0?1:0;if(r<0)return Zs(t,.5);for(let i=0;i<3;++i)if(!e[i]){let s=.005*n;t[i*2]-=s,t[i*2+1]+=s}return t}function Qs(t,e,r,n){return tr(t)?(e>=0?(t[0]*=e,t[1]*=e):(t[0]=e*t[1],t[1]=e*t[0]),r>=0?(t[2]*=r,t[3]*=r):(t[2]=r*t[3],t[3]=r*t[2]),n>=0?(t[4]*=n,t[5]*=n):(t[4]=n*t[5],t[5]=n*t[4]),!0):!1}function Js(t){return[.5*(t[0]+t[1]),.5*(t[2]+t[3]),.5*(t[4]+t[5])]}function kS(t,e,r,n){if(!tr(t))return!1;let a=Js(t);return t[0]-=a[0],t[1]-=a[0],t[2]-=a[1],t[3]-=a[1],t[4]-=a[2],t[5]-=a[2],Qs(t,e,r,n),t[0]+=a[0],t[1]+=a[0],t[2]+=a[1],t[3]+=a[1],t[4]+=a[2],t[5]+=a[2],!0}function Nn(t,e){return t[e*2+1]-t[e*2]}function Gn(t){return[Nn(t,0),Nn(t,1),Nn(t,2)]}function Hu(t){return t.slice(0,2)}function ju(t){return t.slice(2,4)}function Pu(t){return t.slice(4,6)}function $u(t){let e=Gn(t);return e[0]>e[1]?e[0]>e[2]?e[0]:e[2]:e[1]>e[2]?e[1]:e[2]}function eo(t){if(tr(t)){let e=Gn(t);return e[0]*e[0]+e[1]*e[1]+e[2]*e[2]}return null}function Au(t){let e=eo(t);return e!==null?Math.sqrt(e):null}function Za(t){return[t[0],t[2],t[4]]}function Qa(t){return[t[1],t[3],t[5]]}function Aa(t,e){return t<=0&&e>=0||t>=0&&e<=0}function to(t,e){return e[0]=[t[0],t[2],t[4]],e[1]=[t[0],t[2],t[5]],e[2]=[t[0],t[3],t[4]],e[3]=[t[0],t[3],t[5]],e[4]=[t[1],t[2],t[4]],e[5]=[t[1],t[2],t[5]],e[6]=[t[1],t[3],t[4]],e[7]=[t[1],t[3],t[5]],e}function Ku(t,e,r){return e[0]=t[0],e[1]=t[2],e[2]=t[4],r[0]=t[1],r[1]=t[3],r[2]=t[5],e}function Xu(t,e,r=[]){let n=to(t,[]);for(let a=0;a<n.length;++a)W.transformMat4(n[a],n[a],e);return Ys(r),qs(r,n)}function Yu(t,e=[]){return e[0]=.5*(t[1]-t[0]),e[1]=.5*(t[3]-t[2]),e[2]=.5*(t[5]-t[4]),e}function qu(t,e,r,n){let a=[].concat(qa),i=t.getData();for(let s=0;s<i.length;s+=3){let o=[i[s],i[s+1],i[s+2]],c=ee(o,e);a[0]=Math.min(c,a[0]),a[1]=Math.max(c,a[1]);let f=ee(o,r);a[2]=Math.min(f,a[2]),a[3]=Math.max(f,a[3]);let u=ee(o,n);a[4]=Math.min(u,a[4]),a[5]=Math.max(u,a[5])}return a}function Zu(t,e,r,n,a){let i=!0,s=[],o=0,c=[],f=[0,0,0],u=0,g=1,l=2;for(let h=0;h<3;h++)e[h]<t[2*h]?(s[h]=g,f[h]=t[2*h],i=!1):e[h]>t[2*h+1]?(s[h]=u,f[h]=t[2*h+1],i=!1):s[h]=l;if(i)return n[0]=e[0],n[1]=e[1],n[2]=e[2],a[0]=0,1;for(let h=0;h<3;h++)s[h]!==l&&r[h]!==0?c[h]=(f[h]-e[h])/r[h]:c[h]=-1;for(let h=0;h<3;h++)c[o]<c[h]&&(o=h);if(c[o]>1||c[o]<0)return 0;a[0]=c[o];for(let h=0;h<3;h++)if(o!==h){if(n[h]=e[h]+c[o]*r[h],n[h]<t[2*h]||n[h]>t[2*h+1])return 0}else n[h]=f[h];return 1}function Qu(t,e,r){let n=[],a=0,i=1,s=1;for(let o=4;o<=5;++o){n[2]=t[o];for(let c=2;c<=3;++c){n[1]=t[c];for(let f=0;f<=1;++f)if(n[0]=t[f],a=lt.evaluate(r,e,n),s&&(i=a>=0?1:-1,s=0),a===0||i>0&&a<0||i<0&&a>0)return 1}}return 0}function Ju(t,e){if(!(tr(t)&&tr(e)))return!1;let r=[0,0,0,0,0,0],n;for(let a=0;a<3;a++)if(n=!1,e[a*2]>=t[a*2]&&e[a*2]<=t[a*2+1]?(n=!0,r[a*2]=e[a*2]):t[a*2]>=e[a*2]&&t[a*2]<=e[a*2+1]&&(n=!0,r[a*2]=t[a*2]),e[a*2+1]>=t[a*2]&&e[a*2+1]<=t[a*2+1]?(n=!0,r[a*2+1]=e[2*a+1]):t[a*2+1]>=e[a*2]&&t[a*2+1]<=e[a*2+1]&&(n=!0,r[a*2+1]=t[a*2+1]),!n)return!1;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],!0}function Xa(t,e){if(!(tr(t)&&tr(e)))return!1;for(let r=0;r<3;r++)if(!(e[r*2]>=t[r*2]&&e[r*2]<=t[r*2+1])&&!(t[r*2]>=e[r*2]&&t[r*2]<=e[r*2+1])&&!(e[r*2+1]>=t[r*2]&&e[r*2+1]<=t[r*2+1])&&!(t[r*2+1]>=e[r*2]&&t[r*2+1]<=e[r*2+1]))return!1;return!0}function Ya(t,e,r,n){return!(e<t[0]||e>t[1]||r<t[2]||r>t[3]||n<t[4]||n>t[5])}function bS(t,e){return!(!Xa(t,e)||!Ya(t,...Za(e))||!Ya(t,...Qa(e)))}function el(t,e,r){let n=[[0,1,2,3,4,5,6,7],[0,1,4,5,2,3,6,7],[0,2,4,6,1,3,5,7]],a=[0,0,0,0,0,0,0,0],i=0;for(let g=0;g<2;g++)for(let l=2;l<4;l++)for(let h=4;h<6;h++){let y=[t[g],t[l],t[h]];a[i++]=lt.evaluate(r,e,y)}let s=2;for(;s--&&!(Aa(a[n[s][0]],a[n[s][4]])&&Aa(a[n[s][1]],a[n[s][5]])&&Aa(a[n[s][2]],a[n[s][6]])&&Aa(a[n[s][3]],a[n[s][7]])););if(s<0)return!1;let o=Math.sign(r[s]),c=Math.abs((t[s*2+1]-t[s*2])*r[s]),f=o>0?1:0;for(let g=0;g<4;g++){if(c===0)continue;let l=Math.abs(a[n[s][g]])/c;o>0&&l<f&&(f=l),o<0&&l>f&&(f=l)}let u=(1-f)*t[s*2]+f*t[s*2+1];return o>0?t[s*2]=u:t[s*2+1]=u,!0}function tl(t,e){for(let n=0;n<3;++n)e[n]=e[n]<1?1:e[n];let r=e[0]*e[1]*e[2];for(;r>t;){for(let n=0;n<3;++n)e[n]=e[n]>1?e[n]-1:1;r=e[0]*e[1]*e[2]}}function rl(t,e,r,n=[]){e=e<=0?1:e;let a=0,i=[0,0,0],s=-1,o=0,c=Gn(t),f=c[0]+c[1]+c[2],u=f*(.001/3);for(let p=0;p<3;++p)c[p]>o&&(s=p,o=c[p]),c[p]>u?(i[p]=1,a++):i[p]=0;let g=Za(t),l=Qa(t);if(a<1)return r[0]=1,r[1]=1,r[2]=1,n[0]=g[0]-.5,n[1]=l[0]+.5,n[2]=g[1]-.5,n[3]=l[1]+.5,n[4]=g[2]-.5,n[5]=l[2]+.5,1;let h=e;h/=i[0]?c[0]/f:1,h/=i[1]?c[1]/f:1,h/=i[2]?c[2]/f:1,h**=1/a;for(let p=0;p<3;++p)r[p]=i[p]?Math.floor(h*c[p]/f):1,r[p]=r[p]<1?1:r[p];tl(e,r);let y=.5*c[s]/r[s];for(let p=0;p<3;++p)i[p]?(n[2*p]=g[p],n[2*p+1]=l[p]):(n[2*p]=g[p]-y,n[2*p+1]=l[p]+y);return r[0]*r[1]*r[2]}function nl(t,e){if(t[0]>=e[0]&&t[0]<=e[1]&&t[1]>=e[2]&&t[1]<=e[3]&&t[2]>=e[4]&&t[2]<=e[5])return 0;let r=[0,0,0];return t[0]<e[0]?r[0]=e[0]-t[0]:t[0]>e[1]&&(r[0]=t[0]-e[1]),t[1]<e[2]?r[1]=e[2]-t[1]:t[1]>e[3]&&(r[1]=t[1]-e[3]),t[2]<e[4]?r[2]=e[4]-t[2]:t[2]>e[5]&&(r[2]=t[2]-e[5]),ee(r,r)}var zS=class{constructor(t){this.bounds=t,this.bounds||(this.bounds=new Float64Array(qa))}getBounds(){return this.bounds}equals(t){return bu(this.bounds,t)}isValid(){return tr(this.bounds)}setBounds(t){return Xs(this.bounds,t)}reset(){return Ys(this.bounds)}addPoint(...t){return Ka(this.bounds,...t)}addPoints(t){return qs(this.bounds,t)}addBounds(t,e,r,n,a,i){return zu(this.bounds,t,e,r,n,a,i)}setMinPoint(t,e,r){return Wu(this.bounds,t,e,r)}setMaxPoint(t,e,r){return Iu(this.bounds,t,e,r)}inflate(t){return Zs(this.bounds,t)}scale(t,e,r){return Qs(this.bounds,t,e,r)}getCenter(){return Js(this.bounds)}getLength(t){return Nn(this.bounds,t)}getLengths(){return Gn(this.bounds)}getMaxLength(){return $u(this.bounds)}getDiagonalLength(){return Au(this.bounds)}getDiagonalLength2(){return eo(this.bounds)}getMinPoint(){return Za(this.bounds)}getMaxPoint(){return Qa(this.bounds)}getXRange(){return Hu(this.bounds)}getYRange(){return ju(this.bounds)}getZRange(){return Pu(this.bounds)}getCorners(t){return to(this.bounds,t)}computeCornerPoints(t,e){return Ku(this.bounds,t,e)}computeLocalBounds(t,e,r){return qu(this.bounds,t,e,r)}transformBounds(t,e=[]){return Xu(this.bounds,t,e)}computeScale3(t){return Yu(this.bounds,t)}cutWithPlane(t,e){return el(this.bounds,t,e)}intersectBox(t,e,r,n){return Zu(this.bounds,t,e,r,n)}intersectPlane(t,e){return Qu(this.bounds,t,e)}intersect(t){return Ju(this.bounds,t)}intersects(t){return Xa(this.bounds,t)}containsPoint(t,e,r){return Ya(this.bounds,t,e,r)}contains(t){return Xa(this.bounds,t)}computeDivisions(t,e,r=[]){return rl(this.bounds,t,e,r)}distance2ToBounds(t){return nl(t,this.bounds)}};function WS(t){return new zS(t&&t.bounds)}var IS={equals:bu,isValid:tr,setBounds:Xs,reset:Ys,addPoint:Ka,addPoints:qs,addBounds:zu,setMinPoint:Wu,setMaxPoint:Iu,inflate:Zs,scale:Qs,scaleAboutCenter:kS,getCenter:Js,getLength:Nn,getLengths:Gn,getMaxLength:$u,getDiagonalLength:Au,getDiagonalLength2:eo,getMinPoint:Za,getMaxPoint:Qa,getXRange:Hu,getYRange:ju,getZRange:Pu,getCorners:to,computeCornerPoints:Ku,computeLocalBounds:qu,transformBounds:Xu,computeScale3:Yu,cutWithPlane:el,intersectBox:Zu,intersectPlane:Qu,intersect:Ju,intersects:Xa,containsPoint:Ya,contains:bS,computeDivisions:rl,clampDivisions:tl,distance2ToBounds:nl,INIT_BOUNDS:qa},q={newInstance:WS,...IS};var{vtkErrorMacro:HS,vtkWarningMacro:jS}=w;function PS(t,e){let r=0;e.classHierarchy.push("vtkPoints"),t.getNumberOfPoints=t.getNumberOfTuples,t.setNumberOfPoints=(i,s=3)=>{t.getNumberOfPoints()!==i&&(e.size=i*s,e.values=w.newTypedArray(e.dataType,e.size),t.setNumberOfComponents(s),t.modified())},t.setPoint=(i,...s)=>{t.setTuple(i,s)},t.getPoint=t.getTuple,t.findPoint=t.findTuple,t.insertNextPoint=(i,s,o)=>t.insertNextTuple([i,s,o]),t.insertPoint=(i,s)=>t.insertTuple(i,s);let n=t.getBounds;t.getBounds=()=>(r<e.mtime&&t.computeBounds(),n());let a=t.getBoundsByReference;t.getBoundsByReference=()=>(r<e.mtime&&t.computeBounds(),a()),t.computeBounds=()=>{if(t.getNumberOfComponents()===3){let i=t.getRange(0);e.bounds[0]=i[0],e.bounds[1]=i[1];let s=t.getRange(1);e.bounds[2]=s[0],e.bounds[3]=s[1];let o=t.getRange(2);e.bounds[4]=o[0],e.bounds[5]=o[1]}else if(t.getNumberOfComponents()===2){let i=t.getRange(0);e.bounds[0]=i[0],e.bounds[1]=i[1];let s=t.getRange(1);e.bounds[2]=s[0],e.bounds[3]=s[1],e.bounds[4]=0,e.bounds[5]=0}else HS(`getBounds called on an array with components of ${t.getNumberOfComponents()}`),Fn(e.bounds);r=w.getCurrentGlobalMTime()}}var al={empty:!0,numberOfComponents:3,dataType:re.FLOAT,bounds:[1,-1,1,-1,1,-1]};function il(t,e,r={}){Object.assign(e,al,r);let n=r.numberOfComponents==null||r.numberOfComponents<2,{numberOfComponents:a}=r;n&&(a=al.numberOfComponents);let i={...r,numberOfComponents:a},s=r.size??r.values?.length;if(n&&s!=null&&s%a!==0){let o=Math.floor(s/a)*a;jS(`Dropping ${s-o} incomplete point component(s)`),i.size=o}Z.extend(t,e,i),w.getArray(t,e,["bounds"],6),PS(t,e)}var $S=w.newInstance(il,"vtkPoints"),Fr={newInstance:$S,extend:il};function AS(t,e){e.classHierarchy.push("vtkCell"),t.initialize=(r,n=null)=>{if(n){e.pointsIds=n;let a=e.points.getData();a.length!==3*e.pointsIds.length&&(a=w.newTypedArray(r.getDataType(),3*e.pointsIds.length));let i=r.getData();e.pointsIds.forEach((s,o)=>{let c=3*s,f=3*o;a[f]=i[c],a[++f]=i[++c],a[++f]=i[++c]}),e.points.setData(a)}else{e.points=r,e.pointsIds=new Array(r.getNumberOfPoints());for(let a=r.getNumberOfPoints()-1;a>=0;--a)e.pointsIds[a]=a}},t.getBounds=()=>e.points.getBounds(),t.getLength2=()=>{let r=q.getLengths(t.getBounds());return r[0]*r[0]+r[1]*r[1]+r[2]*r[2]},t.getParametricDistance=r=>{let n,a=0;for(let i=0;i<3;i++)r[i]<0?n=-r[i]:r[i]>1?n=r[i]-1:n=0,n>a&&(a=n);return a},t.getNumberOfPoints=()=>e.points.getNumberOfPoints(),t.deepCopy=r=>{r.initialize(e.points,e.pointsIds)},t.getCellDimension=()=>{},t.intersectWithLine=(r,n,a,i,s,o,c)=>{},t.evaluatePosition=(r,n,a,i,s,o)=>{w.vtkErrorMacro("vtkCell.evaluatePosition is not implemented.")}}var KS={bounds:[-1,-1,-1,-1,-1,-1],pointsIds:[]};function sl(t,e,r={}){Object.assign(e,KS,r),w.obj(t,e),e.points||(e.points=Fr.newInstance()),w.get(t,e,["points","pointsIds"]),AS(t,e)}var XS=w.newInstance(sl,"vtkCell"),pt={newInstance:XS,extend:sl};function YS(t,e){let r=e;for(e>=t.array.length&&(r+=t.array.length);r>t.array.length;)t.array.push({ncells:0,cells:null});t.array.length=r}function qS(t,e){e.classHierarchy.push("vtkCellLinks"),t.buildLinks=r=>{let n=r.getPoints().getNumberOfPoints(),a=r.getNumberOfCells(),i=new Uint32Array(n);if(r.isA("vtkPolyData")){for(let s=0;s<a;++s){let{cellPointIds:o}=r.getCellPoints(s);o.forEach(c=>{t.incrementLinkCount(c)})}t.allocateLinks(n),e.maxId=n-1;for(let s=0;s<a;++s){let{cellPointIds:o}=r.getCellPoints(s);o.forEach(c=>{t.insertCellReference(c,i[c]++,s)})}}else{for(let s=0;s<a;s++)pt.newInstance().getPointsIds().forEach(o=>{t.incrementLinkCount(o)});t.allocateLinks(n),e.maxId=n-1;for(let s=0;s<a;++s)pt.newInstance().getPointsIds().forEach(o=>{t.insertCellReference(o,i[o]++,s)})}},t.allocate=(r,n=1e3)=>{let a=new Array(r);for(let i=0;i<r;++i)a[i]={ncells:0,cells:null};e.array=a,e.extend=n,e.maxId=-1},t.initialize=()=>{e.array=null},t.getLink=r=>e.array[r],t.getNcells=r=>e.array[r].ncells,t.getCells=r=>e.array[r].cells,t.insertNextPoint=r=>{e.array.push({ncells:r,cells:Array(r)}),++e.maxId},t.insertNextCellReference=(r,n)=>{e.array[r].cells[e.array[r].ncells++]=n},t.deletePoint=r=>{e.array[r].ncells=0,e.array[r].cells=null},t.removeCellReference=(r,n)=>{e.array[n].cells=e.array[n].cells.filter(a=>a!==r),e.array[n].ncells=e.array[n].cells.length},t.addCellReference=(r,n)=>{e.array[n].cells[e.array[n].ncells++]=r},t.resizeCellList=(r,n)=>{e.array[r].cells.length=n},t.squeeze=()=>{YS(e,e.maxId+1)},t.reset=()=>{e.maxId=-1},t.deepCopy=r=>{e.array=[...r.array],e.extend=r.extend,e.maxId=r.maxId},t.incrementLinkCount=r=>{++e.array[r].ncells},t.allocateLinks=r=>{for(let n=0;n<r;++n)e.array[n].cells=new Array(e.array[n].ncells)},t.insertCellReference=(r,n,a)=>{e.array[r].cells[n]=a}}var ZS={array:null,maxId:0,extend:0};function ol(t,e,r={}){Object.assign(e,ZS,r),w.obj(t,e),qS(t,e)}var QS=w.newInstance(ol,"vtkCellLinks"),cl={newInstance:QS,extend:ol};var he={VTK_EMPTY_CELL:0,VTK_VERTEX:1,VTK_POLY_VERTEX:2,VTK_LINE:3,VTK_POLY_LINE:4,VTK_TRIANGLE:5,VTK_TRIANGLE_STRIP:6,VTK_POLYGON:7,VTK_PIXEL:8,VTK_QUAD:9,VTK_TETRA:10,VTK_VOXEL:11,VTK_HEXAHEDRON:12,VTK_WEDGE:13,VTK_PYRAMID:14,VTK_PENTAGONAL_PRISM:15,VTK_HEXAGONAL_PRISM:16,VTK_QUADRATIC_EDGE:21,VTK_QUADRATIC_TRIANGLE:22,VTK_QUADRATIC_QUAD:23,VTK_QUADRATIC_POLYGON:36,VTK_QUADRATIC_TETRA:24,VTK_QUADRATIC_HEXAHEDRON:25,VTK_QUADRATIC_WEDGE:26,VTK_QUADRATIC_PYRAMID:27,VTK_BIQUADRATIC_QUAD:28,VTK_TRIQUADRATIC_HEXAHEDRON:29,VTK_QUADRATIC_LINEAR_QUAD:30,VTK_QUADRATIC_LINEAR_WEDGE:31,VTK_BIQUADRATIC_QUADRATIC_WEDGE:32,VTK_BIQUADRATIC_QUADRATIC_HEXAHEDRON:33,VTK_BIQUADRATIC_TRIANGLE:34,VTK_CUBIC_LINE:35,VTK_CONVEX_POINT_SET:41,VTK_POLYHEDRON:42,VTK_PARAMETRIC_CURVE:51,VTK_PARAMETRIC_SURFACE:52,VTK_PARAMETRIC_TRI_SURFACE:53,VTK_PARAMETRIC_QUAD_SURFACE:54,VTK_PARAMETRIC_TETRA_REGION:55,VTK_PARAMETRIC_HEX_REGION:56,VTK_HIGHER_ORDER_EDGE:60,VTK_HIGHER_ORDER_TRIANGLE:61,VTK_HIGHER_ORDER_QUAD:62,VTK_HIGHER_ORDER_POLYGON:63,VTK_HIGHER_ORDER_TETRAHEDRON:64,VTK_HIGHER_ORDER_WEDGE:65,VTK_HIGHER_ORDER_PYRAMID:66,VTK_HIGHER_ORDER_HEXAHEDRON:67,VTK_LAGRANGE_CURVE:68,VTK_LAGRANGE_TRIANGLE:69,VTK_LAGRANGE_QUADRILATERAL:70,VTK_LAGRANGE_TETRAHEDRON:71,VTK_LAGRANGE_HEXAHEDRON:72,VTK_LAGRANGE_WEDGE:73,VTK_LAGRANGE_PYRAMID:74,VTK_NUMBER_OF_CELL_TYPES:75},Ja=["vtkEmptyCell","vtkVertex","vtkPolyVertex","vtkLine","vtkPolyLine","vtkTriangle","vtkTriangleStrip","vtkPolygon","vtkPixel","vtkQuad","vtkTetra","vtkVoxel","vtkHexahedron","vtkWedge","vtkPyramid","vtkPentagonalPrism","vtkHexagonalPrism","UnknownClass","UnknownClass","UnknownClass","UnknownClass","vtkQuadraticEdge","vtkQuadraticTriangle","vtkQuadraticQuad","vtkQuadraticTetra","vtkQuadraticHexahedron","vtkQuadraticWedge","vtkQuadraticPyramid","vtkBiQuadraticQuad","vtkTriQuadraticHexahedron","vtkQuadraticLinearQuad","vtkQuadraticLinearWedge","vtkBiQuadraticQuadraticWedge","vtkBiQuadraticQuadraticHexahedron","vtkBiQuadraticTriangle","vtkCubicLine","vtkQuadraticPolygon","UnknownClass","UnknownClass","UnknownClass","UnknownClass","vtkConvexPointSet","UnknownClass","UnknownClass","UnknownClass","UnknownClass","UnknownClass","UnknownClass","UnknownClass","UnknownClass","UnknownClass","vtkParametricCurve","vtkParametricSurface","vtkParametricTriSurface","vtkParametricQuadSurface","vtkParametricTetraRegion","vtkParametricHexRegion","UnknownClass","UnknownClass","UnknownClass","vtkHigherOrderEdge","vtkHigherOrderTriangle","vtkHigherOrderQuad","vtkHigherOrderPolygon","vtkHigherOrderTetrahedron","vtkHigherOrderWedge","vtkHigherOrderPyramid","vtkHigherOrderHexahedron"];function JS(t){return t<Ja.length?Ja[t]:"UnknownClass"}function ex(t){return Ja.findIndex(t)}function tx(t){return t<he.VTK_QUADRATIC_EDGE||t===he.VTK_CONVEX_POINT_SET||t===he.VTK_POLYHEDRON}function rx(t){return t===he.VTK_TRIANGLE_STRIP||t===he.VTK_POLY_LINE||t===he.VTK_POLY_VERTEX}var nx={getClassNameFromTypeId:JS,getTypeIdFromClassName:ex,isLinear:tx,hasSubCells:rx};function ax(t,e){e.classHierarchy.push("vtkCellTypes"),t.allocate=(r=512,n=1e3)=>{e.size=r>0?r:1,e.extend=n>0?n:1,e.maxId=-1,e.typeArray=new Uint8Array(r),e.locationArray=new Uint32Array(r)},t.insertCell=(r,n,a)=>{e.typeArray[r]=n,e.locationArray[r]=a,r>e.maxId&&(e.maxId=r)},t.insertNextCell=(r,n)=>(t.insertCell(++e.maxId,r,n),e.maxId),t.setCellTypes=(r,n,a)=>{e.size=r,e.typeArray=n,e.locationArray=a,e.maxId=r-1},t.getCellLocation=r=>e.locationArray[r],t.deleteCell=r=>{e.typeArray[r]=he.VTK_EMPTY_CELL},t.getNumberOfTypes=()=>e.maxId+1,t.isType=r=>{let n=t.getNumberOfTypes();for(let a=0;a<n;++a)if(r===t.getCellType(a))return!0;return!1},t.insertNextType=r=>t.insertNextCell(r,-1),t.getCellType=r=>e.typeArray[r],t.reset=()=>{e.maxId=-1},t.deepCopy=r=>{t.allocate(r.getSize(),r.getExtend()),e.typeArray.set(r.getTypeArray()),e.locationArray.set(r.getLocationArray()),e.maxId=r.getMaxId()}}var ix={size:0,maxId:-1,extend:1e3};function fl(t,e,r={}){Object.assign(e,ix,r),w.obj(t,e),w.get(t,e,["size","maxId","extend"]),w.getArray(t,e,["typeArray","locationArray"]),ax(t,e)}var sx=w.newInstance(fl,"vtkCellTypes"),ul={newInstance:sx,extend:fl,...nx};var ro={NO_INTERSECTION:0,YES_INTERSECTION:1,ON_LINE:2},no={IntersectionState:ro};var{IntersectionState:ei}=no;function nn(t,e,r,n=null){let a={t:Number.MIN_VALUE,distance:0},i=[],s;i[0]=r[0]-e[0],i[1]=r[1]-e[1],i[2]=r[2]-e[2];let o=i[0]*(t[0]-e[0])+i[1]*(t[1]-e[1])+i[2]*(t[2]-e[2]),c=ee(i,i),f=1e-5*o;return c!==0&&(a.t=o/c),f<0&&(f=-f),-f<c&&c<f||c<=0||a.t<0?s=e:a.t>1?s=r:(s=i,i[0]=e[0]+a.t*i[0],i[1]=e[1]+a.t*i[1],i[2]=e[2]+a.t*i[2]),n&&(n[0]=s[0],n[1]=s[1],n[2]=s[2]),a.distance=ze(s,t),a}function ll(t,e,r,n,a,i){let s=[],o=[],c=[];a[0]=0,i[0]=0,De(e,t,s),De(n,r,o),De(r,t,c);let f=[ee(s,s),-ee(s,o),-ee(s,o),ee(o,o)],u=[];if(u[0]=ee(s,c),u[1]=-ee(o,c),_s(f,u,2)===0){let g=Number.MAX_VALUE,l=[t,e,r,n],h=[r,r,t,t],y=[n,n,e,e],p=[i[0],i[0],a[0],a[0]],m=[a[0],a[0],i[0],i[0]],d;for(let x=0;x<4;x++)d=nn(l[x],h[x],y[x]),d.distance<g&&(g=d.distance,p[x]=d.t,m[x]=x%2);return ei.ON_LINE}return a[0]=u[0],i[0]=u[1],a[0]>=0&&a[0]<=1&&i[0]>=0&&i[0]<=1?ei.YES_INTERSECTION:ei.NO_INTERSECTION}var ox={distanceToLine:nn,intersection:ll};function cx(t,e){e.classHierarchy.push("vtkLine");function r(n){return n>=0&&n<=1}t.getCellDimension=()=>1,t.intersectWithLine=(n,a,i,s,o)=>{let c={intersect:0,t:Number.MAX_VALUE,subId:0,betweenPoints:null};o[1]=0,o[2]=0;let f=[],u=[],g=[];e.points.getPoint(0,u),e.points.getPoint(1,g);let l=[],h=[],y=ll(n,a,u,g,l,h);if(c.t=l[0],c.betweenPoints=r(c.t),o[0]=h[0],y===ei.YES_INTERSECTION){for(let p=0;p<3;p++)s[p]=u[p]+o[0]*(g[p]-u[p]),f[p]=n[p]+c.t*(a[p]-n[p]);if(ze(s,f)<=i*i)return c.intersect=1,c}else{let p;if(c.t<0)return p=nn(n,u,g,s),p.distance<=i*i&&(c.t=0,c.intersect=1,c.betweenPoints=!0),c;if(c.t>1)return p=nn(a,u,g,s),p.distance<=i*i&&(c.t=1,c.intersect=1,c.betweenPoints=!0),c;if(o[0]<0)return o[0]=0,p=nn(u,n,a,s),c.t=p.t,p.distance<=i*i&&(c.intersect=1),c;if(o[0]>1)return o[0]=1,p=nn(g,n,a,s),c.t=p.t,p.distance<=i*i&&(c.intersect=1),c}return c},t.evaluateLocation=(n,a,i)=>{let s=[],o=[];e.points.getPoint(0,s),e.points.getPoint(1,o);for(let c=0;c<3;c++)a[c]=s[c]+n[0]*(o[c]-s[c]);i[0]=1-n[0],i[1]=n[0]},t.evaluateOrientation=(n,a,i)=>e.orientations?(Me.slerp(a,e.orientations[0],e.orientations[1],n[0]),i[0]=1-n[0],i[1]=n[0],!0):!1}var fx={orientations:null};function pl(t,e,r={}){Object.assign(e,fx,r),pt.extend(t,e,r),w.setGet(t,e,["orientations"]),cx(t,e)}var ux=w.newInstance(pl,"vtkLine"),Ue={newInstance:ux,extend:pl,...ox,...no};var{vtkErrorMacro:gl,vtkWarningMacro:lx}=w;function px(t,e){e.classHierarchy.push("vtkFieldData");let r=t.getState;e.arrays&&(e.arrays=e.arrays.map(n=>({data:Ze(n.data)}))),t.initialize=()=>{t.initializeFields(),t.copyAllOn(),t.clearFieldFlags()},t.initializeFields=()=>{e.arrays=[],e.copyFieldFlags={},t.modified()},t.copyStructure=n=>{t.initializeFields(),e.copyFieldFlags=n.getCopyFieldFlags().map(a=>a),e.arrays=n.getArrays().map(a=>({data:a}))},t.getNumberOfArrays=()=>e.arrays.length,t.getNumberOfActiveArrays=()=>e.arrays.length,t.addArray=n=>{let a=n.getName(),{array:i,index:s}=t.getArrayWithIndex(a);return i!=null?(e.arrays[s]={data:n},s):(e.arrays=[].concat(e.arrays,{data:n}),e.arrays.length-1)},t.removeAllArrays=()=>{e.arrays=[]},t.removeArray=n=>{let a=e.arrays.findIndex(i=>i.data.getName()===n);return t.removeArrayByIndex(a)},t.removeArrayByIndex=n=>n!==-1&&n<e.arrays.length?(e.arrays.splice(n,1),!0):!1,t.getArrays=()=>e.arrays.map(n=>n.data),t.getArray=n=>typeof n=="number"?t.getArrayByIndex(n):t.getArrayByName(n),t.getArrayByName=n=>e.arrays.reduce((a,i,s)=>i.data.getName()===n?i.data:a,null),t.getArrayWithIndex=n=>{let a=e.arrays.findIndex(i=>i.data.getName()===n);return{array:a!==-1?e.arrays[a].data:null,index:a}},t.getArrayByIndex=n=>n>=0&&n<e.arrays.length?e.arrays[n].data:null,t.hasArray=n=>t.getArrayWithIndex(n).index>=0,t.getArrayName=n=>{let a=e.arrays[n];return a?a.data.getName():""},t.getCopyFieldFlags=()=>e.copyFieldFlags,t.getFlag=n=>e.copyFieldFlags[n],t.passData=(n,a=-1,i=-1)=>{n.getArrays().forEach(s=>{let o=t.getFlag(s.getName());if(o!==!1&&!(e.doCopyAllOff&&o!==!0)&&s){let c=t.getArrayByName(s.getName());if(c)if(s.getNumberOfComponents()===c.getNumberOfComponents())if(a>-1&&a<s.getNumberOfTuples()){let f=i>-1?i:a;c.insertTuple(f,s.getTuple(a))}else c.insertTuples(0,s.getTuples());else gl("Unhandled case in passData");else if(a<0||a>s.getNumberOfTuples())t.addArray(s),n.getAttributes(s).forEach(f=>{t.setAttribute(s,f)});else{let f=s.getNumberOfComponents(),u=s.getNumberOfValues(),g=i>-1?i:a;u<=g*f&&(u=(g+1)*f),c=Z.newInstance({name:s.getName(),dataType:s.getDataType(),numberOfComponents:f,values:w.newTypedArray(s.getDataType(),u),size:0}),c.insertTuple(g,s.getTuple(a)),t.addArray(c),n.getAttributes(s).forEach(l=>{t.setAttribute(c,l)})}}})},t.interpolateData=(n,a=-1,i=-1,s=-1,o=.5)=>{n.getArrays().forEach(c=>{let f=t.getFlag(c.getName());if(f!==!1&&!(e.doCopyAllOff&&f!==!0)&&c){let u=t.getArrayByName(c.getName());if(u)if(c.getNumberOfComponents()===u.getNumberOfComponents())if(a>-1&&a<c.getNumberOfTuples()){let g=s>-1?s:a;u.interpolateTuple(g,c,a,c,i,o),lx("Unexpected case in interpolateData")}else u.insertNextTuples(c.getTuples());else gl("Unhandled case in interpolateData");else if(a<0||i<0||a>c.getNumberOfTuples())t.addArray(c),n.getAttributes(c).forEach(g=>{t.setAttribute(c,g)});else{let g=c.getNumberOfComponents(),l=c.getNumberOfValues(),h=s>-1?s:a;l<=h*g&&(l=(h+1)*g),u=Z.newInstance({name:c.getName(),dataType:c.getDataType(),numberOfComponents:g,values:w.newTypedArray(c.getDataType(),l),size:0}),u.interpolateTuple(h,c,a,c,i,o),t.addArray(u),n.getAttributes(c).forEach(y=>{t.setAttribute(u,y)})}}})},t.copyFieldOn=n=>{e.copyFieldFlags[n]=!0},t.copyFieldOff=n=>{e.copyFieldFlags[n]=!1},t.copyAllOn=()=>{(!e.doCopyAllOn||e.doCopyAllOff)&&(e.doCopyAllOn=!0,e.doCopyAllOff=!1,t.modified())},t.copyAllOff=()=>{(e.doCopyAllOn||!e.doCopyAllOff)&&(e.doCopyAllOn=!1,e.doCopyAllOff=!0,t.modified())},t.clearFieldFlags=()=>{e.copyFieldFlags={}},t.deepCopy=n=>{e.arrays=n.getArrays().map(a=>{let i=a.newClone();return i.deepCopy(a),{data:i}})},t.copyFlags=n=>n.getCopyFieldFlags().map(a=>a),t.reset=()=>e.arrays.forEach(n=>n.data.reset()),t.getMTime=()=>e.arrays.reduce((n,a)=>a.data.getMTime()>n?a.data.getMTime():n,e.mtime),t.getNumberOfComponents=()=>e.arrays.reduce((n,a)=>n+a.data.getNumberOfComponents(),0),t.getNumberOfTuples=()=>e.arrays.length>0?e.arrays[0].getNumberOfTuples():0,t.getState=n=>{let a=r(n);return a&&(a.arrays=e.arrays.map(i=>({data:i.data.getState(n)}))),a}}var gx={arrays:[],copyFieldFlags:[],doCopyAllOn:!0,doCopyAllOff:!1};function hl(t,e,r={}){Object.assign(e,gx,r),w.obj(t,e),px(t,e)}var hx=w.newInstance(hl,"vtkFieldData"),vl={newInstance:hx,extend:hl};var vx={SCALARS:0,VECTORS:1,NORMALS:2,TCOORDS:3,TENSORS:4,GLOBALIDS:5,PEDIGREEIDS:6,EDGEFLAG:7,NUM_ATTRIBUTES:8},dx={MAX:0,EXACT:1,NOLIMIT:2},Tx={DUPLICATECELL:1,HIGHCONNECTIVITYCELL:2,LOWCONNECTIVITYCELL:4,REFINEDCELL:8,EXTERIORCELL:16,HIDDENCELL:32},mx={DUPLICATEPOINT:1,HIDDENPOINT:2},yx={COPYTUPLE:0,INTERPOLATE:1,PASSDATA:2,ALLCOPY:3},Sx="vtkGhostType",xx={DEFAULT:0,SINGLE:1,DOUBLE:2},ao={AttributeCopyOperations:yx,AttributeLimitTypes:dx,AttributeTypes:vx,CellGhostTypes:Tx,DesiredOutputPrecision:xx,PointGhostTypes:mx,ghostArrayName:Sx};var{AttributeTypes:lr,AttributeCopyOperations:Ur}=ao,{vtkWarningMacro:ti}=w;function Cx(t,e){let r=["Scalars","Vectors","Normals","TCoords","Tensors","GlobalIds","PedigreeIds"];function n(s){let o=r.find(c=>lr[c.toUpperCase()]===s||typeof s!="number"&&c.toLowerCase()===s.toLowerCase());return typeof o>"u"&&(o=null),o}e.classHierarchy.push("vtkDataSetAttributes");let a={...t};t.checkNumberOfComponents=s=>!0,t.setAttribute=(s,o)=>{let c=n(o);if(s&&c.toUpperCase()==="PEDIGREEIDS"&&!s.isA("vtkDataArray"))return ti(`Cannot set attribute ${c}. The attribute must be a vtkDataArray.`),-1;if(s&&!t.checkNumberOfComponents(s,c))return ti(`Cannot set attribute ${c}. Incorrect number of components.`),-1;if(s){let f=t.addArray(s);e[`active${c}`]=f}else e[`active${c}`]=-1;return t.modified(),e[`active${c}`]},t.getAttributes=s=>r.filter(o=>t[`get${o}`]()===s),t.setActiveAttributeByName=(s,o)=>t.setActiveAttributeByIndex(t.getArrayWithIndex(s).index,o),t.setActiveAttributeByIndex=(s,o)=>{let c=n(o);if(s>=0&&s<e.arrays.length){if(c.toUpperCase()!=="PEDIGREEIDS"){let f=t.getArrayByIndex(s);if(!f.isA("vtkDataArray"))return ti(`Cannot set attribute ${c}. Only vtkDataArray subclasses can be set as active attributes.`),-1;if(!t.checkNumberOfComponents(f,c))return ti(`Cannot set attribute ${c}. Incorrect number of components.`),-1}return e[`active${c}`]=s,t.modified(),s}return s===-1&&(e[`active${c}`]=s,t.modified()),-1},t.getActiveAttribute=s=>t[`get${n(s)}`](),t.removeAllArrays=()=>{r.forEach(s=>{e[`active${s}`]=-1}),a.removeAllArrays()},t.removeArrayByIndex=s=>(s!==-1&&r.forEach(o=>{s===e[`active${o}`]?e[`active${o}`]=-1:s<e[`active${o}`]&&(e[`active${o}`]-=1)}),a.removeArrayByIndex(s)),r.forEach(s=>{let o=`active${s}`;t[`get${s}`]=()=>t.getArrayByIndex(e[o]),t[`set${s}`]=c=>t.setAttribute(c,s),t[`setActive${s}`]=c=>t.setActiveAttributeByIndex(t.getArrayWithIndex(c).index,s),t[`copy${s}Off`]=()=>{let c=s.toUpperCase();e.copyAttributeFlags[Ur.PASSDATA][lr[c]]=!1},t[`copy${s}On`]=()=>{let c=s.toUpperCase();e.copyAttributeFlags[Ur.PASSDATA][lr[c]]=!0}}),t.initializeAttributeCopyFlags=()=>{e.copyAttributeFlags=[],Object.keys(Ur).filter(s=>s!=="ALLCOPY").forEach(s=>{e.copyAttributeFlags[Ur[s]]=Object.keys(lr).filter(o=>o!=="NUM_ATTRIBUTES").reduce((o,c)=>(o[lr[c]]=!0,o),[])}),e.copyAttributeFlags[Ur.COPYTUPLE][lr.GLOBALIDS]=!1,e.copyAttributeFlags[Ur.INTERPOLATE][lr.GLOBALIDS]=!1,e.copyAttributeFlags[Ur.COPYTUPLE][lr.PEDIGREEIDS]=!1},t.initialize=w.chain(t.initialize,t.initializeAttributeCopyFlags),e.dataArrays&&Object.keys(e.dataArrays).length&&Object.keys(e.dataArrays).forEach(s=>{!e.dataArrays[s].ref&&e.dataArrays[s].type==="vtkDataArray"&&t.addArray(Z.newInstance(e.dataArrays[s]))});let i=t.shallowCopy;t.shallowCopy=(s,o)=>{i(s,o),e.arrays=s.getArrays().map(c=>{let f=c.newClone();return f.shallowCopy(c,o),{data:f}})},t.initializeAttributeCopyFlags()}var Ox={activeScalars:-1,activeVectors:-1,activeTensors:-1,activeNormals:-1,activeTCoords:-1,activeGlobalIds:-1,activePedigreeIds:-1};function dl(t,e,r={}){Object.assign(e,Ox,r),vl.extend(t,e,r),w.setGet(t,e,["activeScalars","activeNormals","activeTCoords","activeVectors","activeTensors","activeGlobalIds","activePedigreeIds"]),e.arrays||(e.arrays={}),Cx(t,e)}var wx=w.newInstance(dl,"vtkDataSetAttributes"),io={newInstance:wx,extend:dl,...ao};var Rx={UNIFORM:0,DATA_OBJECT_FIELD:0,COORDINATE:1,POINT_DATA:1,POINT:2,POINT_FIELD_DATA:2,CELL:3,CELL_FIELD_DATA:3,VERTEX:4,VERTEX_FIELD_DATA:4,EDGE:5,EDGE_FIELD_DATA:5,ROW:6,ROW_DATA:6},Ex={FIELD_ASSOCIATION_POINTS:0,FIELD_ASSOCIATION_CELLS:1,FIELD_ASSOCIATION_NONE:2,FIELD_ASSOCIATION_POINTS_THEN_CELLS:3,FIELD_ASSOCIATION_VERTICES:4,FIELD_ASSOCIATION_EDGES:5,FIELD_ASSOCIATION_ROWS:6,NUMBER_OF_ASSOCIATIONS:7},Tl={FieldDataTypes:Rx,FieldAssociations:Ex};var kn=["pointData","cellData","fieldData"];function Mx(t,e){e.classHierarchy.push("vtkDataSet"),kn.forEach(a=>{e[a]?e[a]=Ze(e[a]):e[a]=io.newInstance()}),t.computeBounds=()=>{if(e.modifiedTime&&e.computeTime&&e.modifiedTime>e.computeTime||!e.computeTime){let a=t.getPoints();a?.getNumberOfPoints()?q.setBounds(e.bounds,a.getBoundsByReference()):e.bounds=Oe.createUninitializedBounds(),e.computeTime=w.getCurrentGlobalMTime()}},t.getLength2=()=>{let a=t.getBoundsByReference();return!a||a.length!==6?0:q.getDiagonalLength2(a)},t.getLength=()=>Math.sqrt(t.getLength2()),t.getCenter=()=>{let a=t.getBoundsByReference();return!a||a.length!==6?[0,0,0]:q.getCenter(a)},t.getCellBounds=a=>{let i=t.getCell(a);return i?i.getBounds():Oe.createUninitializedBounds()},t.getBounds=w.chain(()=>t.computeBounds,t.getBounds),t.getBoundsByReference=w.chain(()=>t.computeBounds,t.getBoundsByReference);let r=t.shallowCopy;t.shallowCopy=(a,i=!1)=>{r(a,i),kn.forEach(s=>{e[s]=io.newInstance(),e[s].shallowCopy(a.getReferenceByName(s))})};let n=t.getMTime;t.getMTime=()=>kn.reduce((a,i)=>Math.max(a,e[i]?.getMTime()??a),n()),t.initialize=()=>(kn.forEach(a=>e[a]?.initialize()),t)}var Dx={};function ml(t,e,r={}){Object.assign(e,Dx,r),w.obj(t,e),w.setGet(t,e,kn),w.getArray(t,e,["bounds"],6),Mx(t,e)}var Vx=w.newInstance(ml,"vtkDataSet"),yt={newInstance:Vx,extend:ml,...Tl};function Lx(t,e){e.classHierarchy.push("vtkPointSet"),e.points?e.points=Ze(e.points):e.points=Fr.newInstance(),t.getNumberOfPoints=()=>e.points.getNumberOfPoints(),t.getBounds=()=>e.points?.getBounds(),t.computeBounds=()=>{e.points?.computeBounds()};let r=t.shallowCopy;t.shallowCopy=(i,s=!1)=>{r(i,s),e.points=Fr.newInstance(),e.points.shallowCopy(i.getPoints())};let n=t.getMTime;t.getMTime=()=>{let i=n();return Math.max(i,e.points?.getMTime()??i)};let a=t.initialize;t.initialize=()=>(e.points?.initialize(),a())}var _x={};function yl(t,e,r={}){Object.assign(e,_x,r),yt.extend(t,e,r),w.setGet(t,e,["points"]),Lx(t,e)}var Bx=w.newInstance(yl,"vtkPointSet"),Sl={newInstance:Bx,extend:yl};function Fx(t,e){e.classHierarchy.push("vtkPolyLine");let r=Ue.newInstance();r.getPoints().setNumberOfPoints(2),t.getCellDimension=()=>1,t.intersectWithLine=(n,a,i,s,o,c,f)=>{let u={intersect:0,t:Number.MAX_VALUE,subId:0,betweenPoints:null},g=t.getNumberOfPoints()-1,l=Number.MAX_VALUE,h=[0,0,0],y=[0,0,0];for(let p=0;p<g;p++){let m=[0,0,0];r.getPoints().getData().set(e.points.getData().subarray(3*p,3*(p+2)));let d=r.intersectWithLine(i,s,o,c,f);if(d.intersect===1&&d.t<=u.t+o&&d.t>=n&&d.t<=a){u.intersect=1;let x=r.getParametricDistance(m);if(x<l||x===l&&d.t<u.t){u.subId=p,u.t=d.t,l=x;for(let T=0;T<3;T++)h[T]=c[T],y[T]=m[T]}}}return u},t.evaluateLocation=(n,a,i,s)=>(r.getPoints().getData().set(e.points.getData().subarray(3*n,3*(n+2))),r.evaluateLocation(a,i,s)),t.evaluateOrientation=(n,a,i,s)=>(e.orientations?r.setOrientations([e.orientations[n],e.orientations[n+1]]):r.setOrientations(null),r.evaluateOrientation(a,i,s)),t.getDistancesToFirstPoint=()=>{let n=e.distancesTime.getMTime();if(n<e.points.getMTime()||n<t.getMTime()){let a=t.getNumberOfPoints();if(e.distances?e.distances.length=a:e.distances=new Array(a),a>0){let i=new Array(3),s=new Array(3),o=0;e.distances[0]=o,e.points.getPoint(0,i);for(let c=1;c<a;++c)e.points.getPoint(c,s),o+=e.distanceFunction(i,s),e.distances[c]=o,W.copy(i,s)}e.distancesTime.modified()}return e.distances},t.findPointIdAtDistanceFromFirstPoint=n=>{let a=t.getDistancesToFirstPoint();if(a.length<2)return-1;let i=0,s=a.length-1;if(n<a[i]||n>a[s]||a[s]===0)return-1;for(;s-i>1;){let o=Math.floor((i+s)/2);a[o]<=n?i=o:s=o}return i}}var Ux={orientations:null,distanceFunction:W.dist};function xl(t,e,r={}){Object.assign(e,Ux,r),pt.extend(t,e,r),w.setGet(t,e,["orientations","distanceFunction"]),e.distancesTime={},w.obj(e.distancesTime,{mtime:0}),Fx(t,e)}var Nx=w.newInstance(xl,"vtkPolyLine"),Cl={newInstance:Nx,extend:xl};function Gx(t,e){e.classHierarchy.push("vtkPriorityQueue"),t.push=(r,n)=>{let a=e.elements.findIndex(i=>i.priority>r);e.elements.splice(a,0,{priority:r,element:n})},t.pop=()=>e.elements.length>0?e.elements.shift().element:null,t.deleteById=r=>{e.elements=e.elements.filter(({element:n})=>n.id!==r)},t.length=()=>e.elements.length}var kx={elements:[]};function Ol(t,e,r={}){Object.assign(e,kx,r),w.obj(t,e),Gx(t,e)}var bx=w.newInstance(Ol,"vtkPriorityQueue"),wl={newInstance:bx,extend:Ol};var Rl=11920929e-14,El=1e-8,pr={FAILURE:-1,OUTSIDE:0,INSIDE:1,INTERSECTION:2,ON_LINE:3};function Ml(t,e,r,n,a){return(n[t]-r[t])*(a[e]-r[e])-(a[t]-r[t])*(n[e]-r[e])}function zx(t,e,r,n){if(t[0]<r[0]||t[0]>r[1]||t[1]<r[2]||t[1]>r[3]||t[2]<r[4]||t[2]>r[5])return pr.OUTSIDE;if(et(n)<=11920929e-14)return pr.FAILURE;let a=El*((r[1]-r[0])*(r[1]-r[0])+(r[3]-r[2])*(r[3]-r[2])+(r[5]-r[4])*(r[5]-r[4]));a*=a,a=a===0?Rl:a;let i=[],s=[];for(let u=0;u<e.length;){if(i[0]=e[u++],i[1]=e[u++],i[2]=e[u++],ze(t,i)<=a)return pr.INSIDE;let{distance:g,t:l}=Ue.distanceToLine(t,i,s);if(g<=a&&l>0&&l<1)return pr.INSIDE}let o,c;Math.abs(n[0])>Math.abs(n[1])?Math.abs(n[0])>Math.abs(n[2])?(o=1,c=2):(o=0,c=1):Math.abs(n[1])>Math.abs(n[2])?(o=0,c=2):(o=0,c=1);let f=0;for(let u=0;u<e.length;)i[0]=e[u++],i[1]=e[u++],i[2]=e[u++],u<e.length?(s[0]=e[u],s[1]=e[u+1],s[2]=e[u+2]):(s[0]=e[0],s[1]=e[1],s[2]=e[2]),i[c]<=t[c]?s[c]>t[c]&&Ml(o,c,i,s,t)>0&&++f:s[c]<=t[c]&&Ml(o,c,i,s,t)<0&&--f;return f===0?pr.OUTSIDE:pr.INSIDE}function Wx(t,e,r){let n=t.length,a=[];e.getPoint(t[0],a),r[0]=a[0],r[1]=a[0],r[2]=a[1],r[3]=a[1],r[4]=a[2],r[5]=a[2];for(let s=1;s<n;s++)e.getPoint(t[s],a),q.addPoint(r,...a);let i=q.getLengths(r);return ee(i,i)}function Ix(t,e,r){r.length=3,r[0]=0,r[1]=0,r[2]=0;let n=[],a=[],i=[],s=[],o=[];e.getPoint(t[0],n),e.getPoint(t[1],a);for(let c=2;c<t.length;c++){e.getPoint(t[c],i),De(i,a,s),De(n,a,o);let f=[0,0,0];Ge(s,o,f),Zt(r,f,r),[a,i]=[i,a]}return et(r)}function Hx(t,e,r=[0,0,0]){r[0]=0,r[1]=0,r[2]=0;let n=t.length,a=[];for(let i=0;i<n;i++)e.getPoint(t[i],a),r[0]+=a[0],r[1]+=a[1],r[2]+=a[2];return r[0]/=n,r[1]/=n,r[2]/=n,r}var jx={PolygonWithPointIntersectionState:pr,pointInPolygon:zx,getBounds:Wx,getNormal:Ix,computeCentroid:Hx};function Px(t,e){e.classHierarchy.push("vtkPolygon");function r(){let o=[0,0,0],c=[0,0,0];e.normal=[0,0,0];let f=[...e.firstPoint.point],u=e.firstPoint;for(let g=0;g<e.pointCount;g++){De(u.point,f,o),De(u.next.point,f,c);let l=[0,0,0];Ge(o,c,l),Zt(e.normal,l,e.normal),u=u.next}return et(e.normal)}function n(o){let c=[0,0,0],f=[0,0,0],u=[0,0,0],g=[0,0,0];De(o.point,o.previous.point,c),De(o.next.point,o.point,f),De(o.previous.point,o.next.point,u),Ge(c,f,g);let l=ee(g,e.normal);if(l<=0)return-1;let h=ft(c)+ft(f)+ft(u);return h*h/l}function a(o){if(e.pointCount<=3)return!0;let c=o.previous,f=o.next,u=[0,0,0];De(f.point,c.point,u);let g=[0,0,0];if(Ge(u,e.normal,g),et(g),ft(g)===0)return!1;let l=lt.evaluate(g,c.point,f.next.point),h=l>1e-6?1:l<-1e-6?-1:0,y=h<0?1:0;for(let p=f.next.next;p.id!==c.id;p=p.next){let m=p.previous;l=lt.evaluate(g,c.point,p.point);let d=l>1e-6?1:l<-1e-6?-1:0;if(d!==h){if(y||(y=d<=0?1:0),Ue.intersection(c.point,f.point,p.point,m.point,[0],[0])===ro.YES_INTERSECTION)return!1;h=d}}return y===1}function i(o,c){e.pointCount-=1;let f=o.previous,u=o.next;e.tris=e.tris.concat(o.point),e.tris=e.tris.concat(u.point),e.tris=e.tris.concat(f.point),f.next=u,u.previous=f,c.deleteById(f.id),c.deleteById(u.id);let g=n(f);g>0&&c.push(g,f);let l=n(u);l>0&&c.push(l,u),o.id===e.firstPoint.id&&(e.firstPoint=u)}function s(){r();let o=wl.newInstance(),c=e.firstPoint;for(let f=0;f<e.pointCount;f++){let u=n(c);u>0&&o.push(u,c),c=c.next}for(;e.pointCount>2&&o.length()>0;)if(e.pointCount===o.length())i(o.pop(),o);else{let f=o.pop();a(f)&&i(f,o)}return e.pointCount<=2}t.triangulate=()=>e.firstPoint?s():null,t.setPoints=o=>{e.pointCount=o.length,e.firstPoint={id:0,point:o[0],next:null,previous:null};let c=e.firstPoint;for(let f=1;f<e.pointCount;f++)c.next={id:f,point:o[f],next:null,previous:c},c=c.next;e.firstPoint.previous=c,c.next=e.firstPoint},t.getPointArray=()=>e.tris}var $x={firstPoint:null,pointCount:0,tris:[]};function Dl(t,e,r={}){Object.assign(e,$x,r),w.obj(t,e),Px(t,e)}var Ax=w.newInstance(Dl,"vtkPolygon"),Vl={newInstance:Ax,extend:Dl,...jx};function so(t,e,r,n){let a=r[0]-e[0],i=r[1]-e[1],s=r[2]-e[2],o=t[0]-e[0],c=t[1]-e[1],f=t[2]-e[2];n[0]=i*f-s*c,n[1]=s*o-a*f,n[2]=a*c-i*o}function bn(t,e,r,n){so(t,e,r,n);let a=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);a!==0&&(n[0]/=a,n[1]/=a,n[2]/=a)}function Ll(t){t[0]=-1,t[1]=1,t[2]=0,t[3]=-1,t[4]=0,t[5]=1}function Kx(t,e,r,n,a,i,s=1e-6){let o=!1,c=[],f=[],u=[],g=[],l=[];bn(t,e,r,g),bn(n,a,i,l);let h=-ee(g,t),y=-ee(l,n),p=[ee(l,t)+y,ee(l,e)+y,ee(l,r)+y];if(p[0]*p[1]>s&&p[0]*p[2]>s)return{intersect:!1,coplanar:o,pt1:c,pt2:f,surfaceId:u};let m=[ee(g,n)+h,ee(g,a)+h,ee(g,i)+h];if(m[0]*m[1]>s&&m[0]*m[2]>s)return{intersect:!1,coplanar:o,pt1:c,pt2:f,surfaceId:u};if(Math.abs(g[0]-l[0])<1e-9&&Math.abs(g[1]-l[1])<1e-9&&Math.abs(g[2]-l[2])<1e-9&&Math.abs(h-y)<1e-9)return o=!0,{intersect:!1,coplanar:o,pt1:c,pt2:f,surfaceId:u};let d=[t,e,r],x=[n,a,i],T=ee(g,l),v=(h-y*T)/(T*T-1),C=(y-h*T)/(T*T-1),O=[v*g[0]+C*l[0],v*g[1]+C*l[1],v*g[2]+C*l[2]],M=Ge(g,l,[]);et(M);let S=0,E=0,R=[],D=[],V=50,U=50;for(let N=0;N<3;N++){let k=N,F=(N+1)%3,G=lt.intersectWithLine(d[k],d[F],n,l);G.intersection&&G.t>0-s&&G.t<1+s&&(G.t<1+s&&G.t>1-s&&(V=S),R[S++]=ee(G.x,M)-ee(O,M));let b=lt.intersectWithLine(x[k],x[F],t,g);b.intersection&&b.t>0-s&&b.t<1+s&&(b.t<1+s&&b.t>1-s&&(U=E),D[E++]=ee(b.x,M)-ee(O,M))}if(S>2){S--;let N=R[2];R[2]=R[V],R[V]=N}if(E>2){E--;let N=D[2];D[2]=D[U],D[U]=N}if(S!==2||E!==2)return{intersect:!1,coplanar:o,pt1:c,pt2:f,surfaceId:u};if(Number.isNaN(R[0])||Number.isNaN(R[1])||Number.isNaN(D[0])||Number.isNaN(D[1]))return{intersect:!1,coplanar:o,pt1:c,pt2:f,surfaceId:u};if(R[0]>R[1]){let N=R[1];R[1]=R[0],R[0]=N}if(D[0]>D[1]){let N=D[1];D[1]=D[0],D[0]=N}let B,_;return R[1]<D[0]||D[1]<R[0]?{intersect:!1,coplanar:o,pt1:c,pt2:f,surfaceId:u}:(R[0]<D[0]?R[1]<D[1]?(u[0]=2,u[1]=1,B=D[0],_=R[1]):(u[0]=2,u[1]=2,B=D[0],_=D[1]):R[1]<D[1]?(u[0]=1,u[1]=1,B=R[0],_=R[1]):(u[0]=1,u[1]=2,B=R[0],_=D[1]),_a(O,M,B,c),_a(O,M,_,f),{intersect:!0,coplanar:o,pt1:c,pt2:f,surfaceId:u})}var Xx=[[0,1],[1,2],[2,0]],Yx=[1,2,4],qx=[[-1,-1,-1,-1,-1,-1,-1],[0,2,100,-1,-1,-1,-1],[1,0,101,-1,-1,-1,-1],[1,2,100,1,100,101,-1],[2,1,102,-1,-1,-1,-1],[0,1,102,102,100,0,-1],[0,101,2,2,101,102,-1],[100,101,102,-1,-1,-1,-1]],Zx={computeNormalDirection:so,computeNormal:bn,interpolationDerivs:Ll,intersectWithTriangle:Kx};function Qx(t,e){e.classHierarchy.push("vtkTriangle"),t.getCellDimension=()=>2,t.intersectWithLine=(r,n,a,i,s)=>{let o={subId:0,t:Number.MAX_VALUE,intersect:0,betweenPoints:!1};s[2]=0;let c=[],f=a*a,u=[],g=[],l=[];e.points.getPoint(0,u),e.points.getPoint(1,g),e.points.getPoint(2,l);let h=[],y=[];if(bn(u,g,l,h),h[0]!==0||h[1]!==0||h[2]!==0){let T=lt.intersectWithLine(r,n,u,h);if(o.betweenPoints=T.betweenPoints,o.t=T.t,i[0]=T.x[0],i[1]=T.x[1],i[2]=T.x[2],!T.intersection)return s[0]=0,s[1]=0,o.intersect=0,o;let v=t.evaluatePosition(i,c,s,y);if(v.evaluation>=0)return v.dist2<=f?(o.intersect=1,o):(o.intersect=v.evaluation,o)}let p=ze(u,g),m=ze(g,l),d=ze(l,u);e.line||(e.line=Ue.newInstance()),p>m&&p>d?(e.line.getPoints().setPoint(0,u),e.line.getPoints().setPoint(1,g)):m>d&&m>p?(e.line.getPoints().setPoint(0,g),e.line.getPoints().setPoint(1,l)):(e.line.getPoints().setPoint(0,l),e.line.getPoints().setPoint(1,u));let x=e.line.intersectWithLine(r,n,a,i,s);if(o.betweenPoints=x.betweenPoints,o.t=x.t,x.intersect){let T=[],v=[],C=[];for(let O=0;O<3;O++)T[O]=u[O]-l[O],v[O]=g[O]-l[O],C[O]=i[O]-l[O];return s[0]=ee(C,T)/d,s[1]=ee(C,v)/m,o.intersect=1,o}return s[0]=0,s[1]=0,o.intersect=0,o},t.evaluatePosition=(r,n,a,i)=>{let s={subId:0,dist2:0,evaluation:-1},o,c,f=[],u=[],g=[],l=[],h,y=[],p=[],m=[],d=0,x=0,T=[],v,C,O,M=[],S=[],E=[],R=[];s.subId=0,a[2]=0,e.points.getPoint(1,f),e.points.getPoint(2,u),e.points.getPoint(0,g),so(f,u,g,l),lt.generalizedProjectPoint(r,f,l,R);let D=0;for(o=0;o<3;o++)l[o]<0?h=-l[o]:h=l[o],h>D&&(D=h,x=o);for(c=0,o=0;o<3;o++)o!==x&&(T[c++]=o);for(o=0;o<2;o++)y[o]=R[T[o]]-g[T[o]],p[o]=f[T[o]]-g[T[o]],m[o]=u[T[o]]-g[T[o]];if(d=Re(p,m),d===0)return a[0]=0,a[1]=0,s.evaluation=-1,s;if(a[0]=Re(y,m)/d,a[1]=Re(p,y)/d,i[0]=1-(a[0]+a[1]),i[1]=a[0],i[2]=a[1],i[0]>=0&&i[0]<=1&&i[1]>=0&&i[1]<=1&&i[2]>=0&&i[2]<=1)n&&(s.dist2=ze(R,r),n[0]=R[0],n[1]=R[1],n[2]=R[2]),s.evaluation=1;else{if(n)if(i[1]<0&&i[2]<0)for(v=ze(r,g),C=Ue.distanceToLine(r,f,g,S),O=Ue.distanceToLine(r,g,u,E),v<C?(s.dist2=v,M=g):(s.dist2=C,M=S),O<s.dist2&&(s.dist2=O,M=E),o=0;o<3;o++)n[o]=M[o];else if(i[2]<0&&i[0]<0)for(v=ze(r,f),C=Ue.distanceToLine(r,f,g,S),O=Ue.distanceToLine(r,f,u,E),v<C?(s.dist2=v,M=f):(s.dist2=C,M=S),O<s.dist2&&(s.dist2=O,M=E),o=0;o<3;o++)n[o]=M[o];else if(i[1]<0&&i[0]<0)for(v=ze(r,u),C=Ue.distanceToLine(r,u,g,S),O=Ue.distanceToLine(r,f,u,E),v<C?(s.dist2=v,M=u):(s.dist2=C,M=S),O<s.dist2&&(s.dist2=O,M=E),o=0;o<3;o++)n[o]=M[o];else i[0]<0?s.dist2=Ue.distanceToLine(r,f,u,n).distance:i[1]<0?s.dist2=Ue.distanceToLine(r,u,g,n).distance:i[2]<0&&(s.dist2=Ue.distanceToLine(r,f,g,n).distance);s.evaluation=0}return s},t.evaluateLocation=(r,n,a)=>{let i=[],s=[],o=[];e.points.getPoint(0,i),e.points.getPoint(1,s),e.points.getPoint(2,o);let c=1-r[0]-r[1];for(let f=0;f<3;f++)n[f]=i[f]*c+s[f]*r[0]+o[f]*r[1];a[0]=c,a[1]=r[0],a[2]=r[1]},t.getParametricDistance=r=>{let n,a=0,i=[];i[0]=r[0],i[1]=r[1],i[2]=1-r[0]-r[1];for(let s=0;s<3;s++)i[s]<0?n=-i[s]:i[s]>1?n=i[s]-1:n=0,n>a&&(a=n);return a},t.derivatives=(r,n,a,i,s)=>{let o=e.points.getPoint(0),c=e.points.getPoint(1),f=e.points.getPoint(2),u=[],g=[],l=[],h=[];bn(o,c,f,u),De(c,o,g),De(f,o,h),Ge(u,g,l);let y=et(g);if(y<=0||et(l)<=0){for(let C=0;C<i;C++)for(let O=0;O<3;O++)s[C*i+O]=0;return}let p=[0,0],m=[y,0],d=[ee(h,g),ee(h,l)],x=new Array(6);Ll(x);let T=[m[0]-p[0],m[1]-p[1],d[0]-p[0],d[1]-p[1]],v=w.newTypedArray(Ie.Float64Array,4);Na(T,v,2);for(let C=0;C<i;C++){let O=0,M=0;for(let R=0;R<3;R++)O+=x[R]*a[i*R+C],M+=x[3+R]*a[i*R+C];let S=O*v[0]+M*v[1],E=O*v[2]+M*v[3];s[3*C]=S*g[0]+E*l[0],s[3*C+1]=S*g[1]+E*l[1],s[3*C+2]=S*g[2]+E*l[2]}},t.cellBoundary=(r,n,a)=>{let i=n[0]-n[1],s=.5*(1-n[0])-n[1],o=2*n[0]+n[1]-1;return i>=0&&s>=0?(a[0]=e.pointsIds[0],a[1]=e.pointsIds[1]):s<0&&o>=0?(a[0]=e.pointsIds[1],a[1]=e.pointsIds[2]):(a[0]=e.pointsIds[2],a[1]=e.pointsIds[0]),!(n[0]<0||n[1]<0||n[0]>1||n[1]>1||1-n[0]-n[1]<0)},t.clip=(r,n,a,i,s,o,c,f,u,g)=>{let l=0;for(let x=0;x<3;x++){let T=n.getComponent(x,0);(g&&T<=r||!g&&T>r)&&(l+=Yx[x])}let h=qx[l],y=[0,0,0],p=[0,0,0],m=[0,0,0],d=[0,0,0];for(let x=0;h[x]>-1;x+=3){d[0]=0,d[1]=0,d[2]=0;for(let T=0;T<3;T++){let v=h[x+T];if(v>=100){let C=v-100;e.points.getPoint(C,y);let{inserted:O,id:M}=a.insertUniquePoint(y);d[T]=M,O&&o.passData(s,e.pointsIds[C],M)}else{let C=Xx[v],O=C[0],M=C[1],S=n.getComponent(C[1],0)-n.getComponent(C[0],0);S<=0&&(O=C[1],M=C[0],S=-S);let E=S===0?0:(r-n.getComponent(O,0))/S;e.points.getPoint(O,p),e.points.getPoint(M,m);for(let V=0;V<3;V++)y[V]=p[V]+E*(m[V]-p[V]);let{inserted:R,id:D}=a.insertUniquePoint(y);d[T]=D,R&&o.interpolateData(s,e.pointsIds[O],e.pointsIds[M],D,E)}}if(!(d[0]===d[1]||d[0]===d[2]||d[1]===d[2])){let T=i.insertNextCell(d);u.passData(c,f,T)}}}}var Jx={};function _l(t,e,r={}){Object.assign(e,Jx,r),pt.extend(t,e,r),Qx(t,e)}var e1=w.newInstance(_l,"vtkTriangle"),an={newInstance:e1,extend:_l,...Zx};function Bl(){return{intersected:!1,subId:-1,x:[0,0,0],pCoords:[0,0,0],t:-1}}function t1(t,e){e.classHierarchy.push("vtkQuad"),t.getCellDimension=()=>2,t.getCellType=()=>he.VTK_QUAD,t.getNumberOfEdges=()=>4,t.getNumberOfFaces=()=>0,t.intersectWithLine=(r,n,a,i,s)=>{let o={subId:0,t:Number.MAX_VALUE,intersect:0,betweenPoints:!1},c,f=e.points.getPoint(0,[]),u=e.points.getPoint(1,[]),g=e.points.getPoint(2,[]),l=e.points.getPoint(3,[]),h=ze(f,g),y=ze(u,l);if(h===y){let O,M=0,S=0;for(let E=0;E<4;E++)O=e.pointsIds[E],O>M&&(M=O,S=E);S===0||S===2?c=0:c=1}else h<y?c=0:c=1;let p=null;e.triangle?p=e.triangle.getPoints():(e.triangle=an.newInstance(),p=Fr.newInstance(),p.setNumberOfPoints(3),e.triangle.initialize(p));let m,d=Bl(),x,T=Bl(),v,C;switch(c){case 0:p.setPoint(0,...f),p.setPoint(1,...u),p.setPoint(2,...g),m=e.triangle.intersectWithLine(r,n,a,d.x,d.pCoords),p.setPoint(0,...g),p.setPoint(1,...l),p.setPoint(2,...f),x=e.triangle.intersectWithLine(r,n,a,T.x,T.pCoords),v=m.intersect&&x.intersect?m.t<=x.t:m.intersect,C=m.intersect&&x.intersect?x.t<m.t:x.intersect,v?(o=m,i[0]=d.x[0],i[1]=d.x[1],i[2]=d.x[2],s[0]=d.pCoords[0]+d.pCoords[1],s[1]=d.pCoords[1],s[2]=d.pCoords[2]):C&&(o=x,i[0]=T.x[0],i[1]=T.x[1],i[2]=T.x[2],s[0]=1-(T.pCoords[0]+T.pCoords[1]),s[1]=1-T.pCoords[1],s[2]=T.pCoords[2]);break;case 1:p.setPoint(0,...f),p.setPoint(1,...u),p.setPoint(2,...l),m=e.triangle.intersectWithLine(r,n,a,d.x,d.pCoords),p.setPoint(0,...g),p.setPoint(1,...l),p.setPoint(2,...u),x=e.triangle.intersectWithLine(r,n,a,T.x,T.pCoords),v=m.intersect&&x.intersect?m.t<=x.t:m.intersect,C=m.intersect&&x.intersect?x.t<m.t:x.intersect,v?(o=m,i[0]=d.x[0],i[1]=d.x[1],i[2]=d.x[2],s[0]=d.pCoords[0],s[1]=d.pCoords[1],s[2]=d.pCoords[2]):C&&(o=x,i[0]=T.x[0],i[1]=T.x[1],i[2]=T.x[2],s[0]=1-T.pCoords[0],s[1]=1-T.pCoords[1],s[2]=T.pCoords[2])}return o},t.interpolationFunctions=(r,n)=>{let a=1-r[0],i=1-r[1];n[0]=a*i,n[1]=r[0]*i,n[2]=r[0]*r[1],n[3]=a*r[1]},t.evaluateLocation=(r,n,a)=>{let i=[];t.interpolationFunctions(r,a),n[0]=0,n[1]=0,n[2]=0;for(let s=0;s<4;s++){e.points.getPoint(s,i);for(let o=0;o<3;o++)n[o]+=i[o]*a[s]}}}var r1={};function Fl(t,e,r={}){Object.assign(e,r1,r),pt.extend(t,e,r),t1(t,e)}var n1=w.newInstance(Fl,"vtkQuad"),Ul={newInstance:n1,extend:Fl};var{vtkErrorMacro:Nl}=w;function a1(t){return()=>Nl(`vtkTriangleStrip.${t} - NOT IMPLEMENTED`)}function i1(t,e){if(!Array.isArray(t)||t.length<3){Nl("decomposeStrip - Invalid points array");return}let r=t[0],n=t[1];for(let a=0;a<t.length-2;a++){let i=t[a+2];a%2?e.insertNextCell([n,r,i]):e.insertNextCell([r,n,i]),r=n,n=i}}var s1={decomposeStrip:i1};function o1(t,e){e.classHierarchy.push("vtkTriangleStrip");let r=t.initialize;t.initialize=(n,a)=>{e.triangle.initialize(n,a),r(n,a)},t.getCellType=()=>he.VTK_TRIANGLE_STRIP,t.getCellDimension=()=>2,t.getNumberOfEdges=()=>e.pointsIds.length,t.getNumberOfFaces=()=>0,t.evaluatePosition=(n,a,i,s,o)=>{let c=[0,0,0],f=Number.MAX_VALUE,u=0,g=[],l=[],h=[];i[2]=0,l[0]=0,l[1]=0,l[2]=0;let y=e.triangle.getPoints();y.setNumberOfPoints(3);let p=e.triangle.getPointsIds().length;for(let m=0;m<p;m++)o[m]=0;for(let m=0;m<p-2;m++){let d=[];y.getPoint(m,d);let x=[];y.getPoint(m+1,x);let T=[];y.getPoint(m+2,T),y.setData(Float32Array.from([...d,...x,...T]),3);let v=e.triangle.evaluatePosition(n,h,c,g),C=v.dist2;v.evaluation>=0&&(C<f||C===f&&u===0)&&(u=v,a&&(a[0]=h[0],a[1]=h[1],a[2]=h[2]),i[0]=c[0],i[1]=c[1],f=C,l[0]=g[0],l[1]=g[1],l[2]=g[2])}return s[0]=f,o[0]=l[0],o[1]=l[1],o[2]=l[2],u},t.evaluateLocation=(n,a,i,s)=>{let o=[[0,1,2],[1,0,2]],c=n%2,f=e.pointsIds.length;for(let h=0;h<f;h++)s[h]=0;s[n]=1-a[0]-a[1],s[n+1]=a[0],s[n+2]=a[1];let u=[];e.points.getPoint(n+o[c][0],u);let g=[];e.points.getPoint(n+o[c][1],g);let l=[];e.points.getPoint(n+o[c][2],l);for(let h=0;h<3;h++)i[h]=u[h]*s[n]+g[h]*s[n+1]+l[h]*s[n+2]},t.cellBoundary=(n,a,i)=>{let s=[[0,1,2],[1,0,2]],o=n%2,c=e.triangle.getPointsIds();return c[0]=e.pointsIds[s[o][0]],c[1]=e.pointsIds[s[o][1]],c[2]=e.pointsIds[s[o][2]],e.triangle.cellBoundary(0,a,i)},t.getEdge=n=>{let a,i,s=e.pointsIds.length;return n===0?(a=0,i=1):n===s-1?(a=n-1,i=n):(a=n-1,i=n+1),e.line.getPointsIds()[0]=e.pointsIds[a],e.line.getPointsIds()[1]=e.pointsIds[i],e.line.getPoints().setPoint(0,e.points.getPoint(a)),e.line.getPoints().setPoint(1,e.points.getPoint(i)),e.line},t.intersectWithLine=(n,a,i,s,o)=>{let c=e.pointsIds.length-2,f=e.triangle.getPoints();f.setNumberOfPoints(3);for(let u=0;u<c;u++){let g=[];e.points.getPoint(e.pointsIds[u],g);let l=[];e.points.getPoint(e.pointsIds[u+1],l);let h=[];e.points.getPoint(e.pointsIds[u+2],h),f.setData(Float32Array.from([...g,...l,...h]),3);let y=e.triangle.intersectWithLine(n,a,i,s,o);if(y.intersect)return y}return!1},t.triangulate=()=>{let n=e.points.getNumberOfPoints()-2;e.tris=new Array(3*n);let a=[[0,1,2],[1,0,2]];for(let i=0;i<n;i++){let s=i%2;for(let o=0;o<3;o++)e.tris[i*3+o]=i+a[s][o]}return!0},t.getPointArray=()=>e.tris,t.derivatives=(n,a,i,s,o)=>{let c=[];e.points.getPoint(n,c);let f=[];e.points.getPoint(n+1,f);let u=[];e.points.getPoint(n+2,u);let g=e.triangle.getPoints();g.setPoint(0,...c),g.setPoint(1,...f),g.setPoint(2,...u),e.triangle.derivatives(0,a,i,s,o)},t.getParametricCenter=n=>(n[0]=.333333,n[1]=.333333,n[2]=0,Math.floor((e.pointsIds.length-2)/2)),t.contour=(n,a,i,s,o,c,f,u,g,l,h)=>a1("contour")(),t.clip=(n,a,i,s,o,c,f,u,g,l)=>{let h=e.points.getNumberOfPoints()-2,y=new Float32Array(3),p=a.newClone();p.setNumberOfComponents(a.getNumberOfComponents()),p.setData(y,a.getNumberOfComponents());let m=e.triangle.getPoints();m.setNumberOfPoints(3);let d=e.triangle.getPointsIds(),x=[0,0,0];for(let T=0;T<h;T++){let v=T,C=T+1,O=T+2;T%2&&(v=T+2,C=T+1,O=T),m.setPoint(0,...e.points.getPoint(v,x)),m.setPoint(1,...e.points.getPoint(C,x)),m.setPoint(2,...e.points.getPoint(O,x)),d[0]=e.pointsIds[v],d[1]=e.pointsIds[C],d[2]=e.pointsIds[O],y[0]=a.getComponent(v,0),y[1]=a.getComponent(C,0),y[2]=a.getComponent(O,0),e.triangle.clip(n,p,i,s,o,c,f,u,g,l)}}}var c1={line:null,triangle:null,tris:null};function Gl(t,e,r={}){Object.assign(e,c1,r),pt.extend(t,e,r),e.line||(e.line=Ue.newInstance()),e.triangle||(e.triangle=an.newInstance()),o1(t,e)}var f1=w.newInstance(Gl,"vtkTriangleStrip"),kl={newInstance:f1,extend:Gl,...s1};var Nr=["verts","lines","polys","strips"];var{vtkWarningMacro:bl}=w,u1={[he.VTK_LINE]:Ue,[he.VTK_QUAD]:Ul,[he.VTK_POLY_LINE]:Ue,[he.VTK_TRIANGLE]:an,[he.VTK_TRIANGLE_STRIP]:kl,[he.VTK_POLY_LINE]:Cl,[he.VTK_POLYGON]:Vl};function l1(t,e){e.classHierarchy.push("vtkPolyData");function r(o){return o.replace(/(?:^\w|[A-Z]|\b\w)/g,c=>c.toUpperCase()).replace(/\s+/g,"")}function n(){e.cells=void 0,e.links=void 0}Nr.forEach(o=>{t[`getNumberOf${r(o)}`]=()=>e[o].getNumberOfCells(),e[o]?e[o]=Ze(e[o]):e[o]=je.newInstance(),e[`_on${r(o)}Changed`]=n}),t.getNumberOfCells=()=>Nr.reduce((o,c)=>o+e[c].getNumberOfCells(),0);let a=t.shallowCopy;t.shallowCopy=(o,c=!1)=>{a(o,c),Nr.forEach(f=>{e[f]=je.newInstance(),e[f].shallowCopy(o.getReferenceByName(f))})};let i=t.getMTime;t.getMTime=()=>Nr.reduce((o,c)=>Math.max(o,e[c]?.getMTime()??o),i());let s=t.initialize;t.initialize=()=>(Nr.forEach(o=>e[o]?.initialize()),n(),s()),t.buildCells=()=>{let o=t.getNumberOfVerts(),c=t.getNumberOfLines(),f=t.getNumberOfPolys(),u=t.getNumberOfStrips(),g=o+c+f+u,l=new Uint8Array(g),h=l,y=new Uint32Array(g),p=y;if(o){let m=0;e.verts.getCellSizes().forEach((d,x)=>{p[x]=m,h[x]=d>1?he.VTK_POLY_VERTEX:he.VTK_VERTEX,m+=d+1}),p=p.subarray(o),h=h.subarray(o)}if(c){let m=0;e.lines.getCellSizes().forEach((d,x)=>{p[x]=m,h[x]=d>2?he.VTK_POLY_LINE:he.VTK_LINE,d===1&&bl("Building VTK_LINE ",x," with only one point, but VTK_LINE needs at least two points. Check the input."),m+=d+1}),p=p.subarray(c),h=h.subarray(c)}if(f){let m=0;e.polys.getCellSizes().forEach((d,x)=>{switch(p[x]=m,d){case 3:h[x]=he.VTK_TRIANGLE;break;case 4:h[x]=he.VTK_QUAD;break;default:h[x]=he.VTK_POLYGON}d<3&&bl("Building VTK_TRIANGLE ",x," with less than three points, but VTK_TRIANGLE needs at least three points. Check the input."),m+=d+1}),p+=p.subarray(f),h+=h.subarray(f)}if(u){let m=0;h.fill(he.VTK_TRIANGLE_STRIP,0,u),e.strips.getCellSizes().forEach((d,x)=>{p[x]=m,m+=d+1})}e.cells=ul.newInstance(),e.cells.setCellTypes(g,l,y)},t.buildLinks=(o=0)=>{e.cells==null&&t.buildCells(),e.links=cl.newInstance(),o>0?e.links.allocate(o):e.links.allocate(t.getPoints().getNumberOfPoints()),e.links.buildLinks(t)},t.getCellType=o=>e.cells.getCellType(o),t.getCellPoints=o=>{let c=t.getCellType(o),f=null;switch(c){case he.VTK_VERTEX:case he.VTK_POLY_VERTEX:f=e.verts;break;case he.VTK_LINE:case he.VTK_POLY_LINE:f=e.lines;break;case he.VTK_TRIANGLE:case he.VTK_QUAD:case he.VTK_POLYGON:f=e.polys;break;case he.VTK_TRIANGLE_STRIP:f=e.strips;break;default:return f=null,{type:0,cellPointIds:null}}let u=e.cells.getCellLocation(o);return{cellType:c,cellPointIds:f.getCell(u)}},t.getPointCells=o=>e.links.getCells(o),t.getCellEdgeNeighbors=(o,c,f)=>{let u=e.links.getLink(c),g=e.links.getLink(f);return u.cells.filter(l=>l!==o&&g.cells.indexOf(l)!==-1)},t.getCell=(o,c=null)=>{let f=t.getCellPoints(o),u=c||u1[f.cellType].newInstance();return u.initialize(t.getPoints(),f.cellPointIds),u},t.getMaxCellSize=()=>Nr.reduce((o,c)=>Math.max(o,e[c]?.getMaxCellSize?.()??0),0)}var p1={};function zl(t,e,r={}){Object.assign(e,p1,r),Sl.extend(t,e,r),w.get(t,e,["cells","links"]),w.setGet(t,e,["verts","lines","polys","strips"]),l1(t,e)}var g1=w.newInstance(zl,"vtkPolyData"),tt={newInstance:g1,extend:zl};var{vtkWarningMacro:h1}=w,oo;function v1(t,e){e.classHierarchy.push("vtkAbstractTransform","vtkHomogeneousTransform","vtkTransform"),t.transformPoint=(r,n)=>(W.transformMat4(n,r,e.matrix),n),t.transformPoints=(r,n)=>{let a=new Float64Array(3),i=new Float64Array(3);for(let s=0;s<r.length;s+=3)a[0]=r[s],a[1]=r[s+1],a[2]=r[s+2],W.transformMat4(i,a,e.matrix),n[s]=i[0],n[s+1]=i[1],n[s+2]=i[2];return n},t.preMultiply=()=>{t.setPreMultiplyFlag(!0)},t.postMultiply=()=>{t.setPreMultiplyFlag(!1)},t.transformMatrix=(r,n)=>(e.preMultiplyFlag?L.multiply(n,e.matrix,r):L.multiply(n,r,e.matrix),n),t.transformMatrices=(r,n)=>{let a=new Float64Array(16),i=new Float64Array(16),s=e.preMultiplyFlag?()=>L.multiply(i,e.matrix,a):()=>L.multiply(i,a,e.matrix);for(let o=0;o<r.length;o+=16){for(let c=0;c<16;++c)a[c]=r[o+c];s();for(let c=0;c<16;++c)n[o+c]=i[c]}return n},t.getInverse=()=>oo({matrix:Oe.invertMatrix(Array.from(e.matrix),[],4),preMultiplyFlag:e.preMultiplyFlag}),t.translate=(r,n,a)=>{if(r===0&&n===0&&a===0)return;let i=L.create();L.fromTranslation(i,[r,n,a]),e.preMultiplyFlag?L.multiply(e.matrix,e.matrix,i):L.multiply(e.matrix,i,e.matrix),t.modified()},t.rotateWXYZ=(r,n,a,i)=>{if(n===0&&a===0&&i===0){h1("No rotation applied, axis is zero vector.");return}if(r===0)return;let s=Oe.radiansFromDegrees(r),o=Me.create();Me.setAxisAngle(o,[n,a,i],s);let c=new Float64Array(16);L.fromQuat(c,o),e.preMultiplyFlag?L.multiply(e.matrix,e.matrix,c):L.multiply(e.matrix,c,e.matrix),t.modified()},t.rotateX=r=>{t.rotateWXYZ(r,1,0,0)},t.rotateY=r=>{t.rotateWXYZ(r,0,1,0)},t.rotateZ=r=>{t.rotateWXYZ(r,0,0,1)},t.scale=(r,n,a)=>{if(r===1&&n===1&&a===1)return;let i=L.create();L.fromScaling(i,[r,n,a]),e.preMultiplyFlag?L.multiply(e.matrix,e.matrix,i):L.multiply(e.matrix,i,e.matrix),t.modified()},t.transformNormal=(r,n=[])=>{let a=ne.fromMat4(ne.create(),e.matrix),i=ne.create();ne.invert(i,a);let s=ne.create();return ne.transpose(s,i),t.transformVector(r,n,s),Oe.normalize(n),n},t.transformNormals=(r,n)=>{let a=r.getData(),i=n.getData(),s=[0,0,0],o=ne.fromMat4(ne.create(),e.matrix),c=ne.create();ne.invert(c,o);let f=ne.create();ne.transpose(f,c);for(let u=0;u<a.length;u+=3)s[0]=a[u],s[1]=a[u+1],s[2]=a[u+2],t.transformVector(s,s,f),Oe.normalize(s),i[u]=s[0],i[u+1]=s[1],i[u+2]=s[2]},t.transformVector=(r,n=[],a=null)=>{let i=a||ne.fromMat4(ne.create(),e.matrix);return W.transformMat3(n,r,i),n},t.transformVectors=(r,n)=>{let a=r.getData(),i=n.getData(),s=[0,0,0];for(let o=0;o<a.length;o+=3)s[0]=a[o],s[1]=a[o+1],s[2]=a[o+2],t.transformVector(s,s),Oe.normalize(s),i[o]=s[0],i[o+1]=s[1],i[o+2]=s[2]},t.transformPointsNormalsVectors=(r,n,a,i,s,o,c=null,f=null)=>{let u=r.getNumberOfPoints(),g=c?.length??0,l=new Float64Array(3),h=new Float64Array(3),y=new Float64Array(3),p=new Float64Array(3),m=!1,d=!1,x=!1,T=[];for(let v=0;v<u;v++){if(r.getPoint(v,l),h.set(l),t.transformPoint(l,l),n.setPoint(v,...l),Oe.areEquals(h,l)||(m=!0),s){let C=s.getData(),O=o.getData();l[0]=C[v*3],l[1]=C[v*3+1],l[2]=C[v*3+2],y.set(l),t.transformVector(l,l),O[v*3]=l[0],O[v*3+1]=l[1],O[v*3+2]=l[2],Oe.areEquals(y,l)||(d=!0)}if(a){let C=a.getData(),O=i.getData();l[0]=C[v*3],l[1]=C[v*3+1],l[2]=C[v*3+2],p.set(l),t.transformNormal(l,l),O[v*3]=l[0],O[v*3+1]=l[1],O[v*3+2]=l[2],Oe.areEquals(p,l)||(x=!0)}if(c)for(let C=0;C<g;C++){let O=c[C].getData(),M=f[C].getData();l[0]=O[v*3],l[1]=O[v*3+1],l[2]=O[v*3+2],y.set(l),t.transformVector(l,l),M[v*3]=l[0],M[v*3+1]=l[1],M[v*3+2]=l[2],!Oe.arrayEqual(y,l)&&!T.includes(C)&&T.push(C)}}m&&n.modified(),d&&o.modified(),x&&i.modified(),T.forEach(v=>f[v].modified())}}var d1={preMultiplyFlag:!1,matrix:[...Yr]};function Wl(t,e,r={}){Object.assign(e,d1,r),w.obj(t,e),w.setGet(t,e,["preMultiplyFlag"]),w.setGetArray(t,e,["matrix"],16),v1(t,e)}oo=w.newInstance(Wl,"vtkTransform");var ri={newInstance:oo,extend:Wl};var{vtkErrorMacro:Il}=we;function T1(t){let e=t.getPolys().getData(),r=t.getStrips().getData(),n={cellSize:0,cell:[],done:!1,polyIdx:0,stripIdx:0,remainingStripLength:0,next(){if(n.polyIdx<e.length){n.cellSize=e[n.polyIdx];let a=n.polyIdx+1,i=a+n.cellSize;n.polyIdx=i;let s=0;for(let o=a;o<i;++o)n.cell[s++]=e[o]}else if(n.stripIdx<r.length){n.cellSize=3,n.remainingStripLength===0&&(n.remainingStripLength=r[n.stripIdx]-2,n.stripIdx+=3);let a=n.stripIdx-2,i=n.stripIdx+1;n.stripIdx++,n.remainingStripLength--;let s=0;for(let o=a;o<i;++o)n.cell[s++]=r[o]}else if(!n.done)n.done=!0;else throw new Error("Iterator is done")}};return n.next(),n}function m1(t,e){e.classHierarchy.push("vtkCutter");let r={...t};t.getMTime=()=>{let a=r.getMTime();return e.cutFunction&&(a=Math.max(a,e.cutFunction.getMTime())),a};function n(a,i){let s=a.getPoints(),o=s.getData(),c=a.getPointData(),f=s.getNumberOfPoints(),u=[],g=[],l=[],h={},y=M=>M-e.cutValue===0?0:M<e.cutValue?-1:1,p=c.getNumberOfArrays();for(let M=0;M<p;M++)h[c.getArrayName(M)]=[];(!e.cutScalars||e.cutScalars.length<f)&&(e.cutScalars=new Float32Array(f));let m=0,d=0;for(;m<o.length;)e.cutScalars[d++]=e.cutFunction.evaluateFunction(o[m++],o[m++],o[m++]);let x=[],T=new Array(3),v=new Array(3),C=[];for(let M=T1(a);!M.done;M.next()){if(M.cellSize<=2)continue;let S=null,E=null;for(let _=0;_<M.cellSize;_++)C[_]=e.cutScalars[M.cell[_]],S===null&&C[_]!==0&&(S=y(C[_]),E=_);let R=!0;for(let _=0;_<M.cell.length;_++)if(_!==E&&y(C[_])!==S){R=!1;break}if(R)continue;let D=[];for(let _=0;_<M.cellSize;_++){let N=_+1===M.cellSize?0:_+1,k=y(C[_]);if(y(C[N])===k)continue;let F=0,G=_,b=N;if(C[b]===0)G=N,b=_;else if(C[G]!==0){let $=C[b]-C[G];$<=0&&(G=N,b=_,$*=-1),$!==0&&(F=(e.cutValue-C[G])/$)}let z=M.cell[G],I=M.cell[b];T[0]=o[z*3],T[1]=o[z*3+1],T[2]=o[z*3+2],v[0]=o[I*3],v[1]=o[I*3+1],v[2]=o[I*3+2];let P=[T[0]+F*(v[0]-T[0]),T[1]+F*(v[1]-T[1]),T[2]+F*(v[2]-T[2])],Q={};for(let $=0;$<p;$++){let J=c.getArrayByIndex($),Y=c.getArrayName($),j=J.getData(),A=J.getNumberOfComponents(),se=new Array(A);for(let ae=0;ae<A;ae++){let ce=j[A*z+ae],ie=j[A*I+ae];se[ae]=ce+F*(ie-ce)}Q[Y]=se}D.push({pointEdge1:z,pointEdge2:I,intersectedPoint:P,intersectedArrays:Q,newPointID:-1})}let V=new Set,U=[];for(let _=0;_<D.length;_++){let N=D[_],k=!1;for(let G=0;G<x.length;G++){let b=x[G],z=N.pointEdge1===b.pointEdge1&&N.pointEdge2===b.pointEdge2,I=N.intersectedPoint[0]===b.intersectedPoint[0]&&N.intersectedPoint[1]===b.intersectedPoint[1]&&N.intersectedPoint[2]===b.intersectedPoint[2];if(z||I){k=!0,D[_].newPointID=b.newPointID;break}}k||(u.push(N.intersectedPoint[0]),u.push(N.intersectedPoint[1]),u.push(N.intersectedPoint[2]),Object.keys(N.intersectedArrays).forEach(G=>{h[G].push(...N.intersectedArrays[G])}),D[_].newPointID=u.length/3-1,x.push(D[_]));let F=D[_].newPointID;V.has(F)||(U.push(D[_]),V.add(F))}let B=U.length;B===2?g.push(B,U[0].newPointID,U[1].newPointID):B>2&&(l.push(B),U.forEach(_=>{l.push(_.newPointID)}))}i.getPoints().setData(da(s.getDataType(),u),3);let O=i.getPointData();for(let M=0;M<p;M++){let S=c.getArrayName(M),E=Z.newInstance({name:S,dataType:c.getArrayByIndex(M).getDataType(),values:h[S],numberOfComponents:c.getArrayByIndex(M).getNumberOfComponents()});O.addArray(E)}g.length!==0&&i.getLines().setData(Uint16Array.from(g)),l.length!==0&&i.getPolys().setData(Uint16Array.from(l))}t.requestData=(a,i)=>{let s=a[0];if(!s){Il("Invalid or missing input");return}if(!e.cutFunction){Il("Missing cut function");return}let o=i[0]?.initialize()||tt.newInstance();n(s,o),i[0]=o}}var y1={cutFunction:null,cutScalars:null,cutValue:0};function Hl(t,e,r={}){Object.assign(e,y1,r),pe(t,e),ya(t,e,1,1),de(t,e,["cutFunction","cutValue"]),m1(t,e)}var S1=ue(Hl,"vtkCutter"),ni={newInstance:S1,extend:Hl};var{vtkErrorMacro:x1}=w,C1=class{constructor(){this.segmentMapping={},this.segments=[null],this.faces=[]}addSegment(t){let e=t[0],r=t[t.length-1];if(e===r||t.length<2)return;let n=this.segmentMapping[e],a=this.segmentMapping[r];if(n!==void 0&&a!==void 0)if(Math.abs(n)===Math.abs(a)){let i=n<a?a:n,s=this.segments[i];if(n>0)for(let o=1;o<t.length-1;o++)s.push(t[o]);else for(let o=1;o<t.length-1;o++)s.unshift(t[t.length-1-o]);this.faces.push(s),this.segments[i]=null,this.segmentMapping[e]=void 0,this.segmentMapping[r]=void 0}else{let i=Math.abs(n),s=Math.abs(a),o=this.segments[i],c=this.segments[s];this.segments[i]=null,this.segments[s]=null,this.segmentMapping[o[0]]=void 0,this.segmentMapping[c[0]]=void 0,this.segmentMapping[o[o.length-1]]=void 0,this.segmentMapping[c[c.length-1]]=void 0,this.addSegment(t),this.addSegment(o),this.addSegment(c)}else if(n!==void 0){if(n>0){let i=this.segments[n];for(let s=1;s<t.length;s++)i.push(t[s]);this.segmentMapping[r]=n}else{let i=this.segments[-n];this.segmentMapping[r]=n;for(let s=1;s<t.length;s++)i.unshift(t[s])}this.segmentMapping[e]=void 0}else if(a!==void 0){if(a>0){let i=this.segments[a];for(let s=1;s<t.length;s++)i.push(t[t.length-1-s]);this.segmentMapping[e]=a}else{let i=this.segments[-a];this.segmentMapping[e]=a;for(let s=1;s<t.length;s++)i.unshift(t[t.length-s-1])}this.segmentMapping[r]=void 0}else{let i=this.segments.length;this.segments.push(t),this.segmentMapping[e]=-i,this.segmentMapping[r]=i}}};function O1(t,e){e.classHierarchy.push("vtkClosedPolyLineToSurfaceFilter"),t.requestData=(r,n)=>{let a=r[0];if(!a){x1("Invalid or missing input");return}let i=n[0]?.initialize()||tt.newInstance();i.shallowCopy(a);let s=new C1,o=a.getLines().getData(),c=0;for(;c<o.length;){let l=o[c++],h=[];for(let y=0;y<l;y++)h.push(o[c+y]);s.addSegment(h),c+=l}let{faces:f}=s,u=f.length;for(let l=0;l<f.length;l++)u+=f[l].length;let g=new Uint16Array(u);c=0;for(let l=0;l<f.length;l++){let h=f[l];g[c++]=h.length;for(let y=0;y<h.length;y++)g[c++]=h[y]}i.setPolys(je.newInstance({values:g,name:"faces"})),n[0]=i}}var w1={};function jl(t,e,r={}){Object.assign(e,w1,r),w.obj(t,e),w.algo(t,e,1,1),O1(t,e)}var R1=w.newInstance(jl,"vtkClosedPolyLineToSurfaceFilter"),ai={newInstance:R1,extend:jl};var E1=t=>t,Pl=1e-6,$l=class{constructor(t=!1){this.matrix=L.identity(new Float64Array(16)),this.tmp=new Float64Array(3),this.angleConv=t?Xt.toRadian:E1}rotateFromDirections(t,e){let r=new Float64Array(3),n=new Float64Array(3),a=new Float64Array(16);W.set(r,t[0],t[1],t[2]),W.set(n,e[0],e[1],e[2]),W.normalize(r,r),W.normalize(n,n);let i=W.dot(r,n);return i>=1?this:(W.cross(this.tmp,r,n),W.length(this.tmp)<Pl&&(W.cross(this.tmp,[1,0,0],t),W.length(this.tmp)<Pl&&W.cross(this.tmp,[0,1,0],t)),L.fromRotation(a,Math.acos(i),this.tmp),L.multiply(this.matrix,this.matrix,a),this)}rotate(t,e){return W.set(this.tmp,...e),W.normalize(this.tmp,this.tmp),L.rotate(this.matrix,this.matrix,this.angleConv(t),this.tmp),this}rotateX(t){return L.rotateX(this.matrix,this.matrix,this.angleConv(t)),this}rotateY(t){return L.rotateY(this.matrix,this.matrix,this.angleConv(t)),this}rotateZ(t){return L.rotateZ(this.matrix,this.matrix,this.angleConv(t)),this}translate(t,e,r){return W.set(this.tmp,t,e,r),L.translate(this.matrix,this.matrix,this.tmp),this}scale(t,e,r){return W.set(this.tmp,t,e,r),L.scale(this.matrix,this.matrix,this.tmp),this}multiply(t){return L.multiply(this.matrix,this.matrix,t),this}multiply3x3(t){return L.multiply(this.matrix,this.matrix,[t[0],t[1],t[2],0,t[3],t[4],t[5],0,t[6],t[7],t[8],0,0,0,0,1]),this}invert(){return L.invert(this.matrix,this.matrix),this}identity(){return L.identity(this.matrix),this}apply(t,e=0,r=-1){if(cr(Yr,this.matrix))return this;let n=r===-1?t.length:e+r*3;for(let a=e;a<n;a+=3)W.set(this.tmp,t[a],t[a+1],t[a+2]),W.transformMat4(this.tmp,this.tmp,this.matrix),t[a]=this.tmp[0],t[a+1]=this.tmp[1],t[a+2]=this.tmp[2];return this}getMatrix(){return this.matrix}setMatrix(t){return t&&t.length===16&&L.copy(this.matrix,t),this}};function M1(){return new $l(!0)}function D1(){return new $l(!1)}var zn={buildFromDegree:M1,buildFromRadian:D1};var V1=[2,0,1,2,2,3,2,4,5,2,6,7,2,0,2,2,1,3,2,4,6,2,5,7,2,0,4,2,1,5,2,2,6,2,3,7],L1=[4,0,1,3,2,4,4,6,7,5,4,8,10,11,9,4,12,13,15,14,4,16,18,19,17,4,20,21,23,22];function _1(t,e){e.classHierarchy.push("vtkCubeSource"),t.requestData=(r,n)=>{let a=n[0]?.initialize()||tt.newInstance();n[0]=a;let i=24,s=w.newTypedArray(e.pointType,72);a.getPoints().setData(s,3);let o=w.newTypedArray(e.pointType,72),c=Z.newInstance({name:"Normals",values:o,numberOfComponents:3});a.getPointData().setNormals(c);let f=2;e.generate3DTextureCoordinates===!0&&(f=3);let u=w.newTypedArray(e.pointType,i*f),g=Z.newInstance({name:"TextureCoordinates",values:u,numberOfComponents:f});a.getPointData().setTCoords(g);let l=[0,0,0],h=[0,0,0],y=[0,0],p=0;l[0]=-e.xLength/2,h[0]=-1,h[1]=0,h[2]=0;for(let m=0;m<2;m++){l[1]=-e.yLength/2;for(let d=0;d<2;d++){y[1]=l[1]+.5,l[2]=-e.zLength/2;for(let x=0;x<2;x++)y[0]=(l[2]+.5)*(1-2*m),s[p*3]=l[0],s[p*3+1]=l[1],s[p*3+2]=l[2],o[p*3]=h[0],o[p*3+1]=h[1],o[p*3+2]=h[2],f===2?(u[p*f]=y[0],u[p*f+1]=y[1]):(u[p*f]=2*m-1,u[p*f+1]=2*d-1,u[p*f+2]=2*x-1),p++,l[2]+=e.zLength;l[1]+=e.yLength}l[0]+=e.xLength,h[0]+=2}l[1]=-e.yLength/2,h[1]=-1,h[0]=0,h[2]=0;for(let m=0;m<2;m++){l[0]=-e.xLength/2;for(let d=0;d<2;d++){y[0]=(l[0]+.5)*(2*m-1),l[2]=-e.zLength/2;for(let x=0;x<2;x++)y[1]=(l[2]+.5)*-1,s[p*3]=l[0],s[p*3+1]=l[1],s[p*3+2]=l[2],o[p*3]=h[0],o[p*3+1]=h[1],o[p*3+2]=h[2],f===2?(u[p*f]=y[0],u[p*f+1]=y[1]):(u[p*f]=2*d-1,u[p*f+1]=2*m-1,u[p*f+2]=2*x-1),p++,l[2]+=e.zLength;l[0]+=e.xLength}l[1]+=e.yLength,h[1]+=2}l[2]=-e.zLength/2,h[2]=-1,h[0]=0,h[1]=0;for(let m=0;m<2;m++){l[1]=-e.yLength/2;for(let d=0;d<2;d++){y[1]=l[1]+.5,l[0]=-e.xLength/2;for(let x=0;x<2;x++)y[0]=(l[0]+.5)*(2*m-1),s[p*3]=l[0],s[p*3+1]=l[1],s[p*3+2]=l[2],o[p*3]=h[0],o[p*3+1]=h[1],o[p*3+2]=h[2],f===2?(u[p*f]=y[0],u[p*f+1]=y[1]):(u[p*f]=2*x-1,u[p*f+1]=2*d-1,u[p*f+2]=2*m-1),p++,l[0]+=e.xLength;l[1]+=e.yLength}l[2]+=e.zLength,h[2]+=2}if(e.rotations&&zn.buildFromDegree().rotateX(e.rotations[0]).rotateY(e.rotations[1]).rotateZ(e.rotations[2]).apply(s).apply(o),e.center&&zn.buildFromRadian().translate(...e.center).apply(s),e.matrix){zn.buildFromRadian().setMatrix(e.matrix).apply(s);let m=[e.matrix[0],e.matrix[1],e.matrix[2],0,e.matrix[4],e.matrix[5],e.matrix[6],0,e.matrix[8],e.matrix[9],e.matrix[10],0,0,0,0,1];zn.buildFromRadian().setMatrix(m).apply(o)}e.generateFaces?a.getPolys().deepCopy(e._polys):a.getPolys().initialize(),e.generateLines?(a.getLines().deepCopy(e._lineCells),a.getPointData().setNormals(null)):a.getLines().initialize(),a.modified()},t.setBounds=(...r)=>{let n=[];if(Array.isArray(r[0]))n=r[0];else for(let a=0;a<r.length;a++)n.push(r[a]);n.length===6&&(t.setXLength(n[1]-n[0]),t.setYLength(n[3]-n[2]),t.setZLength(n[5]-n[4]),t.setCenter([(n[0]+n[1])/2,(n[2]+n[3])/2,(n[4]+n[5])/2]))}}var B1={xLength:1,yLength:1,zLength:1,pointType:"Float64Array",generate3DTextureCoordinates:!1,generateFaces:!0,generateLines:!1};function Al(t,e,r={}){Object.assign(e,B1,r),w.obj(t,e),w.setGet(t,e,["xLength","yLength","zLength","generate3DTextureCoordinates","generateFaces","generateLines"]),w.setGetArray(t,e,["center","rotations"],3),w.setGetArray(t,e,["matrix"],16),e._polys=je.newInstance({values:Uint16Array.from(L1)}),e._lineCells=je.newInstance({values:Uint16Array.from(V1)}),w.moveToProtected(t,e,["polys","lineCells"]),w.algo(t,e,0,1),_1(t,e)}var F1=w.newInstance(Al,"vtkCubeSource"),Kl={newInstance:F1,extend:Al};var{vtkErrorMacro:Xl}=w;function U1(t,e){e.classHierarchy.push("vtkImageDataOutlineFilter");let r={...t};t.requestData=(n,a)=>{let i=n[0];if(!i||!i.isA("vtkImageData")){Xl("Invalid or missing input");return}let s=i.getSpatialExtent();if(!s){Xl("Unable to fetch spatial extents of input image.");return}e._cubeSource.setBounds(s),e._cubeSource.setMatrix(i.getIndexToWorld()),a[0]=e._cubeSource.getOutputData()},t.getMTime=()=>Math.max(r.getMTime(),e._cubeSource.getMTime()),t.setGenerateFaces=e._cubeSource.setGenerateFaces,t.setGenerateLines=e._cubeSource.setGenerateLines,t.getGenerateFaces=e._cubeSource.getGenerateFaces,t.getGenerateLines=e._cubeSource.getGenerateLines}var N1={};function Yl(t,e,r={}){Object.assign(e,N1,r),w.obj(t,e),w.algo(t,e,1,1),e._cubeSource=Kl.newInstance(),w.moveToProtected(t,e,["cubeSource","tmpOut"]),U1(t,e)}var G1=w.newInstance(Yl,"vtkImageDataOutlineFilter"),ii={newInstance:G1,extend:Yl};function St(t,e){return t?t.getProperty(e)||t.getProperty():null}function ql(t,e){let r=[];for(let n=0;n<e.length;n++){let a=St(t,e[n].inputIndex);a?.getUseLabelOutline()&&r.push({property:a,arrayIndex:n})}return r}function sn(t,e){let r=[],n=[],a=0;for(let i=0;i<t.length;i++){let s=e(t[i].property);r.push(s),n.push(s.join("-")),a=Math.max(a,s.length)}return{dataArrays:r,hash:n.join("|"),width:a,height:r.length}}function Gr(t,e,r){for(let n=0;n<e.length;n++){let a=e[n],i=n*r;for(let s=0;s<r;s++)t[i+s]=a[s]??a[0]}return t}function si({colorWindow:t,colorLevel:e,useLookupTableScalarRange:r,colorRange:n,volumeScale:a=1,volumeOffset:i=0}){let s=t,o=e;return r&&n&&(s=n[1]-n[0],o=.5*(n[1]+n[0])),{colorScale:a/s,colorShift:(i-o)/s+.5}}function oi({pwfRange:t,volumeScale:e=1,volumeOffset:r=0}){if(!t)return{opacityScale:1,opacityShift:0};let n=t[1]-t[0],a=.5*(t[0]+t[1]);return{opacityScale:e/n,opacityShift:(r-a)/n+.5}}function co({currentValidInputs:t,independentComponents:e,numberOfRows:r,kind:n,getInputProperty:a}){if(!t.length)return"0";let i=n==="color"?"getRGBTransferFunction":"getPiecewiseFunction",s=[];for(let o=0;o<r;o++){let c=a(e?t[o].inputIndex:t[0].inputIndex),f=c?.[i]?.(e?0:o);s.push(`${c?.getMTime?.()??0}:${f?.getMTime?.()??0}`)}return s.join("|")}var Wn=new Float64Array(9),kt=[0,0,0],bt=[0,0,0],Zl=W.create(),Ql=W.create();function ci(t,e=[0,0,1]){if(e[0]=0,e[1]=0,e[2]=1,t){let r=t.getNormal();e[0]=r[0],e[1]=r[1],e[2]=r[2]}return Oe.normalize(e),kt[0]=0,kt[1]=0,kt[2]=0,bt[0]=0,bt[1]=0,bt[2]=0,t?(Oe.perpendiculars(e,kt,bt,0),(Oe.norm(kt)<1e-6||Oe.norm(bt)<1e-6)&&(kt[0]=1,kt[1]=0,kt[2]=0,bt[0]=0,bt[1]=1,bt[2]=0)):(kt[0]=1,bt[1]=1),{planeNormal:e,tangent1:kt,tangent2:bt}}function In(t,e,r,n){ne.set(Wn,...t.getDirection()),ne.invert(Wn,Wn),W.transformMat3(Zl,e,Wn),W.transformMat3(Ql,r,Wn);let a=t.getDimensions(),i=t.getSpacing(),s=Math.min(Math.abs(i[0]),Math.abs(i[1]),Math.abs(i[2]));return n[0]=s/(a[0]*Math.abs(i[0])),n[1]=s/(a[1]*Math.abs(i[1])),n[2]=s/(a[2]*Math.abs(i[2])),{tangent1:Zl,tangent2:Ql,texelSize:n}}var fo=[0,0,0];function k1(t){Oe.normalize(t);for(let e=0;e<3;++e){W.zero(fo),fo[e]=1;let r=Oe.dot(t,fo);if(r<-.999999||r>.999999)return[!0,e]}return[!1,2]}function Jl(t,e,r){for(let n=0;n<r;++n)t[3*n]=e[0],t[3*n+1]=e[1],t[3*n+2]=e[2]}function fi(t,e){let r="",n=!0,a=2,i=e?.getBounds(),s=t.getSlicePolyData(),o=t.getSlicePlane();if(s)r=`PolyData${s.getMTime()}`;else if(o){if(r=`Plane${o.getMTime()}`,e){r=`${r}Image${e.getMTime()}`;let c=ne.create();ne.set(c,...e.getDirection()),ne.invert(c,c);let f=[...o.getNormal()];W.transformMat3(f,f,c),[n,a]=k1(f)}}else{o=lt.newInstance(),o.setNormal(0,0,1);let c=[0,1,0,1,0,1];e&&(c=i),o.setOrigin(c[0],c[2],.5*(c[4]+c[5])),t.setSlicePlane(o),r=`Plane${o.getMTime()}Image${e?.getMTime?.()??0}`}return{resGeomString:r,slicePD:s,slicePlane:o,orthoSlicing:n,orthoAxis:a}}function ui(t,e,r,n,a){r.setInputData(t),n.setInputConnection(r.getOutputPort()),n.setCutFunction(e),a.setInputConnection(n.getOutputPort()),a.update();let i=a.getOutputData(),s=i.getPoints().getData(),o=i.getPolys().getData(),c=[...e.getNormal()];Oe.normalize(c);let f=i.getPoints().getNumberOfPoints(),u=new Float32Array(f*3);return Jl(u,c,f),{points:s,polys:o,normalsData:u}}function li(t,e,r,n){let a=new Float32Array(12),i=t.worldToIndex(e.getOrigin(),[0,0,0]),s=[(r+1)%3,(r+2)%3].sort(),o=t.getSpatialExtent(),c=0;for(let l=0;l<2;++l)for(let h=0;h<2;++h)a[c+r]=i[r],a[c+s[0]]=o[2*s[0]+h],a[c+s[1]]=o[2*s[1]+l],c+=3;n.setMatrix(t.getIndexToWorld()),n.transformPoints(a,a);let f=new Uint16Array([3,0,1,3,3,0,3,2]),u=[...e.getNormal()];Oe.normalize(u);let g=new Float32Array(12);return Jl(g,u,4),{points:a,polys:f,normalsData:g}}var ep=`//VTK::System::Dec

/*=========================================================================

  Program:   Visualization Toolkit
  Module:    vtkImageResliceMapperVS.glsl

  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
  All rights reserved.
  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.

     This software is distributed WITHOUT ANY WARRANTY; without even
     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
     PURPOSE.  See the above copyright notice for more information.

=========================================================================*/

// all variables that represent positions or directions have a suffix
// indicating the coordinate system they are in. The possible values are
// MC - Model coordinates
// WC - World coordinates
// VC - View coordinates
// DC - Display coordinates
// TC - Texture coordinates

// frag position in VC
//VTK::PositionVC::Dec

// Texture coordinates
//VTK::TCoord::Dec

// picking support
//VTK::Picking::Dec

// camera and actor matrix values
//VTK::Camera::Dec

void main()
{
  //VTK::PositionVC::Impl

  //VTK::TCoord::Impl

  //VTK::Picking::Impl
}
`;var tp=`//VTK::System::Dec

/*=========================================================================

  Program:   Visualization Toolkit
  Module:    vtkImageResliceMapperFS.glsl

  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
  All rights reserved.
  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.

     This software is distributed WITHOUT ANY WARRANTY; without even
     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
     PURPOSE.  See the above copyright notice for more information.

=========================================================================*/
// Template for the gpu image mapper fragment shader

// VC position of this fragment
//VTK::PositionVC::Dec

// Texture coordinates
//VTK::TCoord::Dec

// picking support
//VTK::Picking::Dec

// handle coincident offsets
//VTK::Coincident::Dec

//VTK::ZBuffer::Dec

// the output of this shader
//VTK::Output::Dec

void main()
{
  // VC position of this fragment. This should not branch/return/discard.
  //VTK::PositionVC::Impl

  // Place any calls that require uniform flow (e.g. dFdx) here.
  //VTK::UniformFlow::Impl

  // Set gl_FragDepth here (gl_FragCoord.z by default)
  //VTK::Depth::Impl

  // Early depth peeling abort:
  //VTK::DepthPeeling::PreColor

  //VTK::TCoord::Impl

  if (gl_FragData[0].a <= 0.0)
    {
    discard;
    }

  //VTK::DepthPeeling::Impl

  //VTK::Picking::Impl

  // handle coincident offsets
  //VTK::Coincident::Impl

  //VTK::ZBuffer::Impl

  //VTK::RenderPassFragmentShader::Impl
}
`;var{vtkErrorMacro:kr}=we,uo=t=>t.split(`
`).map(e=>e.trim()).filter(Boolean);function rp(t,e,r){return e.identity(r),t.reduce((n,a,i)=>i===0?a?e.copy(n,a):e.identity(n):a?e.multiply(n,n,a):n,r)}function b1(t,e){e.classHierarchy.push("vtkOpenGLImageResliceMapper");let r=new Map;function n(p,m){if(!m)return;let d=(r.get(m)??0)-1;d<=0?(p.unregisterGraphicsResourceUser(m,t),r.delete(m)):r.set(m,d)}function a(p,m){if(!m)return;let d=r.get(m)??0,x=d+1;r.set(m,x),d<=0&&p.registerGraphicsResourceUser(m,t)}function i(p,m,d){m!==d&&(n(p,m),a(p,d))}function s(p){e.tris.releaseGraphicsResources(p),[...r.keys()].forEach(m=>p.unregisterGraphicsResourceUser(m,t)),[e._defaultColorTexture,e._defaultPwfTexture].forEach(m=>m?.oglObject.releaseGraphicsResources(p)),e._defaultColorTexture=null,e._defaultPwfTexture=null}t.buildPass=p=>{if(p){e.currentRenderPass=null,e._openGLImageSlice=t.getFirstAncestorOfType("vtkOpenGLImageSlice"),e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer");let m=e._openGLRenderer.getRenderable();e._openGLCamera=e._openGLRenderer.getViewNodeFor(m.getActiveCamera(),e.openGLCamera);let d=e._openGLRenderWindow;e._openGLRenderWindow=e._openGLRenderer.getLastAncestorOfType("vtkOpenGLRenderWindow"),d&&!d.isDeleted()&&d!==e._openGLRenderWindow&&s(d),e.context=e._openGLRenderWindow.getContext(),e.tris.setOpenGLRenderWindow(e._openGLRenderWindow)}},t.translucentPass=(p,m)=>{p&&(e.currentRenderPass=m,t.render())},t.zBufferPass=p=>{p&&(e.haveSeenDepthRequest=!0,e.renderDepth=!0,t.render(),e.renderDepth=!1)},t.opaqueZBufferPass=p=>t.zBufferPass(p),t.opaquePass=p=>{p&&t.render()},t.getCoincidentParameters=(p,m)=>e.renderable.getResolveCoincidentTopology()==$e.PolygonOffset?e.renderable.getCoincidentTopologyPolygonOffsetParameters():null,t.render=()=>{let p=e._openGLImageSlice.getRenderable(),m=e._openGLRenderer.getRenderable();t.renderPiece(m,p)},t.renderPiece=(p,m)=>{t.invokeEvent({type:"StartEvent"}),e.renderable.update();let d=e.renderable.getNumberOfInputPorts();e.currentValidInputs=[];for(let v=0;v<d;++v){let C=e.renderable.getInputData(v);C&&!C.isDeleted()&&e.currentValidInputs.push({imageData:C,inputIndex:v})}let x=e.currentValidInputs.length;if(x<=0){kr("No input!");return}e.labelOutlineProperties=ql(m,e.currentValidInputs);let T=e.currentValidInputs[0].imageData.getPointData().getScalars();e.multiTexturePerVolumeEnabled=x>1,e.numberOfComponents=e.multiTexturePerVolumeEnabled?x:T.getNumberOfComponents(),t.updateResliceGeometry(),t.renderPieceStart(p,m),t.renderPieceDraw(p,m),t.renderPieceFinish(p,m),t.invokeEvent({type:"EndEvent"})},t.renderPieceStart=(p,m)=>{t.updateBufferObjects(p,m);let d=m.getProperties();e.currentValidInputs.forEach(({inputIndex:x},T)=>{let v=d[x],C=e.scalarTextures[T];!v||!C||(v.getInterpolationType()===Qe.NEAREST?(C.setMinificationFilter(X.NEAREST),C.setMagnificationFilter(X.NEAREST)):(C.setMinificationFilter(X.LINEAR),C.setMagnificationFilter(X.LINEAR)))}),d[e.currentValidInputs[0].inputIndex]?.getInterpolationType()===Qe.NEAREST?(e.colorTexture.setMinificationFilter(X.NEAREST),e.colorTexture.setMagnificationFilter(X.NEAREST),e.pwfTexture.setMinificationFilter(X.NEAREST),e.pwfTexture.setMagnificationFilter(X.NEAREST)):(e.colorTexture.setMinificationFilter(X.LINEAR),e.colorTexture.setMagnificationFilter(X.LINEAR),e.pwfTexture.setMinificationFilter(X.LINEAR),e.pwfTexture.setMagnificationFilter(X.LINEAR)),e.lastBoundBO=null},t.renderPieceDraw=(p,m)=>{let d=e.context,x=e.labelOutlineProperties.length>0,T=[...e.scalarTextures,e.colorTexture,e.pwfTexture];x&&(T.push(e.labelOutlineThicknessTexture),T.push(e.labelOutlineOpacityTexture)),T.forEach(v=>v.activate()),t.updateShaders(e.tris,p,m),d.drawArrays(d.TRIANGLES,0,e.tris.getCABO().getElementCount()),e.tris.getVAO().release(),T.forEach(v=>v.deactivate())},t.renderPieceFinish=(p,m)=>{},t.updateBufferObjects=(p,m)=>{t.getNeedToRebuildBufferObjects(p,m)&&t.buildBufferObjects(p,m)},t.getNeedToRebuildBufferObjects=(p,m)=>{let d=m.getProperty(e.currentValidInputs[0].inputIndex),x=e.labelOutlineProperties.length>0;return e.VBOBuildTime.getMTime()<t.getMTime()||e.VBOBuildTime.getMTime()<m.getMTime()||e.VBOBuildTime.getMTime()<e.renderable.getMTime()||e.VBOBuildTime.getMTime()<d?.getMTime()||e.currentValidInputs.some(({imageData:T})=>e.VBOBuildTime.getMTime()<T.getMTime())||e.VBOBuildTime.getMTime()<e.resliceGeom.getMTime()||e.scalarTextures.length!==e.currentValidInputs.length||!e.scalarTextures.every(T=>!!T?.getHandle())||!e.colorTexture?.getHandle()||!e.pwfTexture?.getHandle()||x&&(!e.labelOutlineThicknessTexture?.getHandle()||!e.labelOutlineOpacityTexture?.getHandle())},t.buildBufferObjects=(p,m)=>{let d=m.getProperties();e.currentValidInputs.forEach(({imageData:G,inputIndex:b},z)=>{let I=G.getPointData().getScalars(),P=e._openGLRenderWindow.getGraphicsResourceForObject(I),Q=tn(G,I),$=!P?.oglObject?.getHandle()||P?.hash!==Q,J=d[b],Y=J?.getUpdatedExtents()??[],j=!!Y.length;if($&&!j){let A=Se.newInstance();A.setOpenGLRenderWindow(e._openGLRenderWindow);let se=G.getDimensions();A.setOglNorm16Ext(e.context.getExtension("EXT_texture_norm16")),A.resetFormatAndType(),A.create3DFilterableFromDataArray({width:se[0],height:se[1],depth:se[2],dataArray:I}),e._openGLRenderWindow.setGraphicsResourceForObject(I,A,Q),e.scalarTextures[z]=A}else e.scalarTextures[z]=P.oglObject;if(j){J.setUpdatedExtents([]);let A=G.getDimensions();e.scalarTextures[z].create3DFilterableFromDataArray({width:A[0],height:A[1],depth:A[2],dataArray:I,updatedExtents:Y})}i(e._openGLRenderWindow,e._scalarTexturesCore[z],I),e._scalarTexturesCore[z]=I});let x=d[e.currentValidInputs[0].inputIndex];if(!x){kr("Missing property for first input");return}let T=x.getIndependentComponents(),v=T?e.numberOfComponents:1,C=T?2*v:1,O=[];for(let G=0;G<v;++G)if(e.multiTexturePerVolumeEnabled){let b=e.currentValidInputs[G],z=b?d[b.inputIndex]:null;O.push(z?.getRGBTransferFunction()||null)}else O.push(x.getRGBTransferFunction(G));let M=mt(O,T,v),S=x.getRGBTransferFunction(),E=e.renderable.getColorTextureWidth();E<=0&&(E=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));let R=S?M:`default-${E}`,D=S?e._openGLRenderWindow.getGraphicsResourceForObject(S):e._defaultColorTexture;if(!D?.oglObject?.getHandle()||D?.hash!==R){let G=E*C*3,b=new Uint8ClampedArray(G),z=Se.newInstance();if(z.setOpenGLRenderWindow(e._openGLRenderWindow),S){let I=new Float32Array(E*3);for(let P=0;P<v;P++){let Q=O[P];if(Q){let $=Q.getRange();if(Q.getTable($[0],$[1],E,I,1),T)for(let J=0;J<E*3;J++)b[P*E*6+J]=255*I[J],b[P*E*6+J+E*3]=255*I[J];else for(let J=0;J<E*3;J++)b[P*E*3+J]=255*I[J]}}z.resetFormatAndType(),z.create2DFromRaw({width:E,height:C,numComps:3,dataType:re.UNSIGNED_CHAR,data:b})}else{for(let I=0;I<E*3;++I){let P=255*I/((E-1)*3);for(let Q=0;Q<C;++Q)b[Q*E*3+I+0]=P,b[Q*E*3+I+1]=P,b[Q*E*3+I+2]=P}z.resetFormatAndType(),z.create2DFromRaw({width:E,height:1,numComps:3,dataType:re.UNSIGNED_CHAR,data:b})}S?e._openGLRenderWindow.setGraphicsResourceForObject(S,z,M):(e._defaultColorTexture?.oglObject.releaseGraphicsResources(e._openGLRenderWindow),e._defaultColorTexture={oglObject:z,hash:R}),e.colorTexture=z}else e.colorTexture=D.oglObject;i(e._openGLRenderWindow,e._colorTextureCore,S),e._colorTextureCore=S;let V=[];for(let G=0;G<v;++G)if(e.multiTexturePerVolumeEnabled){let b=e.currentValidInputs[G],z=b?d[b.inputIndex]:null;V.push(z?.getPiecewiseFunction()||null)}else V.push(x.getPiecewiseFunction(G));let U=mt(V,T,v),B=x.getPiecewiseFunction(),_=e.renderable.getOpacityTextureWidth();_<=0&&(_=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));let N=B?U:`default-${_}-${C}`,k=B?e._openGLRenderWindow.getGraphicsResourceForObject(B):e._defaultPwfTexture;if(!k?.oglObject?.getHandle()||k?.hash!==N){let G=_*C,b=new Uint8ClampedArray(G),z=Se.newInstance();if(z.setOpenGLRenderWindow(e._openGLRenderWindow),B){let I=new Float32Array(G),P=new Float32Array(_);for(let Q=0;Q<v;++Q){let $=V[Q];if($===null)I.fill(1);else{let J=$.getRange();if($.getTable(J[0],J[1],_,P,1),T)for(let Y=0;Y<_;Y++)I[Q*_*2+Y]=P[Y],I[Q*_*2+Y+_]=P[Y];else for(let Y=0;Y<_;Y++)I[Y]=P[Y]}}z.resetFormatAndType(),z.create2DFromRaw({width:_,height:C,numComps:1,dataType:re.FLOAT,data:I})}else b.fill(255),z.resetFormatAndType(),z.create2DFromRaw({width:_,height:C,numComps:1,dataType:re.UNSIGNED_CHAR,data:b});B?e._openGLRenderWindow.setGraphicsResourceForObject(B,z,U):(e._defaultPwfTexture?.oglObject.releaseGraphicsResources(e._openGLRenderWindow),e._defaultPwfTexture={oglObject:z,hash:N}),e.pwfTexture=z}else e.pwfTexture=k.oglObject;i(e._openGLRenderWindow,e._pwfTextureCore,B),e._pwfTextureCore=B,e.labelOutlineProperties.length>0&&(t.updateLabelOutlineThicknessTexture(e.labelOutlineProperties),t.updateLabelOutlineOpacityTexture(e.labelOutlineProperties));let F=`${e.resliceGeom.getMTime()}A${e.renderable.getSlabThickness()}`;if(!e.tris.getCABO().getElementCount()||e.VBOBuildString!==F){let G=Z.newInstance({numberOfComponents:3,values:e.resliceGeom.getPoints().getData()});G.setName("points");let b=je.newInstance({values:e.resliceGeom.getPolys().getData()}),z={points:G,cellOffset:0,forceFlatten:!0};if(e.renderable.getSlabThickness()>0){let I=e.resliceGeom.getPointData().getNormals();I?z.normals=I:kr("Slab mode requested without normals")}e.tris.getCABO().createVBO(b,"polys",Pe.SURFACE,z)}e.VBOBuildString=F,e.VBOBuildTime.modified()},t.updateShaders=(p,m,d)=>{if(e.lastBoundBO=p,t.getNeedToRebuildShaders(p,m,d)){let x={Vertex:null,Fragment:null,Geometry:null};t.buildShaders(x,m,d);let T=e._openGLRenderWindow.getShaderCache().readyShaderProgramArray(x.Vertex,x.Fragment,x.Geometry);T!==p.getProgram()&&(p.setProgram(T),p.getVAO().releaseGraphicsResources()),p.getShaderSourceTime().modified()}else e._openGLRenderWindow.getShaderCache().readyShaderProgram(p.getProgram());p.getVAO().bind(),t.setMapperShaderParameters(p,m,d),t.setCameraShaderParameters(p,m,d),t.setPropertyShaderParameters(p,m,d)},t.setMapperShaderParameters=(p,m,d)=>{let x=p.getProgram(),T=e.currentValidInputs[0].imageData;if(p.getCABO().getElementCount()&&(e.VBOBuildTime.getMTime()>p.getAttributeUpdateTime().getMTime()||p.getShaderSourceTime().getMTime()>p.getAttributeUpdateTime().getMTime())){e.scalarTextures.forEach((C,O)=>{x.setUniformi(`volumeTexture[${O}]`,C.getTextureUnit())}),x.isAttributeUsed("vertexWC")&&(p.getVAO().addAttributeArray(x,p.getCABO(),"vertexWC",p.getCABO().getVertexOffset(),p.getCABO().getStride(),e.context.FLOAT,3,e.context.FALSE)||kr("Error setting vertexWC in shader VAO.")),x.isAttributeUsed("normalWC")&&(p.getVAO().addAttributeArray(x,p.getCABO(),"normalWC",p.getCABO().getNormalOffset(),p.getCABO().getStride(),e.context.FLOAT,3,e.context.FALSE)||kr("Error setting normalWC in shader VAO.")),x.isUniformUsed("slabThickness")&&x.setUniformf("slabThickness",e.renderable.getSlabThickness()),x.isUniformUsed("spacing")&&x.setUniform3fv("spacing",T.getSpacing()),x.isUniformUsed("slabType")&&x.setUniformi("slabType",e.renderable.getSlabType()),x.isUniformUsed("slabTrapezoid")&&x.setUniformi("slabTrapezoid",e.renderable.getSlabTrapezoidIntegration());let v=p.getCABO().getCoordShiftAndScaleEnabled()?p.getCABO().getInverseShiftAndScaleMatrix():null;for(let C=0;C<e.currentValidInputs.length;C++){let O=`WCTCMatrix${C}`;if(x.isUniformUsed(O)){let M=e.currentValidInputs[C].imageData,S=M.getDimensions();L.copy(e.tmpMat4,M.getIndexToWorld()),L.translate(e.tmpMat4,e.tmpMat4,[-.5,-.5,-.5]),L.scale(e.tmpMat4,e.tmpMat4,S),L.invert(e.tmpMat4,e.tmpMat4),v&&L.multiply(e.tmpMat4,e.tmpMat4,v),x.setUniformMatrix(O,e.tmpMat4)}}x.isUniformUsed("vboScaling")&&x.setUniform3fv("vboScaling",p.getCABO().getCoordScale()??[1,1,1]),p.getAttributeUpdateTime().modified()}if(e.haveSeenDepthRequest&&p.getProgram().setUniformi("depthRequest",e.renderDepth?1:0),p.getProgram().isUniformUsed("coffset")){let v=t.getCoincidentParameters(m,d);p.getProgram().setUniformf("coffset",v.offset),p.getProgram().isUniformUsed("cfactor")&&p.getProgram().setUniformf("cfactor",v.factor)}},t.setCameraShaderParameters=(p,m,d)=>{let x=e._openGLCamera.getKeyMatrices(m),T=e._openGLImageSlice.getKeyMatrices(),v=p.getCABO().getCoordShiftAndScaleEnabled()?p.getCABO().getInverseShiftAndScaleMatrix():null,C=p.getProgram();C.isUniformUsed("MCPCMatrix")&&(L.identity(e.tmpMat4),C.setUniformMatrix("MCPCMatrix",rp([x.wcpc,T.mcwc,v],L,e.tmpMat4))),C.isUniformUsed("MCVCMatrix")&&(L.identity(e.tmpMat4),C.setUniformMatrix("MCVCMatrix",rp([x.wcvc,T.mcwc,v],L,e.tmpMat4)))},t.setPropertyShaderParameters=(p,m,d)=>{let x=p.getProgram(),T=d.getProperty(e.currentValidInputs[0].inputIndex),v=e.multiTexturePerVolumeEnabled?1:T.getOpacity();x.setUniformf("opacity",v);let C=e.numberOfComponents,O=T.getIndependentComponents(),M=e.multiTexturePerVolumeEnabled,S=d.getProperties();if(O)for(let D=0;D<C;++D){let V=M?S[e.currentValidInputs[D].inputIndex]:T;x.setUniformf(`mix${D}`,V.getComponentWeight(0))}for(let D=0;D<C;D++){let V=M?D:0,U=M?0:D,B=e.scalarTextures[V].getVolumeInfo(),_=B.scale[U],N=B.offset[U],k=O?D:0,F=M?S[e.currentValidInputs[D].inputIndex]:T,G=F.getColorWindow(),b=F.getColorLevel(),z=F.getRGBTransferFunction(M?0:k),{colorScale:I,colorShift:P}=si({colorWindow:G,colorLevel:b,useLookupTableScalarRange:F.getUseLookupTableScalarRange(),colorRange:z?.getRange?.(),volumeScale:_,volumeOffset:N});x.setUniformf(`cshift${D}`,P),x.setUniformf(`cscale${D}`,I);let Q=F.getPiecewiseFunction(M?0:k),{opacityScale:$,opacityShift:J}=oi({pwfRange:Q?.getRange?.(),volumeScale:_,volumeOffset:N});x.setUniformf(`pwfshift${D}`,J),x.setUniformf(`pwfscale${D}`,$)}let E=e.colorTexture.getTextureUnit();x.setUniformi("colorTexture1",E);let R=e.pwfTexture.getTextureUnit();if(x.setUniformi("pwfTexture1",R),x.setUniform4fv("backgroundColor",e.renderable.getBackgroundColor()),e.labelOutlineProperties.length>0){let D=e.labelOutlineThicknessTexture.getTextureUnit();x.setUniformi("labelOutlineThicknessTexture",D);let V=e.labelOutlineOpacityTexture.getTextureUnit();x.setUniformi("labelOutlineOpacityTexture",V);let U=e.renderable.getLabelOutlineTextureWidth();U<=0&&(U=e.context.getParameter(e.context.MAX_TEXTURE_SIZE)),x.setUniformf("labelOutlineTextureWidth",U),x.setUniformf("numLabelmaps",e.labelOutlineProperties.length);let B=e.renderable.getSlicePlane(),{tangent1:_,tangent2:N}=ci(B);for(let k=0;k<e.currentValidInputs.length;k++){let F=e.currentValidInputs[k].imageData,{tangent1:G,tangent2:b}=In(F,_,N,e._tmpTexelSize),z=`outlineTangent1_${k}`,I=`outlineTangent2_${k}`;x.isUniformUsed(z)&&x.setUniform3fv(z,G),x.isUniformUsed(I)&&x.setUniform3fv(I,b)}for(let k=0;k<e.currentValidInputs.length;k++){let F=`texelSize${k}`;if(x.isUniformUsed(F)){let G=e.currentValidInputs[k].imageData,{texelSize:b}=In(G,_,N,e._tmpTexelSize);x.setUniform3fv(F,b)}}}},t.getNeedToRebuildShaders=(p,m,d)=>{let x=d.getProperty(e.currentValidInputs[0].inputIndex).getIndependentComponents(),T=e.labelOutlineProperties.length>0,v=e.renderable.getSlabThickness(),C=e.renderable.getSlabType(),O=e.renderable.getSlabTrapezoidIntegration(),M=!1;(!e.currentRenderPass&&e.lastRenderPassShaderReplacement||e.currentRenderPass&&e.currentRenderPass.getShaderReplacement()!==e.lastRenderPassShaderReplacement)&&(M=!0);let S=e.currentValidInputs?.length??0;return M||e.lastHaveSeenDepthRequest!==e.haveSeenDepthRequest||e.lastNumberOfComponents!==e.numberOfComponents||e.lastMultiTexturePerVolumeEnabled!==e.multiTexturePerVolumeEnabled||p.getProgram()?.getHandle()===0||e.lastIndependentComponents!==x||e.lastUseLabelOutline!==T||e.lastNumValidInputs!==S||e.lastSlabThickness!==v||e.lastSlabType!==C||e.lastSlabTrapezoidIntegration!==O?(e.lastHaveSeenDepthRequest=e.haveSeenDepthRequest,e.lastNumberOfComponents=e.numberOfComponents,e.lastMultiTexturePerVolumeEnabled=e.multiTexturePerVolumeEnabled,e.lastIndependentComponents=x,e.lastUseLabelOutline=T,e.lastNumValidInputs=S,e.lastSlabThickness=v,e.lastSlabType=C,e.lastSlabTrapezoidIntegration=O,!0):!1},t.getShaderTemplate=(p,m,d)=>{p.Vertex=ep,p.Fragment=tp,p.Geometry=""},t.replaceShaderValues=(p,m,d)=>{if(t.replaceShaderTCoord(p,m,d),t.replaceShaderPositionVC(p,m,d),e.haveSeenDepthRequest){let x=p.Fragment;x=H.substitute(x,"//VTK::ZBuffer::Dec","uniform int depthRequest;").result,x=H.substitute(x,"//VTK::ZBuffer::Impl",["if (depthRequest == 1) {","float iz = floor(gl_FragCoord.z*65535.0 + 0.1);","float rf = floor(iz/256.0)/255.0;","float gf = mod(iz,256.0)/255.0;","gl_FragData[0] = vec4(rf, gf, 0.0, 1.0); }"]).result,p.Fragment=x}t.replaceShaderCoincidentOffset(p,m,d)};function o(p,m){let d=["r","g","b","a"],x=Array.from({length:m},(O,M)=>M).filter(O=>!p.includes(O)),T=p.map(O=>`vec3 labelTexCoord${O} = (WCTCMatrix${O} * vec4(fragWorldPos, 1.0)).xyz;`).join(`
                `),v=p.length===0?"":`float neighborLabel = ${p.map((O,M)=>M===0?`(labelInputIdx == ${M}) ? texture(volumeTexture[${O}], neighborTexCoord).r`:` : (labelInputIdx == ${M}) ? texture(volumeTexture[${O}], neighborTexCoord).r`).join("")} : 0.0;`,C=[...x,...p].map(O=>{let M=p.includes(O),S=p.indexOf(O);return M?`
        // Process input ${O} as labelmap
        {
          float labelValue = tvalue.${d[O]};
          int segmentIndex = int(labelValue * 255.0);

          if (segmentIndex > 0) {
            float textureCoordinate = float(segmentIndex - 1) / labelOutlineTextureWidth;
            float labelmapRow = (float(${S}) + 0.5) / numLabelmaps;
            float thicknessValue = texture2D(labelOutlineThicknessTexture, vec2(textureCoordinate, labelmapRow)).r;
            float labelOutlineOpacityValue = texture2D(labelOutlineOpacityTexture, vec2(textureCoordinate, labelmapRow)).r;
            int actualThickness = int(thicknessValue * 255.0);

            vec3 currentLabelTC = labelTexCoord${O};
            vec3 currentTexelSize = texelSize${O};
            vec3 currentTangent1 = outlineTangent1_${O};
            vec3 currentTangent2 = outlineTangent2_${O};

            bool pixelOnBorder = false;
            int labelInputIdx = ${S};
            for (int i = -actualThickness; i <= actualThickness; i++) {
              for (int j = -actualThickness; j <= actualThickness; j++) {
                if (i == 0 && j == 0) continue;
                vec3 neighborTexCoord = currentLabelTC + float(i) * currentTangent1 * currentTexelSize + float(j) * currentTangent2 * currentTexelSize;
                if (any(greaterThan(neighborTexCoord, vec3(1.0))) || any(lessThan(neighborTexCoord, vec3(0.0)))) {
                  pixelOnBorder = true;
                  break;
                }
                ${v}
                if (neighborLabel != labelValue) {
                  pixelOnBorder = true;
                  break;
                }
              }
              if (pixelOnBorder) break;
            }

            if (pixelOnBorder) {
              convergentColor.rgb = mix(convergentColor.rgb, tcolor${O}.rgb, labelOutlineOpacityValue);
              convergentColor.a = max(convergentColor.a, labelOutlineOpacityValue);
            } else if (compWeight${O} > 0.0) {
              float fillAlpha = compWeight${O} * opacity;
              convergentColor.rgb = mix(convergentColor.rgb, tcolor${O}.rgb, fillAlpha);
              convergentColor.a = max(convergentColor.a, fillAlpha);
            }
          }
        }`:`
        // Process input ${O} as background image
        {
          float bgAlpha = compWeight${O} * opacity;
          convergentColor.rgb = mix(convergentColor.rgb, tcolor${O}.rgb, bgAlpha);
          convergentColor.a = max(convergentColor.a, bgAlpha);
        }`}).join(`
        `);return uo(`
      // Multi-texture mode: ${p.length>0?`labelmaps at input${p.length>1?"s":""} ${p.join(", ")}`:"no labelmaps"}, ${x.length>0?`background at input${x.length>1?"s":""} ${x.join(", ")}`:"no background"}
      vec4 convergentColor = vec4(0.0, 0.0, 0.0, 0.0);

      // Compute labelmap texture coordinates
      ${T}

      // Process each input in order
      ${C}

      gl_FragData[0] = convergentColor;
    `)}function c(){return["vec4 compositeValue(vec4 currVal, vec4 valToComp, int trapezoid)","{","  vec4 retVal = vec4(1.0);","  if (slabType == 0) // min","  {","    retVal = min(currVal, valToComp);","  }","  else if (slabType == 1) // max","  {","    retVal = max(currVal, valToComp);","  }","  else if (slabType == 3) // sum","  {","    retVal = currVal + (trapezoid > 0 ? 0.5 * valToComp : valToComp); ","  }","  else // mean","  {","    retVal = currVal + (trapezoid > 0 ? 0.5 * valToComp : valToComp); ","  }","  return retVal;","}"]}function f(){return["// Get the first and last samples","int numSlices = 1;","float scaling = min(min(spacing.x, spacing.y), spacing.z) * 0.5;","vec3 slabNormal = normalize(normalWCVSOutput);","vec3 normalxspacing = scaling * slabNormal;","float distTraveled = length(normalxspacing);","int trapezoid = 0;","// Each march direction leaves the volume for good once it exits the","// unit cube (the sample positions are monotonic along a line and the","// cube is convex), so the loop can stop as soon as both directions","// have exited. Slab thicknesses larger than the volume then only cost","// the in-volume portion of the march.","bool negExited = false;","bool posExited = false;","while (distTraveled < slabThickness * 0.5)","{","  distTraveled += length(normalxspacing);","  float fnumSlices = float(numSlices);","  bool atSlabBoundary = false;","  if (distTraveled > slabThickness * 0.5)","  {","    // Before stepping outside the slab, sample at the boundaries","    normalxspacing = slabNormal * slabThickness * 0.5 / fnumSlices;","    trapezoid = slabTrapezoid;","    atSlabBoundary = true;","  }","  vec3 worldPosNeg = vertexWCVSOutput.xyz - fnumSlices * normalxspacing * vboScaling;","  vec3 fragTCoordNeg = (WCTCMatrix0 * vec4(worldPosNeg, 1.0)).xyz;","  if (!any(greaterThan(fragTCoordNeg, vec3(1.0))) && !any(lessThan(fragTCoordNeg, vec3(0.0))))","  {","    vec4 newVal = rawSampleTexture(worldPosNeg);","    tvalue = compositeValue(tvalue, newVal, trapezoid);","    numSlices += 1;","  }","  else if (!atSlabBoundary)","  {","    negExited = true;","  }","  vec3 worldPosPos = vertexWCVSOutput.xyz + fnumSlices * normalxspacing * vboScaling;","  vec3 fragTCoordPos = (WCTCMatrix0 * vec4(worldPosPos, 1.0)).xyz;","  if (!any(greaterThan(fragTCoordPos, vec3(1.0))) && !any(lessThan(fragTCoordPos, vec3(0.0))))","  {","    vec4 newVal = rawSampleTexture(worldPosPos);","    tvalue = compositeValue(tvalue, newVal, trapezoid);","    numSlices += 1;","  }","  else if (!atSlabBoundary)","  {","    posExited = true;","  }","  if (negExited && posExited) { break; }","}","// Finally, if slab type is *mean*, divide the sum by the numSlices","if (slabType == 2)","{","  tvalue = tvalue / float(numSlices);","}"]}function u(){return["// Returns a bitmask of the labels (1..31) present along the slab","// centered at startTC. Marches in texture space and exits as soon as","// the ray leaves the unit cube, so only the in-volume portion of the","// slab is sampled regardless of how large the slab thickness is.","int labelSlabMask(vec3 startTC, vec3 stepTC, float halfSlab, float stepLen)","{","  int mask = 0;","  vec3 tc = startTC;","  float dist = 0.0;","  for (int i = 0; i < 4096; ++i)","  {","    if (dist > halfSlab) { break; }","    if (any(greaterThan(tc, vec3(1.0))) || any(lessThan(tc, vec3(0.0)))) { break; }","    int label = int(texture(volumeTexture[0], tc).r * 255.0 + 0.5);","    if (label > 0 && label < 32) { mask |= (1 << label); }","    tc += stepTC;","    dist += stepLen;","  }","  tc = startTC - stepTC;","  dist = stepLen;","  for (int i = 0; i < 4096; ++i)","  {","    if (dist > halfSlab) { break; }","    if (any(greaterThan(tc, vec3(1.0))) || any(lessThan(tc, vec3(0.0)))) { break; }","    int label = int(texture(volumeTexture[0], tc).r * 255.0 + 0.5);","    if (label > 0 && label < 32) { mask |= (1 << label); }","    tc -= stepTC;","    dist += stepLen;","  }","  return mask;","}","","// Number of stepTC-sized steps from p that stay inside the unit cube","float labelSlabBoxSteps(vec3 p, vec3 stepTC)","{","  vec3 limit = vec3(65536.0);","  if (stepTC.x > 1e-8) { limit.x = (1.0 - p.x) / stepTC.x; }","  else if (stepTC.x < -1e-8) { limit.x = -p.x / stepTC.x; }","  if (stepTC.y > 1e-8) { limit.y = (1.0 - p.y) / stepTC.y; }","  else if (stepTC.y < -1e-8) { limit.y = -p.y / stepTC.y; }","  if (stepTC.z > 1e-8) { limit.z = (1.0 - p.z) / stepTC.z; }","  else if (stepTC.z < -1e-8) { limit.z = -p.z / stepTC.z; }","  return min(limit.x, min(limit.y, limit.z));","}","","// First label of labelMask found when marching the slab from its","// viewer-side end toward the back, so overlapping labels resolve in","// depth order; returns 0 when none of the mask labels is found","int labelSlabFrontLabel(vec3 startTC, vec3 towardCameraTC, float halfSlab, float stepLen, int labelMask)","{","  float slabSteps = halfSlab / stepLen;","  float nFront = min(slabSteps, labelSlabBoxSteps(startTC, towardCameraTC));","  float nBack = min(slabSteps, labelSlabBoxSteps(startTC, -towardCameraTC));","  vec3 tc = startTC + towardCameraTC * nFront;","  int totalSteps = int(nFront + nBack) + 1;","  for (int i = 0; i < 8192; ++i)","  {","    if (i >= totalSteps) { break; }","    int label = int(texture(volumeTexture[0], tc).r * 255.0 + 0.5);","    if (label > 0 && label < 32 && (labelMask & (1 << label)) != 0) { return label; }","    tc -= towardCameraTC;","  }","  return 0;","}"]}function g(){return uo(`
      // Slab-projected label outline for single component
      vec4 slabOutlineResult = vec4(0.0, 0.0, 0.0, 0.0);
      // For MAX slabs, a composited value of 0 means no label anywhere
      // along the slab, so the expensive mask marches can be skipped.
      if (slabType != 1 || tvalue.r >= 0.5 / 255.0) {
        vec3 outlineStepTC = (WCTCMatrix0 * vec4(scaling * slabNormal * vboScaling, 0.0)).xyz;
        float halfSlab = slabThickness * 0.5;
        int centerMask = labelSlabMask(fragTexCoord, outlineStepTC, halfSlab, scaling);

        if (centerMask != 0) {
          // A label is on its projected edge when present here but missing in
          // some neighbor probed at that label's own outline thickness. Labels
          // sharing a thickness reuse the same neighbor masks, so the common
          // case still costs four neighbor marches.
          float labelmapRow = 0.5 / numLabelmaps;
          int edgeLabels = 0;
          int prevThickness = -1;
          int neighborMask = 0;
          for (int s = 1; s < 32; ++s) {
            if ((centerMask & (1 << s)) == 0) { continue; }
            float thicknessCoordinate = (float(s) - 1.0) / labelOutlineTextureWidth;
            int segmentThickness = max(1, int(texture2D(labelOutlineThicknessTexture, vec2(thicknessCoordinate, labelmapRow)).r * 255.0));
            if (segmentThickness != prevThickness) {
              vec3 outlineOffset1 = outlineTangent1_0 * texelSize0 * float(segmentThickness);
              vec3 outlineOffset2 = outlineTangent2_0 * texelSize0 * float(segmentThickness);
              neighborMask =
                labelSlabMask(fragTexCoord + outlineOffset1, outlineStepTC, halfSlab, scaling) &
                labelSlabMask(fragTexCoord - outlineOffset1, outlineStepTC, halfSlab, scaling) &
                labelSlabMask(fragTexCoord + outlineOffset2, outlineStepTC, halfSlab, scaling) &
                labelSlabMask(fragTexCoord - outlineOffset2, outlineStepTC, halfSlab, scaling);
              prevThickness = segmentThickness;
            }
            if ((neighborMask & (1 << s)) == 0) { edgeLabels |= (1 << s); }
          }

          // When several edge labels compete for this fragment, the one nearest
          // the viewer along the slab wins. The camera looks down -z in view
          // coordinates, so the slab normal points toward the viewer when its
          // view-space z component is positive.
          float slabNormalTowardCamera = (MCVCMatrix * vec4(slabNormal, 0.0)).z;
          vec3 towardCameraTC = slabNormalTowardCamera > 0.0 ? outlineStepTC : -outlineStepTC;

          if (edgeLabels != 0) {
            int edgeLabel = labelSlabFrontLabel(fragTexCoord, towardCameraTC, halfSlab, scaling, edgeLabels);
            if (edgeLabel == 0) {
              // numeric fallback: smallest edge label
              for (int s = 1; s < 32; ++s) {
                if ((edgeLabels & (1 << s)) != 0) { edgeLabel = s; break; }
              }
            }
            float labelValue = float(edgeLabel) / 255.0;
            vec3 edgeColor = texture2D(colorTexture1, vec2(labelValue * cscale0 + cshift0, 0.5)).rgb;
            float opacityCoordinate = (float(edgeLabel) - 1.0) / labelOutlineTextureWidth;
            float edgeOpacity = texture2D(labelOutlineOpacityTexture, vec2(opacityCoordinate, labelmapRow)).r;
            slabOutlineResult = vec4(edgeColor, edgeOpacity);
          } else {
            // Interior of the projected labels: regular fill through the
            // transfer functions using the label nearest the viewer
            int fillLabel = labelSlabFrontLabel(fragTexCoord, towardCameraTC, halfSlab, scaling, centerMask);
            float fillValue = fillLabel != 0 ? float(fillLabel) / 255.0 : tvalue.r;
            vec3 fillColor = texture2D(colorTexture1, vec2(fillValue * cscale0 + cshift0, 0.5)).rgb;
            float fillOpacity = texture2D(pwfTexture1, vec2(fillValue * pwfscale0 + pwfshift0, 0.5)).r;
            slabOutlineResult = vec4(fillColor, fillOpacity * opacity);
          }
        }
      }
      gl_FragData[0] = slabOutlineResult;
    `)}function l(p,m){let d=[];for(let x=0;x<p;x++)m(x)&&d.push(x);return d}t.replaceShaderTCoord=(p,m,d)=>{let x=p.Vertex,T=p.Geometry,v=p.Fragment,C=e.labelOutlineProperties.length>0,O=e.renderable.getSlabThickness();x=H.substitute(x,"//VTK::TCoord::Dec",[]).result,x=H.substitute(x,"//VTK::TCoord::Impl",[]).result;let M=e.numberOfComponents,S=d.getProperty(e.currentValidInputs[0].inputIndex).getIndependentComponents(),E=e.scalarTextures.length,R=[`uniform highp sampler3D volumeTexture[${E}];`,"uniform float cshift0;","uniform float cscale0;","uniform float pwfshift0;","uniform float pwfscale0;","uniform sampler2D colorTexture1;","uniform sampler2D pwfTexture1;","uniform float opacity;","uniform vec4 backgroundColor;"];for(let V=0;V<E;V++)R.push(`uniform mat4 WCTCMatrix${V};`);if(C){R=R.concat(["uniform sampler2D labelOutlineThicknessTexture;","uniform sampler2D labelOutlineOpacityTexture;","uniform float labelOutlineTextureWidth;","uniform float numLabelmaps;"]);for(let V=0;V<E;V++)R.push(`uniform vec3 outlineTangent1_${V};`),R.push(`uniform vec3 outlineTangent2_${V};`),R.push(`uniform vec3 texelSize${V};`)}if(R.push("vec4 rawSampleTexture(vec3 worldPos) {"),!e.multiTexturePerVolumeEnabled)R.push("vec3 tc0 = (WCTCMatrix0 * vec4(worldPos, 1.0)).xyz;","return texture(volumeTexture[0], tc0);","}");else{R.push("vec4 rawSample;");for(let V=0;V<E;++V)R.push(`vec3 tc${V} = (WCTCMatrix${V} * vec4(worldPos, 1.0)).xyz;`,`rawSample[${V}] = texture(volumeTexture[${V}], tc${V})[0];`);R.push("return rawSample;","}")}if(S){for(let V=1;V<M;V++)R=R.concat([`uniform float cshift${V};`,`uniform float cscale${V};`,`uniform float pwfshift${V};`,`uniform float pwfscale${V};`]);switch(M){case 1:R=R.concat(["uniform float mix0;","#define height0 0.5"]);break;case 2:R=R.concat(["uniform float mix0;","uniform float mix1;","#define height0 0.25","#define height1 0.75"]);break;case 3:R=R.concat(["uniform float mix0;","uniform float mix1;","uniform float mix2;","#define height0 0.17","#define height1 0.5","#define height2 0.83"]);break;case 4:R=R.concat(["uniform float mix0;","uniform float mix1;","uniform float mix2;","uniform float mix3;","#define height0 0.125","#define height1 0.375","#define height2 0.625","#define height3 0.875"]);break;default:kr("Unsupported number of independent coordinates.")}}O>0&&(R=R.concat(["uniform vec3 spacing;","uniform float slabThickness;","uniform int slabType;","uniform int slabTrapezoid;","uniform vec3 vboScaling;"]),R=R.concat(c()),C&&!S&&M===1&&(R=R.concat(["uniform mat4 MCVCMatrix;"]),R=R.concat(u()))),v=H.substitute(v,"//VTK::TCoord::Dec",R).result;let D=["vec3 fragWorldPos = vertexWCVSOutput.xyz;","vec3 fragTexCoord = (WCTCMatrix0 * vec4(fragWorldPos, 1.0)).xyz;","if (any(greaterThan(fragTexCoord, vec3(1.0))) || any(lessThan(fragTexCoord, vec3(0.0))))","{","  // set the background color and exit","  gl_FragData[0] = backgroundColor;","  return;","}","vec4 tvalue = rawSampleTexture(fragWorldPos);"];if(O>0&&(D=D.concat(f())),S){let V=["r","g","b","a"];for(let _=0;_<M;++_)D=D.concat([`vec3 tcolor${_} = texture2D(colorTexture1, vec2(tvalue.${V[_]} * cscale${_} + cshift${_}, height${_})).rgb;`,`float compWeight${_} = mix${_} * texture2D(pwfTexture1, vec2(tvalue.${V[_]} * pwfscale${_} + pwfshift${_}, height${_})).r;`]);let U=C?l(M,_=>d.getProperty(e.currentValidInputs[_].inputIndex)?.getUseLabelOutline()):[],B=_=>{if(_===1)return["gl_FragData[0] = vec4(tcolor0.rgb, compWeight0 * opacity);"];let N=Array.from({length:_},(G,b)=>b),k=N.map(G=>`compWeight${G}`).join(" + "),F=N.map(G=>`(tcolor${G}.rgb * (compWeight${G} / weightSum))`).join(" + ");return[`float weightSum = ${k};`,`gl_FragData[0] = vec4(vec3(${F}), opacity);`]};U.length>0?D=D.concat(o(U,M)):D=D.concat(B(M))}else switch(M){case 1:C&&O>0?D=D.concat(g()):C?D=D.concat([...uo(`
                // Label outline mode for single component
                float centerValue = tvalue.r;
                int segmentIndex = int(centerValue * 255.0);

                // Skip background (segment 0)
                if (segmentIndex == 0) {
                  gl_FragData[0] = vec4(0.0, 0.0, 0.0, 0.0);
                  return;
                }

                // Get outline parameters for this segment (row 0 for single labelmap)
                float textureCoordinate = float(segmentIndex - 1) / labelOutlineTextureWidth;
                float labelmapRow = 0.5 / numLabelmaps;
                float thicknessValue = texture2D(labelOutlineThicknessTexture, vec2(textureCoordinate, labelmapRow)).r;
                float outlineOpacity = texture2D(labelOutlineOpacityTexture, vec2(textureCoordinate, labelmapRow)).r;
                int actualThickness = int(thicknessValue * 255.0);

                // Get color for this segment
                vec3 tColor = texture2D(colorTexture1, vec2(centerValue * cscale0 + cshift0, 0.5)).rgb;
                float scalarOpacity = texture2D(pwfTexture1, vec2(centerValue * pwfscale0 + pwfshift0, 0.5)).r;
                float opacityToUse = scalarOpacity * opacity;

                // Check neighbors for border detection
                bool pixelOnBorder = false;
                for (int i = -actualThickness; i <= actualThickness; i++) {
                  for (int j = -actualThickness; j <= actualThickness; j++) {
                    if (i == 0 && j == 0) {
                      continue;
                    }
                    // Sample neighbor using tangent vectors in texture space
                    vec3 neighborTexCoord = fragTexCoord + float(i) * outlineTangent1_0 * texelSize0 + float(j) * outlineTangent2_0 * texelSize0;

                    // Skip if outside texture bounds
                    if (any(greaterThan(neighborTexCoord, vec3(1.0))) || any(lessThan(neighborTexCoord, vec3(0.0)))) {
                      pixelOnBorder = true;
                      break;
                    }

                    float neighborValue = texture(volumeTexture[0], neighborTexCoord).r;
                    if (neighborValue != centerValue) {
                      pixelOnBorder = true;
                      break;
                    }
                  }
                  if (pixelOnBorder) {
                    break;
                  }
                }

                if (pixelOnBorder) {
                  gl_FragData[0] = vec4(tColor, outlineOpacity);
                } else {
                  gl_FragData[0] = vec4(tColor, opacityToUse);
                }
              `)]):D=D.concat(["// Dependent components","float intensity = tvalue.r;","vec3 tcolor = texture2D(colorTexture1, vec2(intensity * cscale0 + cshift0, 0.5)).rgb;","float scalarOpacity = texture2D(pwfTexture1, vec2(intensity * pwfscale0 + pwfshift0, 0.5)).r;","gl_FragData[0] = vec4(tcolor, scalarOpacity * opacity);"]);break;case 2:D=D.concat(["float intensity = tvalue.r*cscale0 + cshift0;","gl_FragData[0] = vec4(texture2D(colorTexture1, vec2(intensity, 0.5)).rgb, pwfscale0*tvalue.g + pwfshift0);"]);break;case 3:D=D.concat(["vec4 tcolor = cscale0*tvalue + cshift0;","gl_FragData[0] = vec4(texture2D(colorTexture1, vec2(tcolor.r,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.g,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.b,0.5)).r, opacity);"]);break;default:D=D.concat(["vec4 tcolor = cscale0*tvalue + cshift0;","gl_FragData[0] = vec4(texture2D(colorTexture1, vec2(tcolor.r,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.g,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.b,0.5)).r, tcolor.a);"])}v=H.substitute(v,"//VTK::TCoord::Impl",D).result,p.Vertex=x,p.Fragment=v,p.Geometry=T},t.replaceShaderPositionVC=(p,m,d)=>{let x=p.Vertex,T=p.Geometry,v=p.Fragment,C=e.renderable.getSlabThickness(),O=["attribute vec4 vertexWC;","varying vec4 vertexWCVSOutput;"];O=O.concat([`//${t.getMTime()}${e.resliceGeomUpdateString}`]),C>0&&(O=O.concat(["attribute vec3 normalWC;","varying vec3 normalWCVSOutput;"])),x=H.substitute(x,"//VTK::PositionVC::Dec",O).result;let M=["gl_Position = MCPCMatrix * vertexWC;","vertexWCVSOutput = vertexWC;"];C>0&&(M=M.concat(["normalWCVSOutput = normalWC;"])),x=H.substitute(x,"//VTK::PositionVC::Impl",M).result,x=H.substitute(x,"//VTK::Camera::Dec",["uniform mat4 MCPCMatrix;","uniform mat4 MCVCMatrix;"]).result;let S=["varying vec4 vertexWCVSOutput;"];C>0&&(S=S.concat(["varying vec3 normalWCVSOutput;"])),v=H.substitute(v,"//VTK::PositionVC::Dec",S).result,p.Vertex=x,p.Geometry=T,p.Fragment=v},t.updateResliceGeometry=()=>{let p=e.currentValidInputs[0].imageData,{resGeomString:m,slicePD:d,slicePlane:x,orthoSlicing:T,orthoAxis:v}=fi(e.renderable,p);if(!e.resliceGeom||e.resliceGeomUpdateString!==m){if(d)e.resliceGeom||(e.resliceGeom=tt.newInstance()),e.resliceGeom.getPoints().setData(d.getPoints().getData(),3),e.resliceGeom.getPolys().setData(d.getPolys().getData(),1),e.resliceGeom.getPointData().setNormals(d.getPointData().getNormals());else if(x)if(e.resliceGeom||(e.resliceGeom=tt.newInstance()),T){let{points:C,polys:O,normalsData:M}=li(p,x,v,e.transform);e.resliceGeom.getPoints().setData(C,3),e.resliceGeom.getPolys().setData(O,1);let S=Z.newInstance({numberOfComponents:3,values:M,name:"Normals"});e.resliceGeom.getPointData().setNormals(S)}else{let{points:C,polys:O,normalsData:M}=ui(p,x,e.outlineFilter,e.cutter,e.lineToSurfaceFilter);e.resliceGeom.getPoints().setData(C,3),e.resliceGeom.getPolys().setData(O,1);let S=Z.newInstance({numberOfComponents:3,values:M,name:"Normals"});e.resliceGeom.getPointData().setNormals(S)}else kr("Something went wrong.","A default slice plane should have been created in the beginning of","updateResliceGeometry.");e.resliceGeomUpdateString=m,e.resliceGeom?.modified()}};function h(p,m,d){let{width:x,height:T}=sn(p.map(M=>({property:M})),M=>M),v=e.renderable.getLabelOutlineTextureWidth();v<=0&&(v=Math.max(x,e.context.getParameter(e.context.MAX_TEXTURE_SIZE)));let C=new m(v*T);Gr(C,p,v);let O=Se.newInstance({resizable:!1});return O.setOpenGLRenderWindow(e._openGLRenderWindow),O.resetFormatAndType(),O.setMinificationFilter(X.NEAREST),O.setMagnificationFilter(X.NEAREST),O.create2DFromRaw({width:v,height:T,numComps:1,dataType:d,data:C}),O}function y(p,m,d,x,T){let{hash:v}=sn(p.map(C=>({property:C})),C=>C);v!==e[x]&&(e[x]=v,e[T]&&e[T].releaseGraphicsResources(),e[T]=h(p,m,d))}t.updateLabelOutlineThicknessTexture=p=>{y(p.map(({property:m})=>m.getLabelOutlineThicknessByReference()),Uint8Array,re.UNSIGNED_CHAR,"_labelOutlineThicknessHash","labelOutlineThicknessTexture")},t.updateLabelOutlineOpacityTexture=p=>{y(p.map(({property:m})=>{let d=m.getLabelOutlineOpacity();return typeof d=="number"&&(d=[d]),d}),Float32Array,re.FLOAT,"_labelOutlineOpacityHash","labelOutlineOpacityTexture")},t.setScalarTextures=p=>{e.scalarTextures=[...p],e._externalOpenGLTexture=!0},t.delete=at(()=>{e._openGLRenderWindow&&s(e._openGLRenderWindow),e.labelOutlineThicknessTexture&&(e.labelOutlineThicknessTexture.releaseGraphicsResources(),e.labelOutlineThicknessTexture=null),e.labelOutlineOpacityTexture&&(e.labelOutlineOpacityTexture.releaseGraphicsResources(),e.labelOutlineOpacityTexture=null)},t.delete)}var z1={VBOBuildTime:{},VBOBuildString:null,haveSeenDepthRequest:!1,lastHaveSeenDepthRequest:!1,lastIndependentComponents:!1,lastUseLabelOutline:!1,lastNumValidInputs:0,lastNumberOfComponents:0,lastMultiTexturePerVolumeEnabled:!1,lastSlabThickness:0,lastSlabTrapezoidIntegration:0,lastSlabType:-1,scalarTextures:[],_scalarTexturesCore:[],colorTexture:null,_colorTextureCore:null,pwfTexture:null,_pwfTextureCore:null,_defaultColorTexture:null,_defaultPwfTexture:null,labelOutlineProperties:[],labelOutlineThicknessTexture:null,_labelOutlineThicknessHash:null,labelOutlineOpacityTexture:null,_labelOutlineOpacityHash:null,_externalOpenGLTexture:!1,resliceGeom:null,resliceGeomUpdateString:null,tris:null};function W1(t,e,r={}){Object.assign(e,z1,r),ve.extend(t,e,r),Gt.implementReplaceShaderCoincidentOffset(t,e,r),Gt.implementBuildShadersWithReplacements(t,e,r),e.tris=Nt.newInstance(),e.scalarTextures=[],e.colorTexture=null,e.pwfTexture=null,e.VBOBuildTime={},pe(e.VBOBuildTime),e.tmpMat4=L.identity(new Float64Array(16)),e._tmpTexelSize=[0,0,0],e.outlineFilter=ii.newInstance(),e.outlineFilter.setGenerateFaces(!0),e.outlineFilter.setGenerateLines(!1),e.cubePolyData=tt.newInstance(),e.cutter=ni.newInstance(),e.lineToSurfaceFilter=ai.newInstance(),e.transform=ri.newInstance(),Ee(t,e,["scalarTextures"]),b1(t,e)}var I1=ue(W1,"vtkOpenGLImageResliceMapper");_e("vtkImageResliceMapper",I1);function H1(t,e){e.classHierarchy.push("vtkOpenGLVolume"),t.buildPass=r=>{!e.renderable||!e.renderable.getVisibility()||r&&(e._openGLRenderWindow=t.getLastAncestorOfType("vtkOpenGLRenderWindow"),e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer"),e.context=e._openGLRenderWindow.getContext(),t.prepareNodes(),t.addMissingNode(e.renderable.getMapper()),t.removeUnusedNodes())},t.queryPass=(r,n)=>{if(r){if(!e.renderable||!e.renderable.getVisibility())return;n.incrementVolumeCount()}},t.traverseVolumePass=r=>{!e.renderable||!e.renderable.getNestedVisibility()||e._openGLRenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(r,!0),e.children[0].traverse(r),t.apply(r,!1))},t.volumePass=r=>{!e.renderable||!e.renderable.getVisibility()||e.context.depthMask(!r)},t.getKeyMatrices=()=>(e.renderable.getMTime()>e.keyMatrixTime.getMTime()&&(e.renderable.computeMatrix(),L.copy(e.MCWCMatrix,e.renderable.getMatrix()),L.transpose(e.MCWCMatrix,e.MCWCMatrix),e.renderable.getIsIdentity()?ne.identity(e.normalMatrix):(ne.fromMat4(e.normalMatrix,e.MCWCMatrix),ne.invert(e.normalMatrix,e.normalMatrix),ne.transpose(e.normalMatrix,e.normalMatrix)),e.keyMatrixTime.modified()),{mcwc:e.MCWCMatrix,normalMatrix:e.normalMatrix})}var j1={};function P1(t,e,r={}){Object.assign(e,j1,r),ve.extend(t,e,r),e.keyMatrixTime={},pe(e.keyMatrixTime,{mtime:0}),e.normalMatrix=new Float64Array(9),e.MCWCMatrix=new Float64Array(16),de(t,e,["context"]),H1(t,e)}var $1=ue(P1,"vtkOpenGLVolume");_e("vtkVolume",$1);var Hn={NEAREST:0,LINEAR:1,FAST_LINEAR:2},lo={FRACTIONAL:0,PROPORTIONAL:1},jn={DEFAULT:0,ADDITIVE:1,COLORIZE:2,CUSTOM:3},po={OFF:0,NORMALIZED:1,RAW:2},go={InterpolationType:Hn,OpacityMode:lo,ColorMixPreset:jn,FilterMode:po};var Ae={COMPOSITE_BLEND:0,MAXIMUM_INTENSITY_BLEND:1,MINIMUM_INTENSITY_BLEND:2,AVERAGE_INTENSITY_BLEND:3,ADDITIVE_INTENSITY_BLEND:4,RADON_TRANSFORM_BLEND:5,LABELMAP_EDGE_PROJECTION_BLEND:6},np={BlendMode:Ae};function A1(t,e){e.classHierarchy.push("vtkFramebuffer");function r(){e.ownedColorBuffer?.delete(),e.ownedColorBuffer=null}function n(){r(),e.depthTexture&&(e.context?.deleteRenderbuffer(e.depthTexture),e.depthTexture=null),e.colorBuffers=[]}t.getBothMode=()=>e.context.FRAMEBUFFER,t.saveCurrentBindingsAndBuffers=a=>{let i=typeof a<"u"?a:t.getBothMode();t.saveCurrentBindings(i),t.saveCurrentBuffers(i)},t.saveCurrentBindings=a=>{if(!e.context){le("you must set the OpenGLRenderWindow before calling saveCurrentBindings");return}e.previousDrawBinding=e.context.getParameter(e.context.FRAMEBUFFER_BINDING),e.previousActiveFramebuffer=e._openGLRenderWindow.getActiveFramebuffer()},t.saveCurrentBuffers=a=>{},t.restorePreviousBindingsAndBuffers=a=>{let i=typeof a<"u"?a:t.getBothMode();t.restorePreviousBindings(i),t.restorePreviousBuffers(i)},t.restorePreviousBindings=a=>{if(!e.context){le("you must set the OpenGLRenderWindow before calling restorePreviousBindings");return}let i=e.context;i.bindFramebuffer(i.FRAMEBUFFER,e.previousDrawBinding),e._openGLRenderWindow.setActiveFramebuffer(e.previousActiveFramebuffer)},t.restorePreviousBuffers=a=>{},t.bind=(a=null)=>{let i=a;i===null&&(i=e.context.FRAMEBUFFER),e.context.bindFramebuffer(i,e.glFramebuffer),e.colorBuffers.forEach(s=>s?.bind()),e._openGLRenderWindow.setActiveFramebuffer(t)},t.create=(a,i)=>{if(!e.context){le("you must set the OpenGLRenderWindow before calling create");return}let s=e.context,o=e.glFramebuffer,c=o&&s.getParameter(s.FRAMEBUFFER_BINDING)===o,f=o&&e.previousDrawBinding===o;t.releaseGraphicsResources(),e.glFramebuffer=s.createFramebuffer(),e.glFramebuffer.width=a,e.glFramebuffer.height=i,f&&(e.previousDrawBinding=e.glFramebuffer),c&&t.bind()},t.setColorBuffer=(a,i=0)=>{let s=e.context;if(!s){le("you must set the OpenGLRenderWindow before calling setColorBuffer");return}e.colorBuffers[i]===e.ownedColorBuffer&&a!==e.ownedColorBuffer&&r();let o=s.COLOR_ATTACHMENT0;i>0&&(o+=i),e.colorBuffers[i]=a,s.framebufferTexture2D(s.FRAMEBUFFER,o,s.TEXTURE_2D,a.getHandle(),0)},t.removeColorBuffer=(a=0)=>{let i=e.context;if(!i){le("you must set the OpenGLRenderWindow before calling removeColorBuffer");return}e.colorBuffers[a]===e.ownedColorBuffer&&r();let s=i.COLOR_ATTACHMENT0;for(a>0&&(s+=a),i.framebufferTexture2D(i.FRAMEBUFFER,s,i.TEXTURE_2D,null,0),e.colorBuffers[a]=null;e.colorBuffers.length&&e.colorBuffers[e.colorBuffers.length-1]==null;)e.colorBuffers.pop()},t.setDepthBuffer=a=>{if(!e.context){le("you must set the OpenGLRenderWindow before calling setDepthBuffer");return}let i=e.context;i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,a.getHandle(),0)},t.removeDepthBuffer=()=>{if(!e.context){le("you must set the OpenGLRenderWindow before calling removeDepthBuffer");return}let a=e.context;a.framebufferTexture2D(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.TEXTURE_2D,null,0)},t.getGLFramebuffer=()=>e.glFramebuffer,t.setOpenGLRenderWindow=a=>{e._openGLRenderWindow!==a&&(t.releaseGraphicsResources(),e._openGLRenderWindow=a,e.context=null,a&&(e.context=e._openGLRenderWindow.getContext()))},t.releaseGraphicsResources=()=>{n(),e.glFramebuffer&&(e.context?.deleteFramebuffer(e.glFramebuffer),e.glFramebuffer=null)},t.getSize=()=>e.glFramebuffer==null?null:[e.glFramebuffer.width,e.glFramebuffer.height],t.populateFramebuffer=()=>{if(!e.context){le("you must set the OpenGLRenderWindow before calling populateFrameBuffer");return}t.bind();let a=e.context;n();let i=Se.newInstance();i.setOpenGLRenderWindow(e._openGLRenderWindow),i.setMinificationFilter(X.LINEAR),i.setMagnificationFilter(X.LINEAR),i.create2DFromRaw({width:e.glFramebuffer.width,height:e.glFramebuffer.height,numComps:4,dataType:re.UNSIGNED_CHAR,data:null}),e.ownedColorBuffer=i,t.setColorBuffer(i),e.depthTexture=a.createRenderbuffer(),a.bindRenderbuffer(a.RENDERBUFFER,e.depthTexture),a.renderbufferStorage(a.RENDERBUFFER,a.DEPTH_COMPONENT16,e.glFramebuffer.width,e.glFramebuffer.height),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.RENDERBUFFER,e.depthTexture)},t.delete=at(t.releaseGraphicsResources,t.delete)}var K1={glFramebuffer:null,colorBuffers:null,ownedColorBuffer:null,depthTexture:null,previousDrawBinding:0,previousReadBinding:0,previousDrawBuffer:0,previousReadBuffer:0,previousActiveFramebuffer:null};function ap(t,e,r={}){Object.assign(e,K1,r),pe(t,e),e.colorBuffers&&le("you cannot initialize colorBuffers through the constructor. You should call setColorBuffer() instead."),e.colorBuffers=[],Kt(t,e,["colorBuffers"]),A1(t,e)}var X1=ue(ap,"vtkFramebuffer"),gr={newInstance:X1,extend:ap};var ip=`//VTK::System::Dec

/*=========================================================================

  Program:   Visualization Toolkit
  Module:    vtkVolumeVS.glsl

  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
  All rights reserved.
  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.

     This software is distributed WITHOUT ANY WARRANTY; without even
     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
     PURPOSE.  See the above copyright notice for more information.

=========================================================================*/

attribute vec4 vertexDC;

varying vec3 vertexVCVSOutput;
uniform mat4 PCVCMatrix;

uniform float dcxmin;
uniform float dcxmax;
uniform float dcymin;
uniform float dcymax;

void main()
{
  // dcsmall is the device coords reduced to the
  // x y area covered by the volume
  vec4 dcsmall = vec4(
    dcxmin + 0.5 * (vertexDC.x + 1.0) * (dcxmax - dcxmin),
    dcymin + 0.5 * (vertexDC.y + 1.0) * (dcymax - dcymin),
    vertexDC.z,
    vertexDC.w);
  vec4 vcpos = PCVCMatrix * dcsmall;
  vertexVCVSOutput = vcpos.xyz/vcpos.w;
  gl_Position = dcsmall;
}
`;var sp=`//VTK::System::Dec

/*=========================================================================

  Program:   Visualization Toolkit
  Module:    vtkVolumeFS.glsl

  Copyright (c) Ken Martin, Will Schroeder, Bill Lorensen
  All rights reserved.
  See Copyright.txt or http://www.kitware.com/Copyright.htm for details.

     This software is distributed WITHOUT ANY WARRANTY; without even
     the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR
     PURPOSE.  See the above copyright notice for more information.

=========================================================================*/
// Template for the volume mappers fragment shader

const float infinity = 3.402823466e38;

// the output of this shader
//VTK::Output::Dec

in vec3 vertexVCVSOutput;

// From Sources\\Rendering\\Core\\VolumeProperty\\Constants.js
#define COMPOSITE_BLEND 0
#define MAXIMUM_INTENSITY_BLEND 1
#define MINIMUM_INTENSITY_BLEND 2
#define AVERAGE_INTENSITY_BLEND 3
#define ADDITIVE_INTENSITY_BLEND 4
#define RADON_TRANSFORM_BLEND 5
#define LABELMAP_EDGE_PROJECTION_BLEND 6

#define vtkNumberOfLights //VTK::NumberOfLights
#define vtkMaxLaoKernelSize //VTK::MaxLaoKernelSize
#define vtkNumberOfComponents //VTK::NumberOfComponents
#define vtkBlendMode //VTK::BlendMode
#define vtkMaximumNumberOfSamples //VTK::MaximumNumberOfSamples

//VTK::EnabledColorFunctions

//VTK::EnabledLightings

//VTK::EnabledMultiTexturePerVolume

//VTK::EnabledGradientOpacity

//VTK::EnabledIndependentComponents

//VTK::vtkProportionalComponents

//VTK::vtkForceNearestComponents

uniform int twoSidedLighting;

#if vtkMaxLaoKernelSize > 0
  vec2 kernelSample[vtkMaxLaoKernelSize];
#endif

// Textures
#ifdef EnabledMultiTexturePerVolume
  #define vtkNumberOfVolumeTextures vtkNumberOfComponents
#else
  #define vtkNumberOfVolumeTextures 1
#endif
uniform highp sampler3D volumeTexture[vtkNumberOfVolumeTextures];
uniform sampler2D colorTexture;
uniform sampler2D opacityTexture;
uniform sampler2D jtexture;
uniform sampler2D labelOutlineThicknessTexture;

struct Volume {
  // ---- Volume geometry settings ----

  vec3 originVC;          // in VC
  vec3 spacing;           // in VC per IC
  vec3 inverseSpacing;    // 1/spacing
  ivec3 dimensions;       // in IC
  vec3 inverseDimensions; // 1/vec3(dimensions)
  mat3 vecISToVCMatrix;   // convert from IS to VC without translation
  mat3 vecVCToISMatrix;   // convert from VC to IS without translation
  mat3 normalISToVCMatrix; // convert a normal from IS to VC
  mat4 PCWCMatrix;
  mat4 worldToIndex;
  float diagonalLength; // in VC, this is the length of the actor bounds diagonal

  // ---- Texture settings ----

  // Texture shift and scale
  vec4 colorTextureScale;
  vec4 colorTextureShift;
  vec4 opacityTextureScale;
  vec4 opacityTextureShift;

  // The heights defined below are the locations for the up to four components
  // of the transfer functions. The transfer functions have a height of (2 *
  // numberOfComponents) pixels so the values are computed to hit the middle of
  // the two rows for that component
  vec4 transferFunctionsSampleHeight;

  // ---- Mode specific settings ----

  // Independent component default preset settings per component
  vec4 independentComponentMix;

  // Additive / average blending mode settings
  vec4 ipScalarRangeMin;
  vec4 ipScalarRangeMax;

  // ---- Rendering settings ----

  // Lighting
  float ambient;
  float diffuse;
  float specular;
  float specularPower;
  int computeNormalFromOpacity;

  // Gradient opacity
  vec4 gradientOpacityScale;
  vec4 gradientOpacityShift;
  vec4 gradientOpacityMin;
  vec4 gradientOpacityMax;

  // Volume shadow
  float volumetricScatteringBlending;
  float globalIlluminationReach;
  float anisotropy;
  float anisotropySquared;

  // LAO
  int kernelSize;
  int kernelRadius;

  // Label outline
  float outlineOpacity;
};
uniform Volume volume;

struct Light {
  vec3 color;
  vec3 positionVC;
  vec3 directionVC; // normalized
  vec3 halfAngleVC;
  vec3 attenuation;
  float exponent;
  float coneAngle;
  int isPositional;
};
#if vtkNumberOfLights > 0
  uniform Light lights[vtkNumberOfLights];
#endif

uniform float vpWidth;
uniform float vpHeight;
uniform float vpOffsetX;
uniform float vpOffsetY;

// Bitmasks for label outline
const int MAX_SEGMENT_INDEX = 256; // Define as per expected maximum
#define MAX_SEGMENTS 256
#define UINT_SIZE 32
// We add UINT_SIZE - 1, as we want the ceil of the division instead of the
// floor
#define BITMASK_SIZE ((MAX_SEGMENTS + UINT_SIZE - 1) / UINT_SIZE)
uint labelOutlineBitmasks[BITMASK_SIZE];

// Set the corresponding bit in the bitmask
void setLabelOutlineBit(int segmentIndex) {
  int arrayIndex = segmentIndex / UINT_SIZE;
  int bitIndex = segmentIndex % UINT_SIZE;
  labelOutlineBitmasks[arrayIndex] |= 1u << bitIndex;
}

// Check if a bit is set in the bitmask
bool isLabelOutlineBitSet(int segmentIndex) {
  int arrayIndex = segmentIndex / UINT_SIZE;
  int bitIndex = segmentIndex % UINT_SIZE;
  return ((labelOutlineBitmasks[arrayIndex] & (1u << bitIndex)) != 0u);
}

// camera values
uniform float camThick;
uniform float camNear;
uniform float camFar;
uniform int cameraParallel;

//VTK::ClipPlane::Dec

// A random number between 0 and 1 that only depends on the fragment
// It uses the jtexture, so this random seed repeats by blocks of 32 fragments
// in screen space
float fragmentSeed;

// sample texture is global
uniform float sampleDistance;
uniform float volumeShadowSampleDistance;

// declaration for intermixed geometry
//VTK::ZBuffer::Dec

//=======================================================================
// global and custom variables (a temporary section before photorealistics
// rendering module is complete)
vec3 rayDirVC;

#define INV4PI 0.0796
#define EPSILON 0.001
#define PI 3.1415
#define PI2 9.8696

vec4 rawSampleTexture(vec3 pos) {
  #ifdef EnabledMultiTexturePerVolume
    vec4 rawSample;
    rawSample[0] = texture(volumeTexture[0], pos)[0];
    #if vtkNumberOfComponents > 1
      rawSample[1] = texture(volumeTexture[1], pos)[0];
    #endif
    #if vtkNumberOfComponents > 2
      rawSample[2] = texture(volumeTexture[2], pos)[0];
    #endif
    #if vtkNumberOfComponents > 3
      rawSample[3] = texture(volumeTexture[3], pos)[0];
    #endif
    return rawSample;
  #else
    return texture(volumeTexture[0], pos);
  #endif
}

vec4 rawFetchTexture(ivec3 pos) {
  #ifdef EnabledMultiTexturePerVolume
    vec4 rawSample;
    #if vtkNumberOfComponents > 0
      rawSample[0] = texelFetch(volumeTexture[0], pos, 0)[0];
    #endif
    #if vtkNumberOfComponents > 1
      rawSample[1] = texelFetch(volumeTexture[1], pos, 0)[0];
    #endif
    #if vtkNumberOfComponents > 2
      rawSample[2] = texelFetch(volumeTexture[2], pos, 0)[0];
    #endif
    #if vtkNumberOfComponents > 3
      rawSample[3] = texelFetch(volumeTexture[3], pos, 0)[0];
    #endif
    return rawSample;
  #else
    return texelFetch(volumeTexture[0], pos, 0);
  #endif
}

vec4 getTextureValue(vec3 pos) {
  vec4 tmp = rawSampleTexture(pos);

  // Force nearest
  #if defined(vtkComponent0ForceNearest) || \\
      defined(vtkComponent1ForceNearest) || \\
      defined(vtkComponent2ForceNearest) || \\
      defined(vtkComponent3ForceNearest)
    vec3 nearestPos = (floor(pos * vec3(volume.dimensions)) + 0.5) *
                      volume.inverseDimensions;
    vec4 nearestValue = rawSampleTexture(nearestPos);
    #ifdef vtkComponent0ForceNearest
      tmp[0] = nearestValue[0];
    #endif
    #ifdef vtkComponent1ForceNearest
      tmp[1] = nearestValue[1];
    #endif
    #ifdef vtkComponent2ForceNearest
      tmp[2] = nearestValue[2];
    #endif
    #ifdef vtkComponent3ForceNearest
      tmp[3] = nearestValue[3];
    #endif
  #endif

  // Set alpha when using dependent components
  #ifndef EnabledIndependentComponents
    #if vtkNumberOfComponents == 1
      tmp.a = tmp.r;
    #endif
    #if vtkNumberOfComponents == 2
      tmp.a = tmp.g;
    #endif
    #if vtkNumberOfComponents == 3
      tmp.a = length(tmp.rgb);
    #endif
  #endif

  return tmp;
}

// \`height\` is usually \`volume.transferFunctionsSampleHeight[component]\`
// when using independent component and \`0.5\` otherwise. Don't move the if
// statement in these function, as the callers usually already knows if it is
// using independent component or not
float getOpacityFromTexture(float scalar, int component, float height) {
  float scaledScalar = scalar * volume.opacityTextureScale[component] +
                       volume.opacityTextureShift[component];
  return texture2D(opacityTexture, vec2(scaledScalar, height)).r;
}
vec3 getColorFromTexture(float scalar, int component, float height) {
  float scaledScalar = scalar * volume.colorTextureScale[component] +
                       volume.colorTextureShift[component];
  return texture2D(colorTexture, vec2(scaledScalar, height)).rgb;
}

float getRadonOpacity(vec4 tValue) {
  #ifdef EnabledIndependentComponents
    return getOpacityFromTexture(tValue.r, 0, 0.5);
  #else
    #if vtkNumberOfComponents == 1
      return getOpacityFromTexture(tValue.r, 0, 0.5);
    #endif
    #if vtkNumberOfComponents == 2
      return getOpacityFromTexture(tValue.a, 1, 0.5);
    #endif
    #if vtkNumberOfComponents == 3
      return getOpacityFromTexture(tValue.a, 0, 0.5);
    #endif
    #if vtkNumberOfComponents == 4
      return getOpacityFromTexture(tValue.a, 3, 0.5);
    #endif
  #endif
}

vec3 getRadonColor(float normalizedRayIntensity) {
  float colorCoord = clamp(normalizedRayIntensity, 0.0, 1.0);
  return texture2D(colorTexture, vec2(colorCoord, 0.5)).rgb;
}

//=======================================================================
// transformation between VC and IS space

// convert vector position from idx to vc
vec3 posIStoVC(vec3 posIS) {
  return volume.vecISToVCMatrix * posIS + volume.originVC;
}

// convert vector position from vc to idx
vec3 posVCtoIS(vec3 posVC) {
  return volume.vecVCToISMatrix * (posVC - volume.originVC);
}

// Rotate vector to view coordinate
vec3 vecISToVC(vec3 dirIS) {
  return volume.vecISToVCMatrix * dirIS;
}

// Rotate a normal to view coordinate
// Normals use the inverse transpose transform, which is different from
// vecISToVCMatrix when the actor matrix scales or shears the volume
vec3 normalISToVC(vec3 normalIS) {
  return volume.normalISToVCMatrix * normalIS;
}

// Rotate vector to idx coordinate
vec3 vecVCToIS(vec3 dirVC) {
  return volume.vecVCToISMatrix * dirVC;
}

//=======================================================================
// Given a normal compute the gradient opacity factors
float computeGradientOpacityFactor(float normalMag, int component) {
  float goscale = volume.gradientOpacityScale[component];
  float goshift = volume.gradientOpacityShift[component];
  float gomin = volume.gradientOpacityMin[component];
  float gomax = volume.gradientOpacityMax[component];
  return clamp(normalMag * goscale + goshift, gomin, gomax);
}

#ifdef vtkClippingPlanesOn
  bool isPointClipped(vec3 posVC) {
    for (int i = 0; i < clip_numPlanes; ++i) {
      if (dot(vec3(vClipPlaneOrigins[i] - posVC), vClipPlaneNormals[i]) > 0.0) {
        return true;
      }
    }
    return false;
  }
#endif

//=======================================================================
// compute the normal and gradient magnitude for a position, uses forward
// difference

// The output normal is in VC
vec4 computeDensityNormal(vec3 opacityUCoords[2], float opacityTextureHeight,
                          float gradientOpacity, int component) {
  // Pass the scalars through the opacity functions
  vec4 opacityG;
  opacityG.x += getOpacityFromTexture(opacityUCoords[0].x, component,
                                      opacityTextureHeight);
  opacityG.y += getOpacityFromTexture(opacityUCoords[0].y, component,
                                      opacityTextureHeight);
  opacityG.z += getOpacityFromTexture(opacityUCoords[0].z, component,
                                      opacityTextureHeight);
  opacityG.x -= getOpacityFromTexture(opacityUCoords[1].x, component,
                                      opacityTextureHeight);
  opacityG.y -= getOpacityFromTexture(opacityUCoords[1].y, component,
                                      opacityTextureHeight);
  opacityG.z -= getOpacityFromTexture(opacityUCoords[1].z, component,
                                      opacityTextureHeight);

  // Divide by spacing and convert to VC
  opacityG.xyz *= gradientOpacity * volume.inverseSpacing;
  opacityG.w = length(opacityG.xyz);
  if (opacityG.w == 0.0) {
    return vec4(0.0);
  }

  // Normalize
  opacityG.xyz = normalize(normalISToVC(opacityG.xyz));

  return opacityG;
}

// The output normal is in VC
vec4 computeNormalForDensity(vec3 posIS, out vec3 scalarInterp[2],
                             const int opacityComponent) {
  vec3 offsetedPosIS;
  for (int axis = 0; axis < 3; ++axis) {
    // Positive direction
    offsetedPosIS = posIS;
    offsetedPosIS[axis] += volume.inverseDimensions[axis];
    scalarInterp[0][axis] =
        getTextureValue(offsetedPosIS)[opacityComponent];
    #ifdef vtkClippingPlanesOn
      if (isPointClipped(posIStoVC(offsetedPosIS))) {
        scalarInterp[0][axis] = 0.0;
      }
    #endif

    // Negative direction
    offsetedPosIS = posIS;
    offsetedPosIS[axis] -= volume.inverseDimensions[axis];
    scalarInterp[1][axis] =
        getTextureValue(offsetedPosIS)[opacityComponent];
    #ifdef vtkClippingPlanesOn
      if (isPointClipped(posIStoVC(offsetedPosIS))) {
        scalarInterp[1][axis] = 0.0;
      }
    #endif
  }

  vec4 result;
  result.xyz = (scalarInterp[0] - scalarInterp[1]) * volume.inverseSpacing;
  result.w = length(result.xyz);
  if (result.w == 0.0) {
    return vec4(0.0);
  }
  result.xyz = normalize(normalISToVC(result.xyz));
  return result;
}

vec4 fragCoordToPCPos(vec4 fragCoord) {
  return vec4((fragCoord.x / vpWidth - vpOffsetX - 0.5) * 2.0,
              (fragCoord.y / vpHeight - vpOffsetY - 0.5) * 2.0,
              (fragCoord.z - 0.5) * 2.0, 1.0);
}

vec4 pcPosToWorldCoord(vec4 pcPos) {
  return volume.PCWCMatrix * pcPos;
}

vec3 fragCoordToIndexSpace(vec4 fragCoord) {
  vec4 pcPos = fragCoordToPCPos(fragCoord);
  vec4 worldCoord = pcPosToWorldCoord(pcPos);
  vec4 vertex = (worldCoord / worldCoord.w);

  vec3 index = (volume.worldToIndex * vertex).xyz;

  // half voxel fix for labelmapOutline
  return (index + vec3(0.5)) * volume.inverseDimensions;
}

vec3 fragCoordToWorld(vec4 fragCoord) {
  vec4 pcPos = fragCoordToPCPos(fragCoord);
  vec4 worldCoord = pcPosToWorldCoord(pcPos);
  return worldCoord.xyz;
}

//=======================================================================
// Compute the normals and gradient magnitudes for a position for independent
// components The output normals are in VC
mat4 computeMat4Normal(vec3 posIS, vec4 tValue) {
  vec3 xvec = vec3(volume.inverseDimensions.x, 0.0, 0.0);
  vec3 yvec = vec3(0.0, volume.inverseDimensions.y, 0.0);
  vec3 zvec = vec3(0.0, 0.0, volume.inverseDimensions.z);

  vec4 distX = getTextureValue(posIS + xvec) - getTextureValue(posIS - xvec);
  vec4 distY = getTextureValue(posIS + yvec) - getTextureValue(posIS - yvec);
  vec4 distZ = getTextureValue(posIS + zvec) - getTextureValue(posIS - zvec);

  // divide by spacing
  distX *= 0.5 * volume.inverseSpacing.x;
  distY *= 0.5 * volume.inverseSpacing.y;
  distZ *= 0.5 * volume.inverseSpacing.z;

  mat4 result;

  // optionally compute the 1st component
  #if vtkNumberOfComponents > 0 && !defined(vtkComponent0Proportional)
    {
      const int component = 0;
      vec3 normal = vec3(distX[component], distY[component], distZ[component]);
      float normalLength = length(normal);
      if (normalLength > 0.0) {
        normal = normalize(normalISToVC(normal));
      }
      result[component] = vec4(normal, normalLength);
    }
  #endif

  // optionally compute the 2nd component
  #if vtkNumberOfComponents > 1 && !defined(vtkComponent1Proportional)
    {
      const int component = 1;
      vec3 normal = vec3(distX[component], distY[component], distZ[component]);
      float normalLength = length(normal);
      if (normalLength > 0.0) {
        normal = normalize(normalISToVC(normal));
      }
      result[component] = vec4(normal, normalLength);
    }
  #endif

  // optionally compute the 3rd component
  #if vtkNumberOfComponents > 2 && !defined(vtkComponent2Proportional)
    {
      const int component = 2;
      vec3 normal = vec3(distX[component], distY[component], distZ[component]);
      float normalLength = length(normal);
      if (normalLength > 0.0) {
        normal = normalize(normalISToVC(normal));
      }
      result[component] = vec4(normal, normalLength);
    }
  #endif

  // optionally compute the 4th component
  #if vtkNumberOfComponents > 3 && !defined(vtkComponent3Proportional)
    {
      const int component = 3;
      vec3 normal = vec3(distX[component], distY[component], distZ[component]);
      float normalLength = length(normal);
      if (normalLength > 0.0) {
        normal = normalize(normalISToVC(normal));
      }
      result[component] = vec4(normal, normalLength);
    }
  #endif

  return result;
}

//=======================================================================
// global shadow - secondary ray

// henyey greenstein phase function
float phaseFunction(float cos_angle) {
  // divide by 2.0 instead of 4pi to increase intensity
  float anisotropy = volume.anisotropy;
  if (abs(anisotropy) <= EPSILON) {
    // isotropic scatter returns 0.5 instead of 1/4pi to increase intensity
    return 0.5;
  }
  float anisotropy2 = volume.anisotropySquared;
  return ((1.0 - anisotropy2) /
          pow(1.0 + anisotropy2 - 2.0 * anisotropy * cos_angle, 1.5)) /
         2.0;
}

// Compute the two intersection distances of the ray with the volume in VC
// The entry point is \`rayOriginVC + distanceMin * rayDirVC\` and the exit point
// is \`rayOriginVC + distanceMax * rayDirVC\` If distanceMin < distanceMax, the
// volume is not intersected The ray origin is inside the box when distanceMin <
// 0.0 < distanceMax
vec2 rayIntersectVolumeDistances(vec3 rayOriginVC, vec3 rayDirVC) {
  // Compute origin and direction in IS
  vec3 rayOriginIS = posVCtoIS(rayOriginVC);
  vec3 rayDirIS = vecVCToIS(rayDirVC);
  // Division by zero is unspecified in GLSL ES, so zero components of the
  // direction get an infinite inverse instead.
  // Don't check for infinity as the min/max combination afterward will always
  // find an intersection before infinity
  vec3 isParallel = vec3(equal(rayDirIS, vec3(0.0)));
  vec3 invDir = mix(1.0 / (rayDirIS + isParallel), vec3(infinity), isParallel);

  // We have: bound = origin + t * dir
  // So: t = (1/dir) * (bound - origin)
  vec3 distancesTo0 = invDir * (vec3(0.0) - rayOriginIS);
  vec3 distancesTo1 = invDir * (vec3(1.0) - rayOriginIS);
  // Min and max distances to plane intersection per plane
  vec3 dMinPerAxis = min(distancesTo0, distancesTo1);
  vec3 dMaxPerAxis = max(distancesTo0, distancesTo1);
  // Overall first and last intersection
  float distanceMin = max(dMinPerAxis.x, max(dMinPerAxis.y, dMinPerAxis.z));
  float distanceMax = min(dMaxPerAxis.x, min(dMaxPerAxis.y, dMaxPerAxis.z));
  return vec2(distanceMin, distanceMax);
}

//=======================================================================
// local ambient occlusion
#if vtkMaxLaoKernelSize > 0

  // Return a random point on the unit sphere
  vec3 sampleDirectionUniform(int rayIndex) {
    // Each ray of each fragment should be different, two sources of randomness
    // are used. Only depends on ray index
    vec2 rayRandomness = kernelSample[rayIndex];
    // Only depends on fragment
    float fragmentRandomness = fragmentSeed;
    // Merge both source of randomness in a single uniform random variable using
    // the formula (x+y < 1 ? x+y : x+y-1). The simpler formula (x+y)/2 doesn't
    // result in a uniform distribution
    vec2 mergedRandom = rayRandomness + vec2(fragmentRandomness);
    mergedRandom -= vec2(greaterThanEqual(mergedRandom, vec2(1.0)));

    // Insipred by:
    // https://karthikkaranth.me/blog/generating-random-points-in-a-sphere/#better-choice-of-spherical-coordinates
    float u = mergedRandom[0];
    float v = mergedRandom[1];
    float theta = u * 2.0 * PI;
    float phi = acos(2.0 * v - 1.0);
    float sinTheta = sin(theta);
    float cosTheta = cos(theta);
    float sinPhi = sin(phi);
    float cosPhi = cos(phi);
    return vec3(sinPhi * cosTheta, sinPhi * sinTheta, cosPhi);
  }

  float computeLAO(vec3 posVC, vec4 normalVC, float originalOpacity) {
    // apply LAO only at selected locations, otherwise return full brightness
    if (normalVC.w <= 0.0 || originalOpacity <= 0.05) {
      return 1.0;
    }

    #ifdef EnabledGradientOpacity
      float gradientOpacityFactor = computeGradientOpacityFactor(normalVC.w, 0);
    #endif

    float visibilitySum = 0.0;
    float weightSum = 0.0;
    for (int i = 0; i < volume.kernelSize; i++) {
      // Only sample on an hemisphere around the normalVC.xyz axis, so
      // normalDotRay should be negative
      vec3 rayDirectionVC = sampleDirectionUniform(i);
      float normalDotRay = dot(normalVC.xyz, rayDirectionVC);
      if (normalDotRay > 0.0) {
        // Flip rayDirectionVC when it is in the wrong hemisphere
        rayDirectionVC = -rayDirectionVC;
        normalDotRay = -normalDotRay;
      }

      vec3 currPosIS = posVCtoIS(posVC);
      float visibility = 1.0;
      vec3 randomDirStepIS = vecVCToIS(rayDirectionVC * sampleDistance);
      for (int j = 0; j < volume.kernelRadius; j++) {
        currPosIS += randomDirStepIS;
        // If out of the volume, we are done
        if (any(lessThan(currPosIS, vec3(0.0))) ||
            any(greaterThan(currPosIS, vec3(1.0)))) {
          break;
        }
        float opacity = getOpacityFromTexture(getTextureValue(currPosIS).r, 0, 0.5);
        #ifdef EnabledGradientOpacity
          opacity *= gradientOpacityFactor;
        #endif
        visibility *= 1.0 - opacity;
        // If visibility is less than EPSILON, consider it to be 0
        if (visibility < EPSILON) {
          visibility = 0.0;
          break;
        }
      }
      float rayWeight = -normalDotRay;
      visibilitySum += visibility * rayWeight;
      weightSum += rayWeight;
    }

    // If no sample, LAO factor is one
    if (weightSum == 0.0) {
      return 1.0;
    }

    // LAO factor is the average visibility:
    // - visibility low => ambient low
    // - visibility high => ambient high
    float lao = visibilitySum / weightSum;

    // Reduce variance by clamping
    return clamp(lao, 0.3, 1.0);
  }
#endif

//=======================================================================
// Volume shadows
#if vtkNumberOfLights > 0

  // Non-memoised version
  float computeVolumeShadowWithoutCache(vec3 posVC, vec3 lightDirNormVC) {
    // modify sample distance with a random number between 1.5 and 3.0
    float rayStepLength =
        volumeShadowSampleDistance * mix(1.5, 3.0, fragmentSeed);

    // in case the first sample near surface has a very tiled light ray, we need
    // to offset start position
    vec3 initialPosVC = posVC + rayStepLength * lightDirNormVC;

    #ifdef vtkClippingPlanesOn
      float clippingPlanesMaxDistance = infinity;
      for (int i = 0; i < clip_numPlanes; ++i) {
        // Find distance of intersection with the plane
        // Points are clipped when:
        // dot(planeOrigin - (rayOrigin + distance * rayDirection), planeNormal) > 0
        // This is equivalent to:
        // dot(planeOrigin - rayOrigin, planeNormal) - distance * dot(rayDirection,
        // planeNormal) > 0.0
        // We precompute the dot products, so we clip ray points when:
        // dotOrigin - distance * dotDirection > 0.0
        float dotOrigin =
            dot(vClipPlaneOrigins[i] - initialPosVC, vClipPlaneNormals[i]);
        if (dotOrigin > 0.0) {
          // The initialPosVC is clipped by this plane
          return 1.0;
        }
        float dotDirection = dot(lightDirNormVC, vClipPlaneNormals[i]);
        if (dotDirection < 0.0) {
          // We only hit the plane if dotDirection is negative, as (distance is
          // positive)
          float intersectionDistance =
              dotOrigin / dotDirection; // negative divided by negative => positive
          clippingPlanesMaxDistance =
              min(clippingPlanesMaxDistance, intersectionDistance);
        }
      }
    #endif

    vec2 intersectionDistances =
        rayIntersectVolumeDistances(initialPosVC, lightDirNormVC);

    if (intersectionDistances[1] <= intersectionDistances[0] ||
        intersectionDistances[1] <= 0.0) {
      // Volume not hit or behind the ray
      return 1.0;
    }

    // When globalIlluminationReach is 0, no sample at all
    // When globalIlluminationReach is 1, the ray will go through the whole
    // volume
    float maxTravelDistance = mix(0.0, volume.diagonalLength,
                                  volume.globalIlluminationReach);
    float startDistance = max(intersectionDistances[0], 0.0);
    float endDistance = min(intersectionDistances[1], startDistance + maxTravelDistance);
    #ifdef vtkClippingPlanesOn
      endDistance = min(endDistance, clippingPlanesMaxDistance);
    #endif
    if (endDistance - startDistance < 0.0) {
      return 1.0;
    }

    // These two variables are used to compute posIS, without having to call
    // VCtoIS at each step
    vec3 initialPosIS = posVCtoIS(initialPosVC);
    // The light dir is scaled and rotated, but not translated, as it is a
    // vector (w = 0)
    vec3 scaledLightDirIS = vecVCToIS(lightDirNormVC);

    float shadow = 1.0;
    for (float currentDistance = startDistance; currentDistance <= endDistance;
          currentDistance += rayStepLength) {
      vec3 posIS = initialPosIS + currentDistance * scaledLightDirIS;
      vec4 scalar = getTextureValue(posIS);
      float opacity = getOpacityFromTexture(scalar.r, 0, 0.5);
      #if defined(EnabledGradientOpacity) && !defined(EnabledIndependentComponents)
        vec3 scalarInterp[2];
        vec4 normal = computeNormalForDensity(posIS, scalarInterp, 3);
        float opacityFactor = computeGradientOpacityFactor(normal.w, 0);
        opacity *= opacityFactor;
      #endif
      shadow *= 1.0 - opacity;

      // Early termination if shadow coeff is near 0.0
      if (shadow < EPSILON) {
        return 0.0;
      }
    }
    return shadow;
  }

  // Some cache for volume shadows
  struct {
    vec3 posVC;
    float shadow;
  } cachedShadows[vtkNumberOfLights];

  // Memoised version
  float computeVolumeShadow(vec3 posVC, vec3 lightDirNormVC, int lightIdx) {
    if (posVC == cachedShadows[lightIdx].posVC) {
      return cachedShadows[lightIdx].shadow;
    }
    float shadow = computeVolumeShadowWithoutCache(posVC, lightDirNormVC);
    cachedShadows[lightIdx].posVC = posVC;
    cachedShadows[lightIdx].shadow = shadow;
    return shadow;
  }

#endif

//=======================================================================
// surface light contribution
#if vtkNumberOfLights > 0
  vec3 applyLighting(vec3 tColor, vec4 normalVC) {
    vec3 diffuse = vec3(0.0, 0.0, 0.0);
    vec3 specular = vec3(0.0, 0.0, 0.0);
    for (int lightIdx = 0; lightIdx < vtkNumberOfLights; lightIdx++) {
      float df = dot(normalVC.xyz, lights[lightIdx].directionVC);
      if (df > 0.0) {
        diffuse += df * lights[lightIdx].color;
        float sf = dot(normalVC.xyz, -lights[lightIdx].halfAngleVC);
        if (sf > 0.0) {
          specular += pow(sf, volume.specularPower) * lights[lightIdx].color;
        }
      }
    }
    return tColor * (diffuse * volume.diffuse + volume.ambient) +
          specular * volume.specular;
  }

  vec3 applySurfaceShadowLighting(vec3 tColor, float alpha, vec3 posVC,
                                  vec4 normalVC) {
    // everything in VC
    vec3 diffuse = vec3(0.0);
    vec3 specular = vec3(0.0);
    for (int ligthIdx = 0; ligthIdx < vtkNumberOfLights; ligthIdx++) {
      vec3 vertLightDirection;
      float attenuation;
      if (lights[ligthIdx].isPositional == 1) {
        vertLightDirection = posVC - lights[ligthIdx].positionVC;
        float lightDistance = length(vertLightDirection);
        // Normalize with precomputed length
        vertLightDirection = vertLightDirection / lightDistance;
        // Base attenuation
        vec3 attenuationPolynom = lights[ligthIdx].attenuation;
        attenuation =
            1.0 / (attenuationPolynom[0] +
                  lightDistance * (attenuationPolynom[1] +
                                    lightDistance * attenuationPolynom[2]));
        // Cone attenuation
        float coneDot = dot(vertLightDirection, lights[ligthIdx].directionVC);
        // Per OpenGL standard cone angle is 90 or less for a spot light
        if (lights[ligthIdx].coneAngle <= 90.0) {
          if (coneDot >= cos(radians(lights[ligthIdx].coneAngle))) {
            // Inside the cone
            attenuation *= pow(coneDot, lights[ligthIdx].exponent);
          } else {
            // Outside the cone
            attenuation = 0.0;
          }
        }
      } else {
        vertLightDirection = lights[ligthIdx].directionVC;
        attenuation = 1.0;
      }

      float ndotL = dot(normalVC.xyz, vertLightDirection);
      if (ndotL < 0.0 && twoSidedLighting == 1) {
        ndotL = -ndotL;
      }
      if (ndotL > 0.0) {
        // Diffuse
        diffuse += ndotL * attenuation * lights[ligthIdx].color;
        // Specular
        float vdotR =
            dot(-rayDirVC, normalize(vertLightDirection - 2.0 * ndotL * normalVC.xyz));
        if (vdotR > 0.0) {
          specular += pow(vdotR, volume.specularPower) * attenuation *
                      lights[ligthIdx].color;
        }
      }
    }
    #if vtkMaxLaoKernelSize > 0
      float laoFactor = computeLAO(posVC, normalVC, alpha);
    #else
      const float laoFactor = 1.0;
    #endif
    return tColor * (diffuse * volume.diffuse +
                    volume.ambient * laoFactor) +
          specular * volume.specular;
  }

  vec3 applyVolumeShadowLighting(vec3 tColor, vec3 posVC) {
    // Here we have no effect of cones and no attenuation
    vec3 diffuse = vec3(0.0);
    for (int lightIdx = 0; lightIdx < vtkNumberOfLights; lightIdx++) {
      vec3 lightDirVC = lights[lightIdx].isPositional == 1
                            ? normalize(lights[lightIdx].positionVC - posVC)
                            : -lights[lightIdx].directionVC;
      float shadowCoeff = computeVolumeShadow(posVC, lightDirVC, lightIdx);
      float phaseAttenuation = phaseFunction(dot(rayDirVC, lightDirVC));
      diffuse += phaseAttenuation * shadowCoeff * lights[lightIdx].color;
    }
    return tColor * (diffuse * volume.diffuse + volume.ambient);
  }
#endif

// LAO of surface shadows and volume shadows only work with dependent components
vec3 applyAllLightning(vec3 tColor, float alpha, vec3 posVC,
                       vec4 surfaceNormalVC) {
  #if vtkNumberOfLights > 0
    // 0 <= volCoeff < EPSILON => only surface shadows
    // EPSILON <= volCoeff < 1 - EPSILON => mix of surface and volume shadows
    // 1 - EPSILON <= volCoeff => only volume shadows
    float volCoeff = volume.volumetricScatteringBlending *
                    (1.0 - alpha / 2.0) *
                    (1.0 - atan(surfaceNormalVC.w) * INV4PI);

    // Compute surface lighting if needed
    vec3 surfaceShadedColor = tColor;
    #ifdef EnableSurfaceLighting
      if (volCoeff < 1.0 - EPSILON) {
        surfaceShadedColor =
            applySurfaceShadowLighting(tColor, alpha, posVC, surfaceNormalVC);
      }
    #endif

    // Compute volume lighting if needed
    vec3 volumeShadedColor = tColor;
    #ifdef EnableVolumeLighting
      if (volCoeff >= EPSILON) {
        volumeShadedColor = applyVolumeShadowLighting(tColor, posVC);
      }
    #endif

    // Return the right mix
    if (volCoeff < EPSILON) {
      // Surface shadows
      return surfaceShadedColor;
    }
    if (volCoeff >= 1.0 - EPSILON) {
      // Volume shadows
      return volumeShadedColor;
    }
    // Mix of surface and volume shadows
    return mix(surfaceShadedColor, volumeShadedColor, volCoeff);
  #endif
  return tColor;
}

vec4 getColorForLabelOutline() {
  vec3 centerPosIS =
      fragCoordToIndexSpace(gl_FragCoord); // pos in texture space
  vec4 centerValue = getTextureValue(centerPosIS);
  bool pixelOnBorder = false;
  vec4 tColor = vec4(getColorFromTexture(centerValue.r, 0, 0.5),
                     getOpacityFromTexture(centerValue.r, 0, 0.5));

  int segmentIndex = int(centerValue.r * 255.0);

  // Use texture sampling for outlineThickness
  float textureCoordinate = float(segmentIndex - 1) / 1024.0;
  float textureValue =
      texture2D(labelOutlineThicknessTexture, vec2(textureCoordinate, 0.5)).r;
  int actualThickness = int(textureValue * 255.0);

  // If it is the background (segment index 0), we should quickly bail out.
  // Previously, this was determined by tColor.a, which was incorrect as it
  // prevented the outline from appearing when the fill is 0.
  if (segmentIndex == 0) {
    return vec4(0, 0, 0, 0);
  }

  // Only perform outline check on fragments rendering voxels that aren't
  // invisible. Saves a bunch of needless checks on the background.
  // TODO define epsilon when building shader?
  for (int i = -actualThickness; i <= actualThickness; i++) {
    for (int j = -actualThickness; j <= actualThickness; j++) {
      if (i == 0 && j == 0) {
        continue;
      }

      vec4 neighborPixelCoord =
          vec4(gl_FragCoord.x + float(i), gl_FragCoord.y + float(j),
               gl_FragCoord.z, gl_FragCoord.w);

      vec3 neighborPosIS = fragCoordToIndexSpace(neighborPixelCoord);
      vec4 value = getTextureValue(neighborPosIS);

      // If any of my neighbours are not the same value as I
      // am, this means I am on the border of the segment.
      // We can break the loops
      if (any(notEqual(value, centerValue))) {
        pixelOnBorder = true;
        break;
      }
    }

    if (pixelOnBorder == true) {
      break;
    }
  }

  // If I am on the border, I am displayed at full opacity
  if (pixelOnBorder == true) {
    tColor.a = volume.outlineOpacity;
  }

  return tColor;
}

vec4 getColorForAdditivePreset(vec4 tValue, vec3 posVC, vec3 posIS) {
  // compute normals
  mat4 normalMat = computeMat4Normal(posIS, tValue);
  vec4 normalLights[2];
  normalLights[0] = normalMat[0];
  normalLights[1] = normalMat[1];
  #if vtkNumberOfLights > 0
    if (volume.computeNormalFromOpacity == 1) {
      for (int component = 0; component < 2; ++component) {
        vec3 scalarInterp[2];
        float height = volume.transferFunctionsSampleHeight[component];
        computeNormalForDensity(posIS, scalarInterp, component);
        normalLights[component] =
            computeDensityNormal(scalarInterp, height, 1.0, component);
      }
    }
  #endif

  // compute opacities
  float opacities[2];
  opacities[0] = getOpacityFromTexture(
      tValue[0], 0, volume.transferFunctionsSampleHeight[0]);
  opacities[1] = getOpacityFromTexture(
      tValue[1], 1, volume.transferFunctionsSampleHeight[1]);
  #ifdef EnabledGradientOpacity
    for (int component = 0; component < 2; ++component) {
      opacities[component] *=
          computeGradientOpacityFactor(normalMat[component].a, component);
    }
  #endif
  float opacitySum = opacities[0] + opacities[1];
  if (opacitySum <= 0.0) {
    return vec4(0.0);
  }

  // mix the colors and opacities
  vec3 colors[2];
  for (int component = 0; component < 2; ++component) {
    float sampleHeight = volume.transferFunctionsSampleHeight[component];
    vec3 color = getColorFromTexture(tValue[component], component, sampleHeight);
    color = applyAllLightning(color, opacities[component], posVC,
                              normalLights[component]);
    colors[component] = color;
  }
  vec3 mixedColor =
      (opacities[0] * colors[0] + opacities[1] * colors[1]) / opacitySum;
  return vec4(mixedColor, min(1.0, opacitySum));
}

vec4 getColorForColorizePreset(vec4 tValue, vec3 posVC, vec3 posIS) {
  // compute normals
  mat4 normalMat = computeMat4Normal(posIS, tValue);
  vec4 normalLight = normalMat[0];
  #if vtkNumberOfLights > 0
    if (volume.computeNormalFromOpacity == 1) {
      vec3 scalarInterp[2];
      float height = volume.transferFunctionsSampleHeight[0];
      computeNormalForDensity(posIS, scalarInterp, 0);
      normalLight = computeDensityNormal(scalarInterp, height, 1.0, 0);
    }
  #endif

  // compute opacities
  float opacity = getOpacityFromTexture(
      tValue[0], 0, volume.transferFunctionsSampleHeight[0]);
  #ifdef EnabledGradientOpacity
    opacity *= computeGradientOpacityFactor(normalMat[0].a, 0);
  #endif

  // colorizing component
  vec3 colorizingColor = getColorFromTexture(
      tValue[0], 1, volume.transferFunctionsSampleHeight[1]);
  float colorizingOpacity = getOpacityFromTexture(
      tValue[1], 1, volume.transferFunctionsSampleHeight[1]);

  // mix the colors and opacities
  vec3 color =
      getColorFromTexture(tValue[0], 0,
                          volume.transferFunctionsSampleHeight[0]) *
      mix(vec3(1.0), colorizingColor, colorizingOpacity);
  color = applyAllLightning(color, opacity, posVC, normalLight);
  return vec4(color, opacity);
}

vec4 getColorForDefaultIndependentPreset(vec4 tValue, vec3 posIS) {

  // compute the normal vectors as needed
  #if defined(EnabledGradientOpacity) || vtkNumberOfLights > 0
    mat4 normalMat = computeMat4Normal(posIS, tValue);
  #endif

  // process color and opacity for each component
  // initial value of alpha is determined by wether the first component is
  // proportional or not
  #if defined(vtkComponent0Proportional)
    // when it is proportional, it starts at 1 (neutral for multiplications)
    float alpha = 1.0;
  #else
    // when it is not proportional, it starts at 0 (neutral for additions)
    float alpha = 0.0;
  #endif

  vec3 mixedColor = vec3(0.0);
  #if vtkNumberOfComponents > 0
    {
      const int component = 0;
      vec3 color = getColorFromTexture(
          tValue[component], component,
          volume.transferFunctionsSampleHeight[component]);
      float opacity = getOpacityFromTexture(
          tValue[component], component,
          volume.transferFunctionsSampleHeight[component]);
      #if !defined(vtkComponent0Proportional)
        float alphaContribution = volume.independentComponentMix[component] * opacity;
        #ifdef EnabledGradientOpacity
          alphaContribution *= computeGradientOpacityFactor(normalMat[component].a, component);
        #endif
        alpha += alphaContribution;
        #if vtkNumberOfLights > 0
          color = applyLighting(color, normalMat[component]);
        #endif
      #else
        color *= opacity;
        alpha *= mix(opacity, 1.0,
                    (1.0 - volume.independentComponentMix[component]));
      #endif
      mixedColor += volume.independentComponentMix[component] * color;
    }
  #endif
  #if vtkNumberOfComponents > 1
    {
      const int component = 1;
      vec3 color = getColorFromTexture(
          tValue[component], component,
          volume.transferFunctionsSampleHeight[component]);
      float opacity = getOpacityFromTexture(
          tValue[component], component,
          volume.transferFunctionsSampleHeight[component]);
      #if !defined(vtkComponent1Proportional)
        float alphaContribution = volume.independentComponentMix[component] * opacity;
        #ifdef EnabledGradientOpacity
          alphaContribution *= computeGradientOpacityFactor(normalMat[component].a, component);
        #endif
        alpha += alphaContribution;
        #if vtkNumberOfLights > 0
          color = applyLighting(color, normalMat[component]);
        #endif
      #else
        color *= opacity;
        alpha *= mix(opacity, 1.0,
                    (1.0 - volume.independentComponentMix[component]));
      #endif
      mixedColor += volume.independentComponentMix[component] * color;
    }
  #endif
  #if vtkNumberOfComponents > 2
    {
      const int component = 2;
      vec3 color = getColorFromTexture(
          tValue[component], component,
          volume.transferFunctionsSampleHeight[component]);
      float opacity = getOpacityFromTexture(
          tValue[component], component,
          volume.transferFunctionsSampleHeight[component]);
      #if !defined(vtkComponent2Proportional)
        float alphaContribution = volume.independentComponentMix[component] * opacity;
        #ifdef EnabledGradientOpacity
          alphaContribution *= computeGradientOpacityFactor(normalMat[component].a, component);
        #endif
        alpha += alphaContribution;
        #if vtkNumberOfLights > 0
          color = applyLighting(color, normalMat[component]);
        #endif
      #else
        color *= opacity;
        alpha *= mix(opacity, 1.0,
                    (1.0 - volume.independentComponentMix[component]));
      #endif
      mixedColor += volume.independentComponentMix[component] * color;
    }
  #endif
  #if vtkNumberOfComponents > 3
    {
      const int component = 3;
      vec3 color = getColorFromTexture(
          tValue[component], component,
          volume.transferFunctionsSampleHeight[component]);
      float opacity = getOpacityFromTexture(
          tValue[component], component,
          volume.transferFunctionsSampleHeight[component]);
      #if !defined(vtkComponent3Proportional)
        float alphaContribution = volume.independentComponentMix[component] * opacity;
        #ifdef EnabledGradientOpacity
          alphaContribution *= computeGradientOpacityFactor(normalMat[component].a, component);
        #endif
        alpha += alphaContribution;
        #if vtkNumberOfLights > 0
          color = applyLighting(color, normalMat[component]);
        #endif
      #else
        color *= opacity;
        alpha *= mix(opacity, 1.0,
                    (1.0 - volume.independentComponentMix[component]));
      #endif
      mixedColor += volume.independentComponentMix[component] * color;
    }
  #endif

  return vec4(mixedColor, alpha);
}

vec4 getColorForDependentComponents(vec4 tValue, vec3 posVC, vec3 posIS) {
  #if defined(EnabledGradientOpacity) || vtkNumberOfLights > 0
    // use component 3 of the opacity texture as getTextureValue() sets alpha to
    // the opacity value
    vec3 scalarInterp[2];
    vec4 normal0 = computeNormalForDensity(posIS, scalarInterp, 3);
    float gradientOpacity = computeGradientOpacityFactor(normal0.a, 0);
  #endif

  // get color and opacity
  #if vtkNumberOfComponents == 1
    vec3 tColor = getColorFromTexture(tValue.r, 0, 0.5);
    float alpha = getOpacityFromTexture(tValue.r, 0, 0.5);
  #endif
  #if vtkNumberOfComponents == 2
    vec3 tColor = vec3(tValue.r * volume.colorTextureScale[0] +
                  volume.colorTextureShift[0]);
    float alpha = getOpacityFromTexture(tValue.a, 1, 0.5);
  #endif
  #if vtkNumberOfComponents == 3
      vec3 tColor = tValue.rgb * volume.colorTextureScale.rgb +
              volume.colorTextureShift.rgb;
      float alpha = getOpacityFromTexture(tValue.a, 0, 0.5);
  #endif
  #if vtkNumberOfComponents == 4
      vec3 tColor = tValue.rgb * volume.colorTextureScale.rgb +
              volume.colorTextureShift.rgb;
      float alpha = getOpacityFromTexture(tValue.a, 3, 0.5);
  #endif

  // Apply gradient opacity
  #if defined(EnabledGradientOpacity)
    alpha *= gradientOpacity;
  #endif

  #if vtkNumberOfComponents == 1
    if (alpha < EPSILON) {
      return vec4(0.0);
    }
  #endif

  // lighting
  #if vtkNumberOfLights > 0
    vec4 normalLight;
    if (volume.computeNormalFromOpacity == 1) {
      if (normal0[3] != 0.0) {
        normalLight =
            computeDensityNormal(scalarInterp, 0.5, gradientOpacity, 0);
        if (normalLight[3] == 0.0) {
          normalLight = normal0;
        }
      }
    } else {
      normalLight = normal0;
    }
    tColor = applyAllLightning(tColor, alpha, posVC, normalLight);
  #endif

  return vec4(tColor, alpha);
}

vec4 getColorForValue(vec4 tValue, vec3 posVC, vec3 posIS) {
  #ifdef EnableColorForValueFunctionId0
    return getColorForDependentComponents(tValue, posVC, posIS);
  #endif

  #ifdef EnableColorForValueFunctionId1
    return getColorForAdditivePreset(tValue, posVC, posIS);
  #endif

  #ifdef EnableColorForValueFunctionId2
    return getColorForColorizePreset(tValue, posVC, posIS);
  #endif

  #ifdef EnableColorForValueFunctionId3
    /*
      * Mix the color information from all the independent components to get a
      * single rgba output. See other shader functions like
      * \`getColorForAdditivePreset\` to learn how to create a custom color mix.
      * The custom color mix should return a value, but if it doesn't, it will
      * fallback on the default shading
      */
    //VTK::CustomColorMix
  #endif

  #if defined(EnableColorForValueFunctionId4) || defined(EnableColorForValueFunctionId3)
    return getColorForDefaultIndependentPreset(tValue, posIS);
  #endif

  #ifdef EnableColorForValueFunctionId5
    return getColorForLabelOutline();
  #endif
}

bool valueWithinScalarRange(vec4 val) {
  #if vtkNumberOfComponents > 1 && !defined(EnabledIndependentComponents)
    return false;
  #endif
  vec4 rangeMin = volume.ipScalarRangeMin;
  vec4 rangeMax = volume.ipScalarRangeMax;
  for (int component = 0; component < vtkNumberOfComponents; ++component) {
    if (val[component] < rangeMin[component] ||
        rangeMax[component] < val[component]) {
      return false;
    }
  }
  return true;
}

#if vtkBlendMode == LABELMAP_EDGE_PROJECTION_BLEND
  bool checkOnEdgeForNeighbor(int xFragmentOffset, int yFragmentOffset,
                              int segmentIndex, vec3 stepIS) {
    vec3 volumeDimensions = vec3(volume.dimensions);
    vec4 neighborPixelCoord = vec4(gl_FragCoord.x + float(xFragmentOffset),
                                  gl_FragCoord.y + float(yFragmentOffset),
                                  gl_FragCoord.z, gl_FragCoord.w);
    vec3 originalNeighborPosIS = fragCoordToIndexSpace(neighborPixelCoord);

    vec3 neighborPosIS = originalNeighborPosIS;
    for (int k = 0; k < vtkMaximumNumberOfSamples / 2; ++k) {
      ivec3 texCoord = ivec3(neighborPosIS * volumeDimensions);
      vec4 texValue = rawFetchTexture(texCoord);
      if (int(texValue.g) == segmentIndex) {
        // not on edge
        return false;
      }
      neighborPosIS += stepIS;
    }

    neighborPosIS = originalNeighborPosIS;
    for (int k = 0; k < vtkMaximumNumberOfSamples / 2; ++k) {
      ivec3 texCoord = ivec3(neighborPosIS * volumeDimensions);
      vec4 texValue = rawFetchTexture(texCoord);
      if (int(texValue.g) == segmentIndex) {
        // not on edge
        return false;
      }
      neighborPosIS -= stepIS;
    }

    // onedge
    float sampleHeight = volume.transferFunctionsSampleHeight[1];
    vec3 tColorSegment =
        getColorFromTexture(float(segmentIndex), 1, sampleHeight);
    float pwfValueSegment =
        getOpacityFromTexture(float(segmentIndex), 1, sampleHeight);
    gl_FragData[0] = vec4(tColorSegment, pwfValueSegment);
    return true;
  }
#endif

vec4 getColorAtPos(vec3 posVC) {
  vec3 posIS = posVCtoIS(posVC);
  vec4 texValue = getTextureValue(posIS);
  return getColorForValue(texValue, posVC, posIS);
}

//=======================================================================
// Apply the specified blend mode operation along the ray's path.
//
void applyBlend(vec3 rayOriginVC, vec3 rayDirVC, float minDistance,
                float maxDistance) {
  // start slightly inside and apply some jitter
  vec3 stepVC = rayDirVC * sampleDistance;
  float raySteps = (maxDistance - minDistance) / sampleDistance;

  // Avoid 0.0 jitter
  float jitter = 0.01 + 0.99 * fragmentSeed;

  #if vtkBlendMode == COMPOSITE_BLEND
    // now map through opacity and color
    vec3 firstPosVC = rayOriginVC + minDistance * rayDirVC;
    vec4 firstColor = getColorAtPos(firstPosVC);

    // handle very thin volumes
    if (raySteps <= 1.0) {
      firstColor.a = 1.0 - pow(1.0 - firstColor.a, raySteps);
      gl_FragData[0] = firstColor;
      return;
    }

    // first color only counts for \`jitter\` factor of the step
    firstColor.a = 1.0 - pow(1.0 - firstColor.a, jitter);
    vec4 color = vec4(firstColor.rgb * firstColor.a, firstColor.a);
    vec3 posVC = firstPosVC + jitter * stepVC;
    float stepsTraveled = jitter;

    for (int i = 0; i < vtkMaximumNumberOfSamples; ++i) {
      // If we have reached the last step, break
      if (stepsTraveled + 1.0 >= raySteps) {
        break;
      }
      vec4 tColor = getColorAtPos(posVC);

      color = color + vec4(tColor.rgb * tColor.a, tColor.a) * (1.0 - color.a);
      stepsTraveled++;
      posVC += stepVC;
      if (color.a > 0.99) {
        color.a = 1.0;
        break;
      }
    }

    if (color.a < 0.99 && (raySteps - stepsTraveled) > 0.0) {
      vec3 endPosVC = rayOriginVC + maxDistance * rayDirVC;
      vec4 tColor = getColorAtPos(endPosVC);
      tColor.a = 1.0 - pow(1.0 - tColor.a, raySteps - stepsTraveled);

      float mix = (1.0 - color.a);
      color = color + vec4(tColor.rgb * tColor.a, tColor.a) * mix;
    }

    gl_FragData[0] = vec4(color.rgb / color.a, color.a);
  #endif

  #if vtkBlendMode == MAXIMUM_INTENSITY_BLEND ||                                 \\
      vtkBlendMode == MINIMUM_INTENSITY_BLEND
    // Find maximum/minimum intensity along the ray.

    // Define the operation we will use (min or max)
    #if vtkBlendMode == MAXIMUM_INTENSITY_BLEND
      #define OP max
    #else
      #define OP min
    #endif

    vec3 posVC = rayOriginVC + minDistance * rayDirVC;
    float stepsTraveled = 0.0;

    // Find a value to initialize the selected variables
    vec4 selectedValue;
    vec3 selectedPosVC;
    vec3 selectedPosIS;
    {
      vec3 posIS = posVCtoIS(posVC);
      selectedValue = getTextureValue(posIS);
      selectedPosVC = posVC;
      selectedPosIS = posIS;
    }

    // If the clipping range is shorter than the sample distance
    // we can skip the sampling loop along the ray.
    if (raySteps <= 1.0) {
      gl_FragData[0] = getColorForValue(selectedValue, selectedPosVC, selectedPosIS);
      return;
    }

    posVC += jitter * stepVC;
    stepsTraveled += jitter;

    // Sample along the ray until vtkMaximumNumberOfSamples,
    // ending slightly inside the total distance
    for (int i = 0; i < vtkMaximumNumberOfSamples; ++i) {
      // If we have reached the last step, break
      if (stepsTraveled + 1.0 >= raySteps) {
        break;
      }

      // Get selected values
      vec3 posIS = posVCtoIS(posVC);
      vec4 previousSelectedValue = selectedValue;
      vec4 currentValue = getTextureValue(posIS);
      selectedValue = OP(selectedValue, currentValue);
      if (previousSelectedValue != selectedValue) {
        selectedPosVC = posVC;
        selectedPosIS = posIS;
      }

      // Otherwise, continue along the ray
      stepsTraveled++;
      posVC += stepVC;
    }

    // Perform the last step along the ray using the
    // residual distance
    posVC = rayOriginVC + maxDistance * rayDirVC;
    {
      vec3 posIS = posVCtoIS(posVC);
      vec4 previousSelectedValue = selectedValue;
      vec4 currentValue = getTextureValue(posIS);
      selectedValue = OP(selectedValue, currentValue);
      if (previousSelectedValue != selectedValue) {
        selectedPosVC = posVC;
        selectedPosIS = posIS;
      }
    }

    gl_FragData[0] = getColorForValue(selectedValue, selectedPosVC, selectedPosIS);
  #endif

  #if vtkBlendMode == ADDITIVE_INTENSITY_BLEND ||                                \\
      vtkBlendMode == AVERAGE_INTENSITY_BLEND
    vec4 sum = vec4(0.);
    #if vtkBlendMode == AVERAGE_INTENSITY_BLEND
      float totalWeight = 0.0;
    #endif
    vec3 posVC = rayOriginVC + minDistance * rayDirVC;
    float stepsTraveled = 0.0;

    vec3 posIS = posVCtoIS(posVC);
    vec4 value = getTextureValue(posIS);

    if (raySteps <= 1.0) {
      gl_FragData[0] = vec4(0.0);
      if (valueWithinScalarRange(value)) {
        gl_FragData[0] = getColorForValue(value, posVC, posIS);
      }
      return;
    }

    if (valueWithinScalarRange(value)) {
      sum += value * jitter;
      #if vtkBlendMode == AVERAGE_INTENSITY_BLEND
        totalWeight += jitter;
      #endif
    }
    posVC += jitter * stepVC;
    stepsTraveled += jitter;

    // Sample along the ray until vtkMaximumNumberOfSamples,
    // ending slightly inside the total distance
    for (int i = 0; i < vtkMaximumNumberOfSamples; ++i) {
      // If we have reached the last step, break
      if (stepsTraveled + 1.0 >= raySteps) {
        break;
      }

      posIS = posVCtoIS(posVC);
      value = getTextureValue(posIS);
      // One can control the scalar range by setting the AverageIPScalarRange to
      // disregard scalar values, not in the range of interest, from the average
      // computation. Notes:
      // - We are comparing all values in the texture to see if any of them
      //   are outside of the scalar range. In the future we might want to allow
      //   scalar ranges for each component.
      if (valueWithinScalarRange(value)) {
        sum += value;
        #if vtkBlendMode == AVERAGE_INTENSITY_BLEND
          totalWeight++;
        #endif
      }

      stepsTraveled++;
      posVC += stepVC;
    }

    // Perform the last step along the ray using the
    // residual distance
    posVC = rayOriginVC + maxDistance * rayDirVC;
    posIS = posVCtoIS(posVC);
    value = getTextureValue(posIS);
    if (valueWithinScalarRange(value)) {
      sum += value * (raySteps - stepsTraveled);
      #if vtkBlendMode == AVERAGE_INTENSITY_BLEND
        totalWeight += raySteps - stepsTraveled;
      #endif
    }

    if (totalWeight > 0.0) {
      #if vtkBlendMode == AVERAGE_INTENSITY_BLEND
        sum /= vec4(totalWeight, totalWeight, totalWeight, 1.0);
      #endif
      gl_FragData[0] = getColorForValue(sum, posVC, posIS);
    } else {
      gl_FragData[0] = vec4(0.0);
    }
  #endif

  #if vtkBlendMode == RADON_TRANSFORM_BLEND
    float normalizedRayIntensity = 1.0;
    vec3 firstPosVC = rayOriginVC + minDistance * rayDirVC;
    vec3 posVC = firstPosVC;
    float stepsTraveled = 0.0;

    // handle very thin volumes
    if (raySteps <= 1.0) {
      vec3 posIS = posVCtoIS(posVC);
      vec4 tValue = getTextureValue(posIS);
      normalizedRayIntensity -= raySteps * sampleDistance *
                                getRadonOpacity(tValue);
      gl_FragData[0] =
          vec4(getRadonColor(normalizedRayIntensity), 1.0);
      return;
    }

    vec3 firstPosIS = posVCtoIS(firstPosVC);
    vec4 firstValue = getTextureValue(firstPosIS);
    normalizedRayIntensity -=
        jitter * sampleDistance * getRadonOpacity(firstValue);

    posVC += jitter * stepVC;
    stepsTraveled += jitter;

    for (int i = 0; i < vtkMaximumNumberOfSamples; ++i) {
      if (stepsTraveled + 1.0 >= raySteps) {
        break;
      }

      vec3 posIS = posVCtoIS(posVC);
      vec4 value = getTextureValue(posIS);
      // Convert scalar value to normalizedRayIntensity coefficient and
      // accumulate normalizedRayIntensity
      normalizedRayIntensity -=
          sampleDistance * getRadonOpacity(value);

      posVC += stepVC;
      stepsTraveled++;
    }

    if ((raySteps - stepsTraveled) > 0.0) {
      vec3 endPosIS = clamp(
        posVCtoIS(rayOriginVC + maxDistance * rayDirVC),
        vec3(0.0), vec3(1.0));
      vec4 endValue = getTextureValue(endPosIS);
      normalizedRayIntensity -=
          (raySteps - stepsTraveled) * sampleDistance * getRadonOpacity(endValue);
    }

    // map normalizedRayIntensity to color
    gl_FragData[0] =
        vec4(getRadonColor(normalizedRayIntensity), 1.0);
  #endif

  #if vtkBlendMode == LABELMAP_EDGE_PROJECTION_BLEND
    // Only works with a single volume
    vec3 posVC = rayOriginVC + minDistance * rayDirVC;
    float stepsTraveled = 0.0;
    vec3 posIS = posVCtoIS(posVC);
    vec4 tValue = getTextureValue(posIS);
    if (raySteps <= 1.0) {
      gl_FragData[0] = getColorForValue(tValue, posVC, posIS);
      return;
    }

    vec3 stepIS = vecVCToIS(stepVC);
    vec4 value = tValue;
    posIS += jitter * stepIS;
    stepsTraveled += jitter;
    vec3 maxPosIS = posIS; // Store the position of the max value
    int segmentIndex = int(value.g);
    bool originalPosHasSeenNonZero = false;

    if (segmentIndex != 0) {
      // Tried using the segment index in an boolean array but reading
      // from the array by dynamic indexing was horrondously slow
      // so use bit masking instead and assign 1 to the bit corresponding to the
      // segment index and later check if the bit is set via bit operations
      setLabelOutlineBit(segmentIndex);
    }

    // Sample along the ray until vtkMaximumNumberOfSamples,
    // ending slightly inside the total distance
    for (int i = 0; i < vtkMaximumNumberOfSamples; ++i) {
      // If we have reached the last step, break
      if (stepsTraveled + 1.0 >= raySteps) {
        break;
      }

      // compute the scalar
      tValue = getTextureValue(posIS);
      segmentIndex = int(tValue.g);

      if (segmentIndex != 0) {
        originalPosHasSeenNonZero = true;
        setLabelOutlineBit(segmentIndex);
      }

      if (tValue.r > value.r) {
        value = tValue;   // Update the max value
        maxPosIS = posIS; // Update the position where max occurred
      }

      // Otherwise, continue along the ray
      stepsTraveled++;
      posIS += stepIS;
    }

    // Perform the last step along the ray using the
    // residual distance
    posIS = posVCtoIS(rayOriginVC + maxDistance * rayDirVC);
    tValue = getTextureValue(posIS);

    if (tValue.r > value.r) {
      value = tValue;   // Update the max value
      maxPosIS = posIS; // Update the position where max occurred
    }

    // If we have not seen any non-zero segments, we can return early
    // and grab color from the actual center value first component (image)
    if (!originalPosHasSeenNonZero) {
      vec3 maxPosVC = posIStoVC(maxPosIS);
      gl_FragData[0] = getColorForValue(value, maxPosVC, maxPosIS);
      return;
    }

    vec3 neighborRayStepsIS = stepIS;
    float neighborRaySteps = raySteps;
    bool shouldLookInAllNeighbors = false;

    vec3 volumeSpacings = volume.spacing;
    float minVoxelSpacing =
        min(volumeSpacings[0], min(volumeSpacings[1], volumeSpacings[2]));
    vec4 base =
        vec4(gl_FragCoord.x, gl_FragCoord.y, gl_FragCoord.z, gl_FragCoord.w);

    vec4 baseXPlus = vec4(gl_FragCoord.x + 1.0, gl_FragCoord.y, gl_FragCoord.z,
                          gl_FragCoord.w);
    vec4 baseYPlus = vec4(gl_FragCoord.x, gl_FragCoord.y + 1.0, gl_FragCoord.z,
                          gl_FragCoord.w);

    vec3 baseWorld = fragCoordToWorld(base);
    vec3 baseXPlusWorld = fragCoordToWorld(baseXPlus);
    vec3 baseYPlusWorld = fragCoordToWorld(baseYPlus);

    float XPlusDiff = length(baseXPlusWorld - baseWorld);
    float YPlusDiff = length(baseYPlusWorld - baseWorld);

    float minFragSpacingWorld = min(XPlusDiff, YPlusDiff);

    for (int s = 1; s < MAX_SEGMENT_INDEX; s++) {
      // bail out quickly if the segment index has not
      // been seen by the center segment
      if (!isLabelOutlineBitSet(s)) {
        continue;
      }

      // Use texture sampling for outlineThickness so that we can have
      // per segment thickness
      float textureCoordinate = float(s - 1) / 1024.0;
      float textureValue =
          texture2D(labelOutlineThicknessTexture, vec2(textureCoordinate, 0.5)).r;

      int actualThickness = int(textureValue * 255.0);

      // check the extreme points in the neighborhood since there is a better
      // chance of finding the edge there, so that we can bail out
      // faster if we find the edge
      bool onEdge = checkOnEdgeForNeighbor(-actualThickness, -actualThickness, s,
                                          stepIS) ||
                    checkOnEdgeForNeighbor(actualThickness, actualThickness, s,
                                          stepIS) ||
                    checkOnEdgeForNeighbor(actualThickness, -actualThickness, s,
                                          stepIS) ||
                    checkOnEdgeForNeighbor(-actualThickness, +actualThickness, s,
                                          stepIS);

      if (onEdge) {
        return;
      }

      // since the next step is computationally expensive, we need to perform
      // some optimizations to avoid it if possible. One of the optimizations
      // is to check the whether the minimum of the voxel spacing is greater than
      // the 2 * the thickness of the outline segment. If that is the case
      // then we can safely skip the next step since we can be sure that the
      // the previous 4 checks on the extreme points would caught the entirety
      // of the all the fragments inside. i.e., this happens when we zoom out,
      if (minVoxelSpacing >
          (2.0 * float(actualThickness) - 1.0) * minFragSpacingWorld) {
        continue;
      }

      // Loop through the rest, skipping the processed extremes and the center
      for (int i = -actualThickness; i <= actualThickness; i++) {
        for (int j = -actualThickness; j <= actualThickness; j++) {
          if (i == 0 && j == 0)
            continue; // Skip the center
          if (abs(i) == actualThickness && abs(j) == actualThickness)
            continue; // Skip corners
          if (checkOnEdgeForNeighbor(i, j, s, stepIS)) {
            return;
          }
        }
      }
    }

    float sampleHeight = volume.transferFunctionsSampleHeight[0];
    vec3 tColor0 = getColorFromTexture(value.r, 0, sampleHeight);
    float pwfValue0 = getOpacityFromTexture(value.r, 0, sampleHeight);
    gl_FragData[0] = vec4(tColor0, pwfValue0);
  #endif
}

//=======================================================================
// given a
// - ray direction (rayDir)
// - starting point (vertexVCVSOutput)
// - bounding planes of the volume
// - optionally depth buffer values
// - far clipping plane
// compute the start/end distances of the ray we need to cast
vec2 computeRayDistances(vec3 rayOriginVC, vec3 rayDirVC) {
  vec2 dists = rayIntersectVolumeDistances(rayOriginVC, rayDirVC);

  //VTK::ClipPlane::Impl

  // do not go behind front clipping plane
  dists.x = max(0.0, dists.x);

  // do not go PAST far clipping plane
  float farDist = -camThick / rayDirVC.z;
  dists.y = min(farDist, dists.y);

  // Do not go past the zbuffer value if set
  // This is used for intermixing opaque geometry
  //VTK::ZBuffer::Impl

  return dists;
}

float getFragmentSeed() {
  // This first noise has a diagonal pattern
  float firstNoise =
      fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  // This second noise is made out of blocks of CPU generated noise
  float secondNoise = texture2D(jtexture, gl_FragCoord.xy / 32.0).r;
  // Combine the two sources of noise in a way that the distribution is uniform
  // in [0,1[
  float noiseSum = firstNoise + secondNoise;
  return noiseSum < 1.0 ? noiseSum : noiseSum - 1.0;
}

void main() {
  fragmentSeed = getFragmentSeed();

  if (cameraParallel == 1) {
    // Camera is parallel, so the rayDir is just the direction of the camera.
    rayDirVC = vec3(0.0, 0.0, -1.0);
  } else {
    // camera is at 0,0,0 so rayDir for perspective is just the vc coord
    rayDirVC = normalize(vertexVCVSOutput);
  }

  vec3 rayOriginVC = vertexVCVSOutput;
  vec2 rayStartEndDistancesVC = computeRayDistances(rayOriginVC, rayDirVC);
  if (rayStartEndDistancesVC[1] <= rayStartEndDistancesVC[0] ||
      rayStartEndDistancesVC[1] <= 0.0) {
    // Volume not hit or behind the ray
    discard;
  }

  // Perform the blending operation along the ray
  applyBlend(rayOriginVC, rayDirVC, rayStartEndDistancesVC[0], rayStartEndDistancesVC[1]);
}
`;var op=On(ua(),1);var{vtkWarningMacro:Y1,vtkErrorMacro:ho}=we,q1={idxToView:L.identity(new Float64Array(16)),vecISToVCMatrix:ne.identity(new Float64Array(9)),normalISToVCMatrix:ne.identity(new Float64Array(9)),linearModelToViewMatrix:ne.identity(new Float64Array(9)),modelToView:L.identity(new Float64Array(16)),projectionToView:L.identity(new Float64Array(16)),projectionToWorld:L.identity(new Float64Array(16))};function Z1(t,e){e.classHierarchy.push("vtkOpenGLVolumeMapper");function r(c){return c.getUseLabelOutline()||e.renderable.getBlendMode()===Ae.LABELMAP_EDGE_PROJECTION_BLEND}let n=new Map;function a(c,f){if(!f)return;let u=(n.get(f)??0)-1;u<=0?(c.unregisterGraphicsResourceUser(f,t),n.delete(f)):n.set(f,u)}function i(c,f){if(!f)return;let u=n.get(f)??0,g=u+1;n.set(f,g),u<=0&&c.registerGraphicsResourceUser(f,t)}function s(c,f,u){f!==u&&(a(c,f),i(c,u))}function o(c){[...n.keys()].forEach(f=>c.unregisterGraphicsResourceUser(f,t))}t.buildPass=()=>{e.zBufferTexture=null},t.zBufferPass=(c,f)=>{if(c){let u=f.getZBufferTexture();u!==e.zBufferTexture&&(e.zBufferTexture=u)}},t.opaqueZBufferPass=(c,f)=>t.zBufferPass(c,f),t.volumePass=(c,f)=>{if(c){let u=e._openGLRenderWindow;e._openGLRenderWindow=t.getLastAncestorOfType("vtkOpenGLRenderWindow"),u&&!u.isDeleted()&&u!==e._openGLRenderWindow&&o(u),e.context=e._openGLRenderWindow.getContext(),e.tris.setOpenGLRenderWindow(e._openGLRenderWindow),e.jitterTexture.setOpenGLRenderWindow(e._openGLRenderWindow),e.framebuffer.setOpenGLRenderWindow(e._openGLRenderWindow),e.openGLVolume=t.getFirstAncestorOfType("vtkOpenGLVolume");let g=e.openGLVolume.getRenderable();e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer");let l=e._openGLRenderer.getRenderable();e.openGLCamera=e._openGLRenderer.getViewNodeFor(l.getActiveCamera(),e.openGLCamera),t.renderPiece(l,g)}},t.getShaderTemplate=(c,f,u)=>{c.Vertex=ip,c.Fragment=sp,c.Geometry=""},t.replaceShaderValues=(c,f,u)=>{let g=c.Fragment;g=H.substitute(g,"//VTK::EnabledColorFunctions",`#define EnableColorForValueFunctionId${e.previousState.colorForValueFunctionId}`).result;let l=[];e.previousState.surfaceLightingEnabled&&l.push("Surface"),e.previousState.volumeLightingEnabled&&l.push("Volume"),g=H.substitute(g,"//VTK::EnabledLightings",l.map(y=>`#define Enable${y}Lighting`)).result,e.previousState.multiTexturePerVolumeEnabled&&(g=H.substitute(g,"//VTK::EnabledMultiTexturePerVolume","#define EnabledMultiTexturePerVolume").result),e.previousState.useIndependentComponents&&(g=H.substitute(g,"//VTK::EnabledIndependentComponents","#define EnabledIndependentComponents").result),e.previousState.gradientOpacityEnabled&&(g=H.substitute(g,"//VTK::EnabledGradientOpacity","#define EnabledGradientOpacity").result),g=H.substitute(g,"//VTK::vtkProportionalComponents",e.previousState.proportionalComponents.map(y=>`#define vtkComponent${y}Proportional`).join(`
`)).result,g=H.substitute(g,"//VTK::vtkForceNearestComponents",e.previousState.forceNearestComponents.map(y=>`#define vtkComponent${y}ForceNearest`).join(`
`)).result,e.previousState.hasZBufferTexture&&(g=H.substitute(g,"//VTK::ZBuffer::Dec",["uniform sampler2D zBufferTexture;","uniform float vpZWidth;","uniform float vpZHeight;"]).result,g=H.substitute(g,"//VTK::ZBuffer::Impl",["vec4 depthVec = texture2D(zBufferTexture, vec2(gl_FragCoord.x / vpZWidth, gl_FragCoord.y/vpZHeight));","float zdepth = (depthVec.r*256.0 + depthVec.g)/257.0;","zdepth = zdepth * 2.0 - 1.0;","if (cameraParallel == 0) {","zdepth = -2.0 * camFar * camNear / (zdepth*(camFar-camNear)-(camFar+camNear)) - camNear;}","else {",`zdepth = (zdepth + 1.0) * 0.5 * (camFar - camNear);}
`,"zdepth = -zdepth/rayDirVC.z;","dists.y = min(zdepth,dists.y);"]).result),g=H.substitute(g,"//VTK::BlendMode",`${e.previousState.blendMode}`).result,g=H.substitute(g,"//VTK::NumberOfLights",`${e.previousState.numberOfLights}`).result,g=H.substitute(g,"//VTK::MaxLaoKernelSize",`${e.previousState.maxLaoKernelSize}`).result,g=H.substitute(g,"//VTK::NumberOfComponents",`${e.previousState.numberOfComponents}`).result,g=H.substitute(g,"//VTK::MaximumNumberOfSamples",`${e.previousState.maximumNumberOfSamples}`).result,c.Fragment=g;let h=e.previousState.numberOfClippingPlanes;h>0&&(g=H.substitute(g,"//VTK::ClipPlane::Dec",["uniform vec3 vClipPlaneNormals[6];","uniform float vClipPlaneDistances[6];","uniform vec3 vClipPlaneOrigins[6];","uniform int clip_numPlanes;","//VTK::ClipPlane::Dec","#define vtkClippingPlanesOn"],!1).result,g=H.substitute(g,"//VTK::ClipPlane::Impl",[`for(int i = 0; i < ${h}; i++) {`,"  float rayDirRatio = dot(rayDirVC, vClipPlaneNormals[i]);","  float equationResult = dot(vertexVCVSOutput, vClipPlaneNormals[i]) + vClipPlaneDistances[i];","  if (rayDirRatio == 0.0)","  {","    if (equationResult < 0.0) dists.x = dists.y;","    continue;","  }","  float result = -1.0 * equationResult / rayDirRatio;","  if (rayDirRatio < 0.0) dists.y = min(dists.y, result);","  else dists.x = max(dists.x, result);","}","//VTK::ClipPlane::Impl"],!1).result),c.Fragment=g},t.getNeedToRebuildShaders=(c,f,u)=>{let g=!!e.zBufferTexture,l=e.currentValidInputs.length,h=e.numberOfLights,y=e.numberOfComponents,p=e.useIndependentComponents,m=u.getProperties()[e.currentValidInputs[0].inputIndex],d=l>1,x=q.getDiagonalLength(u.getBounds()),T=Math.ceil(x/t.getCurrentSampleDistance(f));T>e.renderable.getMaximumSamplesPerRay()&&Y1(`The number of steps required ${T} is larger than the specified maximum number of steps ${e.renderable.getMaximumSamplesPerRay()}.
Please either change the volumeMapper sampleDistance or its maximum number of samples.`);let v=p?y:1,C=!1;for(let G=0;G<v;++G)if(m.getUseGradientOpacity(G)){C=!0;break}let O=0,M=m.getLAOKernelSize();M>O&&m.getLocalAmbientOcclusion()&&m.getAmbient()>0&&(O=M);let S=e.renderable.getClippingPlanes().length,E=e.renderable.getViewSpecificProperties().OpenGL?.ShaderReplacements,R=e.currentRenderPass?.getShaderReplacement(),D=e.renderable.getBlendMode(),V=(()=>{if(D!==Ae.LABELMAP_EDGE_PROJECTION_BLEND&&r(m))return 5;if(p)switch(m.getColorMixPreset()){case jn.ADDITIVE:return 1;case jn.COLORIZE:return 2;case jn.CUSTOM:return 3;default:return 4}return 0})(),U=m.getVolumetricScatteringBlending()<1,B=m.getVolumetricScatteringBlending()>0,_=!1;for(let G=0;G<y;++G)if(m.getForceNearestInterpolation(G)){_=!0;break}let N=[],k=[];for(let G=0;G<y;G++)m.getOpacityMode(G)===lo.PROPORTIONAL&&N.push(G),m.getForceNearestInterpolation(G)&&k.push(G);let F={numberOfComponents:y,useIndependentComponents:p,proportionalComponents:N,forceNearestComponents:k,blendMode:D,numberOfLights:h,numberOfValidInputs:l,maximumNumberOfSamples:T,hasZBufferTexture:g,maxLaoKernelSize:O,numberOfClippingPlanes:S,mapperShaderReplacements:E,renderPassShaderReplacements:R,colorForValueFunctionId:V,surfaceLightingEnabled:U,volumeLightingEnabled:B,forceNearestInterpolationEnabled:_,multiTexturePerVolumeEnabled:d,gradientOpacityEnabled:C};return c.getProgram()?.getHandle()===0||!e.previousState||!(0,op.default)(e.previousState,F)?(e.previousState=F,!0):!1},t.updateShaders=(c,f,u)=>{if(t.getNeedToRebuildShaders(c,f,u)){let g={Vertex:null,Fragment:null,Geometry:null};t.buildShaders(g,f,u);let l=e._openGLRenderWindow.getShaderCache().readyShaderProgramArray(g.Vertex,g.Fragment,g.Geometry);if(!l)return ho("Error compiling volume mapper shader program."),c.setProgram(null),!1;l!==c.getProgram()&&(c.setProgram(l),c.getVAO().releaseGraphicsResources()),c.getShaderSourceTime().modified()}else if(!e._openGLRenderWindow.getShaderCache().readyShaderProgram(c.getProgram()))return c.setProgram(null),!1;return c.getVAO().bind(),t.setMapperShaderParameters(c,f,u),t.setCameraShaderParameters(c,f,u),t.setPropertyShaderParameters(c,f,u),t.getClippingPlaneShaderParameters(c,f,u),!0},t.setMapperShaderParameters=(c,f,u)=>{let g=c.getProgram();if(!g)return;c.getCABO().getElementCount()&&(e.VBOBuildTime.getMTime()>c.getAttributeUpdateTime().getMTime()||c.getShaderSourceTime().getMTime()>c.getAttributeUpdateTime().getMTime())&&(g.isAttributeUsed("vertexDC")&&(c.getVAO().addAttributeArray(g,c.getCABO(),"vertexDC",c.getCABO().getVertexOffset(),c.getCABO().getStride(),e.context.FLOAT,3,e.context.FALSE)||ho("Error setting vertexDC in shader VAO.")),c.getAttributeUpdateTime().modified());let l=t.getCurrentSampleDistance(f);g.setUniformf("sampleDistance",l);let h=l*e.renderable.getVolumeShadowSamplingDistFactor();g.setUniformf("volumeShadowSampleDistance",h),e.scalarTextures.forEach((T,v)=>{g.setUniformi(`volumeTexture[${v}]`,T.getTextureUnit())});let y=u.getProperties()[e.currentValidInputs[0].inputIndex].getIpScalarRange(),p=new Float32Array(4),m=new Float32Array(4),d=(T,v,C)=>{v?.dataComputedScale?.length&&(p[T]=y[0]*v.dataComputedScale[C]+v.dataComputedOffset[C],m[T]=y[1]*v.dataComputedScale[C]+v.dataComputedOffset[C],p[T]=(p[T]-v.offset[C])/v.scale[C],m[T]=(m[T]-v.offset[C])/v.scale[C])};if(e.previousState.multiTexturePerVolumeEnabled)e.scalarTextures.forEach((T,v)=>{let C=T.getVolumeInfo();d(v,C,0)});else{let T=e.scalarTextures[0].getVolumeInfo();for(let v=0;v<4;++v)d(v,T,v)}let x="volume";if(g.setUniform4f(`${x}.ipScalarRangeMin`,p[0],p[1],p[2],p[3]),g.setUniform4f(`${x}.ipScalarRangeMax`,m[0],m[1],m[2],m[3]),e.zBufferTexture!==null){g.setUniformi("zBufferTexture",e.zBufferTexture.getTextureUnit());let T=e._useSmallViewport?[e._smallViewportWidth,e._smallViewportHeight]:e._openGLRenderWindow.getFramebufferSize();g.setUniformf("vpZWidth",T[0]),g.setUniformf("vpZHeight",T[1])}},t.setCameraShaderParameters=(c,f,u)=>{let{idxToView:g,vecISToVCMatrix:l,normalISToVCMatrix:h,linearModelToViewMatrix:y,modelToView:p,projectionToView:m,projectionToWorld:d}=q1,x=e.openGLCamera.getKeyMatrices(f),T=e.openGLVolume.getKeyMatrices();L.multiply(p,x.wcvc,T.mcwc);let v=c.getProgram(),C=e.openGLCamera.getRenderable(),O=C.getParallelProjection(),M=C.getClippingRange();v.setUniformf("camThick",M[1]-M[0]),v.setUniformf("camNear",M[0]),v.setUniformf("camFar",M[1]),v.setUniformi("cameraParallel",O);let S=e.currentValidInputs[0],E=S.imageData.getBounds(),R=q.getCorners(E,[]).map(A=>{if(W.transformMat4(A,A,p),!O){let se=-M[0]/(A[2]*W.length(A));W.scale(A,A,se)}return W.transformMat4(A,A,x.vcpc),A}),D=q.addPoints([...q.INIT_BOUNDS],R);v.setUniformf("dcxmin",D[0]),v.setUniformf("dcxmax",D[1]),v.setUniformf("dcymin",D[2]),v.setUniformf("dcymax",D[3]);let V=t.getRenderTargetSize();v.setUniformf("vpWidth",V[0]),v.setUniformf("vpHeight",V[1]);let U=t.getRenderTargetOffset();v.setUniformf("vpOffsetX",U[0]/V[0]),v.setUniformf("vpOffsetY",U[1]/V[1]),L.invert(m,x.vcpc),v.setUniformMatrix("PCVCMatrix",m),v.setUniformi("twoSidedLighting",f.getTwoSidedLighting());let B=new Array(2*e.previousState.maxLaoKernelSize);for(let A=0;A<e.previousState.maxLaoKernelSize;A++)B[A*2]=Math.random(),B[A*2+1]=Math.random();if(v.setUniform2fv("kernelSample",B),e.numberOfLights>0){let A=0;f.getLights().forEach(se=>{if(se.getSwitch()>0){let ae=`lights[${A}]`,ce=se.getColor(),ie=se.getIntensity(),fe=W.scale([],ce,ie);v.setUniform3fv(`${ae}.color`,fe);let Mt=se.getTransformedPosition();W.transformMat4(Mt,Mt,p),v.setUniform3fv(`${ae}.positionVC`,Mt);let Be=[...se.getDirection()];W.transformMat3(Be,Be,x.normalMatrix),W.normalize(Be,Be),v.setUniform3fv(`${ae}.directionVC`,Be);let Fe=[-.5*Be[0],-.5*Be[1],-.5*(Be[2]-1)];v.setUniform3fv(`${ae}.halfAngleVC`,Fe);let $t=se.getAttenuationValues();v.setUniform3fv(`${ae}.attenuation`,$t);let dt=se.getExponent();v.setUniformf(`${ae}.exponent`,dt);let Je=se.getConeAngle();v.setUniformf(`${ae}.coneAngle`,Je);let Bt=se.getPositional();v.setUniformi(`${ae}.isPositional`,Bt),A++}})}let _="volume",N=u.getProperties()[S.inputIndex],k=S.imageData,F=k.getSpatialExtent(),G=k.getSpacing(),b=k.getDimensions(),z=k.getIndexToWorld(),I=k.getWorldToIndex(),P=k.getDirectionByReference();L.multiply(g,p,z),v.setUniform3fv(`${_}.spacing`,G);let Q=W.inverse([],G);v.setUniform3fv(`${_}.inverseSpacing`,Q),v.setUniform3iv(`${_}.dimensions`,b),v.setUniform3fv(`${_}.inverseDimensions`,W.inverse([],b)),v.setUniformMatrix(`${_}.worldToIndex`,I),l.fill(0);let $=W.multiply(new Float64Array(3),b,G);l[0]=$[0],l[4]=$[1],l[8]=$[2],ne.multiply(l,P,l),ne.fromMat4(y,p),ne.multiply(l,y,l),v.setUniformMatrix3x3(`${_}.vecISToVCMatrix`,l),v.setUniformMatrix3x3(`${_}.vecVCToISMatrix`,ne.invert(new Float32Array(9),l)),h.fill(0),h[0]=$[0],h[4]=$[1],h[8]=$[2],ne.multiply(h,P,h),ne.multiply(h,T.normalMatrix,h),ne.multiply(h,x.normalMatrix,h),v.setUniformMatrix3x3(`${_}.normalISToVCMatrix`,h);let J=W.fromValues(F[0],F[2],F[4]),Y=W.transformMat4(new Float64Array(3),J,g);v.setUniform3fv(`${_}.originVC`,Y);let j=q.getDiagonalLength(u.getBounds());if(v.setUniformf(`${_}.diagonalLength`,j),r(N)){let A=C.getDistance();C.setClippingRange(A,A+.1);let se=e.openGLCamera.getKeyMatrices(f);L.invert(d,se.wcpc),C.setClippingRange(M[0],M[1]),e.openGLCamera.getKeyMatrices(f),v.setUniformMatrix(`${_}.PCWCMatrix`,d)}if(N.getVolumetricScatteringBlending()>0&&(v.setUniformf(`${_}.globalIlluminationReach`,N.getGlobalIlluminationReach()),v.setUniformf(`${_}.volumetricScatteringBlending`,N.getVolumetricScatteringBlending()),v.setUniformf(`${_}.anisotropy`,N.getAnisotropy()),v.setUniformf(`${_}.anisotropySquared`,N.getAnisotropy()**2)),N.getLocalAmbientOcclusion()&&N.getAmbient()>0){let A=N.getLAOKernelSize();v.setUniformi(`${_}.kernelSize`,A);let se=N.getLAOKernelRadius();v.setUniformi(`${_}.kernelRadius`,se)}else v.setUniformi(`${_}.kernelSize`,0)},t.setPropertyShaderParameters=(c,f,u)=>{let g=c.getProgram();g.setUniformi("jtexture",e.jitterTexture.getTextureUnit());let l=u.getProperties();g.setUniformi("labelOutlineThicknessTexture",e.labelOutlineThicknessTexture.getTextureUnit()),g.setUniformi("opacityTexture",e.opacityTexture.getTextureUnit()),g.setUniformi("colorTexture",e.colorTexture.getTextureUnit());let h="volume",y=l[e.currentValidInputs[0].inputIndex],p=e.previousState.numberOfComponents,m=e.previousState.useIndependentComponents;if(m){let S=new Float32Array(4);for(let D=0;D<p;D++)S[D]=y.getComponentWeight(D);g.setUniform4fv(`${h}.independentComponentMix`,S);let E=new Float32Array(4),R=1/p;for(let D=0;D<p;++D)E[D]=(D+.5)*R;g.setUniform4fv(`${h}.transferFunctionsSampleHeight`,E)}let d=e.colorForValueFunctionId;g.setUniformi(`${h}.colorForValueFunctionId`,d);let x=y.getComputeNormalFromOpacity();g.setUniformi(`${h}.computeNormalFromOpacity`,x);let T=new Float32Array(4),v=new Float32Array(4),C=new Float32Array(4),O=new Float32Array(4);for(let S=0;S<p;S++){let E=e.previousState.multiTexturePerVolumeEnabled,R=E?S:0,D=E?0:S,V=e.scalarTextures[R].getVolumeInfo(),U=m?S:0,B=V.scale[D],_=y.getRGBTransferFunction(U).getRange();T[S]=B/(_[1]-_[0]),v[S]=(V.offset[D]-_[0])/(_[1]-_[0]);let N=y.getScalarOpacity(U).getRange();C[S]=B/(N[1]-N[0]),O[S]=(V.offset[D]-N[0])/(N[1]-N[0])}if(g.setUniform4fv(`${h}.colorTextureScale`,T),g.setUniform4fv(`${h}.colorTextureShift`,v),g.setUniform4fv(`${h}.opacityTextureScale`,C),g.setUniform4fv(`${h}.opacityTextureShift`,O),e.previousState.gradientOpacityEnabled){let S=new Array(4),E=new Array(4),R=new Array(4),D=new Array(4);if(m)for(let V=0;V<p;++V){let U=e.previousState.multiTexturePerVolumeEnabled,B=U?V:0,_=U?0:V,N=e.scalarTextures[B].getVolumeInfo().scale[_];if(y.getUseGradientOpacity(V)){let k=[y.getGradientOpacityMinimumOpacity(V),y.getGradientOpacityMaximumOpacity(V)],F=[y.getGradientOpacityMinimumValue(V),y.getGradientOpacityMaximumValue(V)];R[V]=k[0],D[V]=k[1],S[V]=N*(k[1]-k[0])/(F[1]-F[0]),E[V]=-F[0]*(k[1]-k[0])/(F[1]-F[0])+k[0]}else R[V]=1,D[V]=1,S[V]=0,E[V]=1}else{let V=p-1,U=e.previousState.multiTexturePerVolumeEnabled,B=U?V:0,_=U?0:V,N=e.scalarTextures[B].getVolumeInfo().scale[_],k=[y.getGradientOpacityMinimumOpacity(0),y.getGradientOpacityMaximumOpacity(0)],F=[y.getGradientOpacityMinimumValue(0),y.getGradientOpacityMaximumValue(0)];R[0]=k[0],D[0]=k[1],S[0]=N*(k[1]-k[0])/(F[1]-F[0]),E[0]=-F[0]*(k[1]-k[0])/(F[1]-F[0])+k[0]}g.setUniform4f(`${h}.gradientOpacityScale`,S),g.setUniform4f(`${h}.gradientOpacityShift`,E),g.setUniform4f(`${h}.gradientOpacityMin`,R),g.setUniform4f(`${h}.gradientOpacityMax`,D)}let M=y.getLabelOutlineOpacity();if(g.setUniformf(`${h}.outlineOpacity`,M),e.numberOfLights>0){g.setUniformf(`${h}.ambient`,y.getAmbient()),g.setUniformf(`${h}.diffuse`,y.getDiffuse()),g.setUniformf(`${h}.specular`,y.getSpecular());let S=y.getSpecularPower();g.setUniformf(`${h}.specularPower`,S===0?1:S)}},t.getClippingPlaneShaderParameters=(c,f,u)=>{if(e.renderable.getClippingPlanes().length>0){let g=e.openGLCamera.getKeyMatrices(f),l=[],h=[],y=[],p=e.renderable.getClippingPlanes(),m=p.length;for(let x=0;x<m;++x){let T=p[x].getNormal(),v=p[x].getOrigin();W.transformMat3(T,T,g.normalMatrix),W.transformMat4(v,v,g.wcvc);let C=-1*W.dot(v,T);l.push(T[0]),l.push(T[1]),l.push(T[2]),h.push(C),y.push(v[0]),y.push(v[1]),y.push(v[2])}let d=c.getProgram();d.setUniform3fv("vClipPlaneNormals",l),d.setUniformfv("vClipPlaneDistances",h),d.setUniform3fv("vClipPlaneOrigins",y),d.setUniformi("clip_numPlanes",m)}},t.releaseGraphicsResources=c=>{let f=c??e._openGLRenderWindow;e.framebuffer.releaseGraphicsResources(),e.jitterTexture.releaseGraphicsResources(f),e.tris.releaseGraphicsResources(f),e.copyVAO&&(e.copyVAO.releaseGraphicsResources(),e.copyVAO=null),e.copyShader=null},t.delete=at(()=>t.releaseGraphicsResources(),()=>{e._animationRateSubscription&&(e._animationRateSubscription.unsubscribe(),e._animationRateSubscription=null)},()=>{e._openGLRenderWindow&&o(e._openGLRenderWindow)},t.delete),t.getRenderTargetSize=()=>{if(e._useSmallViewport)return[e._smallViewportWidth,e._smallViewportHeight];let{usize:c,vsize:f}=e._openGLRenderer.getTiledSizeAndOrigin();return[c,f]},t.getRenderTargetOffset=()=>{let{lowerLeftU:c,lowerLeftV:f}=e._openGLRenderer.getTiledSizeAndOrigin();return[c,f]},t.getCurrentSampleDistance=c=>{let f=c.getVTKWindow().getInteractor(),u=e.renderable.getSampleDistance();return f.isAnimating()?u*e.renderable.getInteractionSampleDistanceFactor():u},t.renderPieceStart=(c,f)=>{let u=c.getVTKWindow().getInteractor();if(e._lastScale||(e._lastScale=e.renderable.getInitialInteractionScale()),e._useSmallViewport=!1,u.isAnimating()&&e._lastScale>1.5&&(e._useSmallViewport=!0),e._animationRateSubscription||(e._animationRateSubscription=u.onAnimationFrameRateUpdate(()=>{if(e.renderable.getAutoAdjustSampleDistances()){let l=u.getRecentAnimationFrameRate(),h=u.getDesiredUpdateRate()/l;(h>1.15||h<.85)&&(e._lastScale*=h),e._lastScale>400&&(e._lastScale=400),e._lastScale<1.5&&(e._lastScale=1.5)}else e._lastScale=e.renderable.getImageSampleDistance()*e.renderable.getImageSampleDistance()})),e._useSmallViewport){let l=e._openGLRenderWindow.getFramebufferSize(),h=1/Math.sqrt(e._lastScale);if(e._smallViewportWidth=Math.ceil(h*l[0]),e._smallViewportHeight=Math.ceil(h*l[1]),e._smallViewportHeight>l[1]&&(e._smallViewportHeight=l[1]),e._smallViewportWidth>l[0]&&(e._smallViewportWidth=l[0]),e.framebuffer.saveCurrentBindingsAndBuffers(),e.framebuffer.getGLFramebuffer()===null)e.framebuffer.create(l[0],l[1]),e.framebuffer.populateFramebuffer();else{let p=e.framebuffer.getSize();(!p||p[0]!==l[0]||p[1]!==l[1])&&(e.framebuffer.create(l[0],l[1]),e.framebuffer.populateFramebuffer())}e.framebuffer.bind();let y=e.context;y.clearColor(0,0,0,0),y.colorMask(!0,!0,!0,!0),y.clear(y.COLOR_BUFFER_BIT),y.viewport(0,0,e._smallViewportWidth,e._smallViewportHeight),e.fvp=[e._smallViewportWidth/l[0],e._smallViewportHeight/l[1]]}e.context.disable(e.context.DEPTH_TEST),t.updateBufferObjects(c,f);let g=f.getProperties();e.currentValidInputs.forEach(({inputIndex:l})=>{let h=g[l].getInterpolationType(),y=e.scalarTextures[l];h===Hn.NEAREST?(y.setMinificationFilter(X.NEAREST),y.setMagnificationFilter(X.NEAREST)):(y.setMinificationFilter(X.LINEAR),y.setMagnificationFilter(X.LINEAR))}),e.zBufferTexture!==null&&e.zBufferTexture.activate()},t.renderPieceDraw=(c,f)=>{let u=e.context,g=[...e.scalarTextures,e.colorTexture,e.opacityTexture,e.labelOutlineThicknessTexture,e.jitterTexture];if(g.forEach(l=>l.activate()),!t.updateShaders(e.tris,c,f)){g.forEach(l=>l.deactivate());return}u.drawArrays(u.TRIANGLES,0,e.tris.getCABO().getElementCount()),e.tris.getVAO().release(),g.forEach(l=>l.deactivate())},t.renderPieceFinish=(c,f)=>{if(e.zBufferTexture!==null&&e.zBufferTexture.deactivate(),e._useSmallViewport){if(e.framebuffer.restorePreviousBindingsAndBuffers(),e.copyShader===null){e.copyShader=e._openGLRenderWindow.getShaderCache().readyShaderProgramArray(["//VTK::System::Dec","attribute vec4 vertexDC;","uniform vec2 tfactor;","varying vec2 tcoord;","void main() { tcoord = vec2(vertexDC.x*0.5 + 0.5, vertexDC.y*0.5 + 0.5) * tfactor; gl_Position = vertexDC; }"].join(`
`),["//VTK::System::Dec","//VTK::Output::Dec","uniform sampler2D texture1;","varying vec2 tcoord;","void main() { gl_FragData[0] = texture2D(texture1,tcoord); }"].join(`
`),"");let h=e.copyShader;e.copyVAO=en.newInstance(),e.copyVAO.setOpenGLRenderWindow(e._openGLRenderWindow),e.tris.getCABO().bind(),e.copyVAO.addAttributeArray(h,e.tris.getCABO(),"vertexDC",e.tris.getCABO().getVertexOffset(),e.tris.getCABO().getStride(),e.context.FLOAT,3,e.context.FALSE)||ho("Error setting vertexDC in copy shader VAO.")}else e._openGLRenderWindow.getShaderCache().readyShaderProgram(e.copyShader);let u=e._openGLRenderWindow.getFramebufferSize();e.context.viewport(0,0,u[0],u[1]);let g=e.framebuffer.getColorBuffersByReference()[0];g.activate(),e.copyShader.setUniformi("texture",g.getTextureUnit()),e.copyShader.setUniform2f("tfactor",e.fvp[0],e.fvp[1]);let l=e.context;l.blendFuncSeparate(l.ONE,l.ONE_MINUS_SRC_ALPHA,l.ONE,l.ONE_MINUS_SRC_ALPHA),e.context.drawArrays(e.context.TRIANGLES,0,e.tris.getCABO().getElementCount()),g.deactivate(),l.blendFuncSeparate(l.SRC_ALPHA,l.ONE_MINUS_SRC_ALPHA,l.ONE,l.ONE_MINUS_SRC_ALPHA)}},t.renderPiece=(c,f)=>{t.invokeEvent({type:"StartEvent"}),e.renderable.update();let u=e.renderable.getNumberOfInputPorts();e.currentValidInputs=[];for(let l=0;l<u;++l){let h=e.renderable.getInputData(l);h&&!h.isDeleted()&&e.currentValidInputs.push({imageData:h,inputIndex:l})}let g=0;if(e.currentValidInputs.length>0){let l=f.getProperties(),h=e.currentValidInputs[0],y=h.imageData.getPointData().getScalars(),p=l[h.inputIndex];p.getShade()&&e.renderable.getBlendMode()===Ae.COMPOSITE_BLEND&&c.getLights().forEach(d=>{d.getSwitch()>0&&g++});let m=e.currentValidInputs.length;e.numberOfComponents=m>1?m:y.getNumberOfComponents(),e.useIndependentComponents=p.getUseIndependentComponents(e.numberOfComponents)}g!==e.numberOfLights&&(e.numberOfLights=g,t.modified()),t.invokeEvent({type:"EndEvent"}),e.currentValidInputs.length!==0&&(t.renderPieceStart(c,f),t.renderPieceDraw(c,f),t.renderPieceFinish(c,f))},t.updateBufferObjects=(c,f)=>{t.getNeedToRebuildBufferObjects(c,f)&&t.buildBufferObjects(c,f)},t.getNeedToRebuildBufferObjects=(c,f)=>e.VBOBuildTime.getMTime()<t.getMTime()||e.VBOBuildTime.getMTime()<f.getMTime()||e.VBOBuildTime.getMTime()<f.getProperty(e.currentValidInputs[0].inputIndex)?.getMTime()||e.VBOBuildTime.getMTime()<e.renderable.getMTime()||e.currentValidInputs.some(({imageData:u})=>e.VBOBuildTime.getMTime()<u.getMTime())||e.scalarTextures.length!==e.currentValidInputs.length||!e.scalarTextures.every(u=>!!u?.getHandle())||!e.colorTexture?.getHandle()||!e.opacityTexture?.getHandle()||!e.labelOutlineThicknessTexture?.getHandle()||!e.jitterTexture?.getHandle(),t.buildBufferObjects=(c,f)=>{if(!e.jitterTexture.getHandle()){let R=new Float32Array(1024);for(let D=0;D<1024;++D)R[D]=Math.random();e.jitterTexture.setMinificationFilter(X.NEAREST),e.jitterTexture.setMagnificationFilter(X.NEAREST),e.jitterTexture.create2DFromRaw({width:32,height:32,numComps:1,dataType:re.FLOAT,data:R})}let u=f.getProperties(),g=u[e.currentValidInputs[0].inputIndex],l=e.numberOfComponents,h=e.useIndependentComponents,y=h?l:1,p=[];for(let R=0;R<y;++R)p.push(g.getScalarOpacity(R));let m=mt(p,h,y),d=g.getScalarOpacity(),x=e._openGLRenderWindow.getGraphicsResourceForObject(d);if(!x?.oglObject?.getHandle()||x.hash!==m){let R=Se.newInstance();R.setOpenGLRenderWindow(e._openGLRenderWindow);let D=e.renderable.getOpacityTextureWidth();D<=0&&(D=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));let V=D*2*y,U=new Float32Array(V),B=new Float32Array(D);for(let _=0;_<y;++_){let N=g.getScalarOpacity(_),k=t.getCurrentSampleDistance(c)/g.getScalarOpacityUnitDistance(_),F=N.getRange();N.getTable(F[0],F[1],D,B,1);for(let G=0;G<D;++G)U[_*D*2+G]=1-(1-B[G])**k,U[_*D*2+G+D]=U[_*D*2+G]}if(R.resetFormatAndType(),R.setMinificationFilter(X.LINEAR),R.setMagnificationFilter(X.LINEAR),e.context.getExtension("OES_texture_float_linear"))R.create2DFromRaw({width:D,height:2*y,numComps:1,dataType:re.FLOAT,data:U});else{let _=new Uint8ClampedArray(V);for(let N=0;N<V;++N)_[N]=255*U[N];R.create2DFromRaw({width:D,height:2*y,numComps:1,dataType:re.UNSIGNED_CHAR,data:_})}d&&e._openGLRenderWindow.setGraphicsResourceForObject(d,R,m),e.opacityTexture=R}else e.opacityTexture=x.oglObject;s(e._openGLRenderWindow,e._opacityTextureCore,d),e._opacityTextureCore=d;let T=[];for(let R=0;R<y;++R)T.push(g.getRGBTransferFunction(R));let v=mt(T,h,y),C=g.getRGBTransferFunction(),O=e._openGLRenderWindow.getGraphicsResourceForObject(C);if(!O?.oglObject?.getHandle()||O?.hash!==v){let R=Se.newInstance();R.setOpenGLRenderWindow(e._openGLRenderWindow);let D=e.renderable.getColorTextureWidth();D<=0&&(D=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));let V=D*2*y*3,U=new Uint8ClampedArray(V),B=new Float32Array(D*3);for(let _=0;_<y;++_){let N=g.getRGBTransferFunction(_),k=N.getRange();N.getTable(k[0],k[1],D,B,1);for(let F=0;F<D*3;++F)U[_*D*6+F]=255*B[F],U[_*D*6+F+D*3]=255*B[F]}R.resetFormatAndType(),R.setMinificationFilter(X.LINEAR),R.setMagnificationFilter(X.LINEAR),R.create2DFromRaw({width:D,height:2*y,numComps:3,dataType:re.UNSIGNED_CHAR,data:U}),e._openGLRenderWindow.setGraphicsResourceForObject(C,R,v),e.colorTexture=R}else e.colorTexture=O.oglObject;s(e._openGLRenderWindow,e._colorTextureCore,C),e._colorTextureCore=C,e.currentValidInputs.forEach(({imageData:R,inputIndex:D},V)=>{let U=u[D],B=R.getPointData().getScalars(),_=e._openGLRenderWindow.getGraphicsResourceForObject(B),N=tn(R,B),k=!_?.oglObject?.getHandle()||_?.hash!==N,F=U.getUpdatedExtents(),G=!!F.length;if(k&&!G){let b=Se.newInstance();b.setOpenGLRenderWindow(e._openGLRenderWindow);let z=R.getDimensions();b.setOglNorm16Ext(e.context.getExtension("EXT_texture_norm16")),b.resetFormatAndType(),b.create3DFilterableFromDataArray({width:z[0],height:z[1],depth:z[2],dataArray:B,preferSizeOverAccuracy:U.getPreferSizeOverAccuracy()}),e._openGLRenderWindow.setGraphicsResourceForObject(B,b,N),e.scalarTextures[V]=b}else e.scalarTextures[V]=_.oglObject;if(G){U.setUpdatedExtents([]);let b=R.getDimensions();e.scalarTextures[V].create3DFilterableFromDataArray({width:b[0],height:b[1],depth:b[2],dataArray:B,updatedExtents:F})}s(e._openGLRenderWindow,e._scalarTexturesCore[V],B),e._scalarTexturesCore[V]=B});let M=g.getLabelOutlineThickness(),S=e._openGLRenderWindow.getGraphicsResourceForObject(M),E=M.join("-");if(!S?.oglObject?.getHandle()||S?.hash!==E){let R=Se.newInstance();R.setOpenGLRenderWindow(e._openGLRenderWindow);let D=e.renderable.getLabelOutlineTextureWidth();D<=0&&(D=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));let V=1,U=D*V,B=new Uint8Array(U);for(let _=0;_<D;++_){let N=typeof M[_]<"u"?M[_]:M[0];B[_]=N}R.resetFormatAndType(),R.setMinificationFilter(X.NEAREST),R.setMagnificationFilter(X.NEAREST),R.create2DFromRaw({width:D,height:V,numComps:1,dataType:re.UNSIGNED_CHAR,data:B}),M&&e._openGLRenderWindow.setGraphicsResourceForObject(M,R,E),e.labelOutlineThicknessTexture=R}else e.labelOutlineThicknessTexture=S.oglObject;if(s(e._openGLRenderWindow,e._labelOutlineThicknessTextureCore,M),e._labelOutlineThicknessTextureCore=M,!e.tris.getCABO().getElementCount()){let R=new Float32Array(12);for(let B=0;B<4;B++)R[B*3]=B%2*2-1,R[B*3+1]=B>1?1:-1,R[B*3+2]=-1;let D=new Uint16Array(8);D[0]=3,D[1]=0,D[2]=1,D[3]=3,D[4]=3,D[5]=0,D[6]=3,D[7]=2;let V=Z.newInstance({numberOfComponents:3,values:R});V.setName("points");let U=je.newInstance({values:D});e.tris.getCABO().createVBO(U,"polys",Pe.SURFACE,{points:V,cellOffset:0,forceFlatten:!0})}e.VBOBuildTime.modified()}}var Q1={context:null,VBOBuildTime:null,scalarTextures:[],_scalarTexturesCore:[],opacityTexture:null,_opacityTextureCore:null,colorTexture:null,_colorTextureCore:null,labelOutlineThicknessTexture:null,_labelOutlineThicknessTextureCore:null,jitterTexture:null,tris:null,framebuffer:null,copyShader:null,copyVAO:null,lastXYF:1,targetXYF:1,zBufferTexture:null,lastZBufferTexture:null,fullViewportTime:1,idxToView:null,vecISToVCMatrix:null,modelToView:null,projectionToView:null,avgWindowArea:0,avgFrameTime:0};function J1(t,e,r={}){Object.assign(e,Q1,r),ve.extend(t,e,r),Gt.implementBuildShadersWithReplacements(t,e,r),e.VBOBuildTime={},pe(e.VBOBuildTime,{mtime:0}),e.tris=Nt.newInstance(),e.jitterTexture=Se.newInstance(),e.jitterTexture.setWrapS(Br.REPEAT),e.jitterTexture.setWrapT(Br.REPEAT),e.framebuffer=gr.newInstance(),de(t,e,["context"]),Z1(t,e)}var eC=ue(J1,"vtkOpenGLVolumeMapper");_e("vtkVolumeMapper",eC);var gt={MAX:0,MIN:1,AVERAGE:2};var{vtkErrorMacro:pi}=w;function tC(t,e){e.classHierarchy.push("vtkOpenGLImageCPRMapper");function r(n){e.tris.releaseGraphicsResources(n),[e._scalars,e._colorTransferFunc,e._pwFunc].forEach(a=>n.unregisterGraphicsResourceUser(a,t)),[e._defaultColorTexture,e._defaultPwfTexture].forEach(a=>a?.oglObject.releaseGraphicsResources(n)),e._defaultColorTexture=null,e._defaultPwfTexture=null}t.buildPass=n=>{if(n){e.currentRenderPass=null,e.openGLImageSlice=t.getFirstAncestorOfType("vtkOpenGLImageSlice"),e._openGLRenderer=t.getFirstAncestorOfType("vtkOpenGLRenderer");let a=e._openGLRenderWindow;e._openGLRenderWindow=e._openGLRenderer.getLastAncestorOfType("vtkOpenGLRenderWindow"),a&&!a.isDeleted()&&a!==e._openGLRenderWindow&&r(a),e.context=e._openGLRenderWindow.getContext(),e.openGLCamera=e._openGLRenderer.getViewNodeFor(e._openGLRenderer.getRenderable().getActiveCamera(),e.openGLCamera),e.tris.setOpenGLRenderWindow(e._openGLRenderWindow)}},t.opaquePass=(n,a)=>{n&&(e.currentRenderPass=a,t.render())},t.opaqueZBufferPass=n=>{n&&(e.haveSeenDepthRequest=!0,e.renderDepth=!0,t.render(),e.renderDepth=!1)},t.getCoincidentParameters=(n,a)=>e.renderable.getResolveCoincidentTopology()===$e.PolygonOffset?e.renderable.getCoincidentTopologyPolygonOffsetParameters():null,t.render=()=>{let n=e.openGLImageSlice.getRenderable(),a=e._openGLRenderer.getRenderable();t.renderPiece(a,n)},t.renderPiece=(n,a)=>{t.invokeEvent({type:"StartEvent"}),e.renderable.update(),t.invokeEvent({type:"EndEvent"}),e.renderable.preRenderCheck()&&(e.currentImageDataInput=e.renderable.getInputData(0),e.currentCenterlineInput=e.renderable.getOrientedCenterline(),t.renderPieceStart(n,a),t.renderPieceDraw(n,a),t.renderPieceFinish(n,a))},t.renderPieceStart=(n,a)=>{t.updateBufferObjects(n,a)},t.renderPieceDraw=(n,a)=>{let i=e.context;e.volumeTexture.activate(),e.colorTexture.activate(),e.pwfTexture.activate(),e.tris.getCABO().getElementCount()&&(t.updateShaders(e.tris,n,a),i.drawArrays(i.TRIANGLES,0,e.tris.getCABO().getElementCount()),e.tris.getVAO().release()),e.volumeTexture.deactivate(),e.colorTexture.deactivate(),e.pwfTexture.deactivate()},t.renderPieceFinish=(n,a)=>{},t.updateBufferObjects=(n,a)=>{t.getNeedToRebuildBufferObjects(n,a)&&t.buildBufferObjects(n,a),a.getProperty().getInterpolationType()===Qe.NEAREST?(e.volumeTexture.setMinificationFilter(X.NEAREST),e.volumeTexture.setMagnificationFilter(X.NEAREST),e.colorTexture.setMinificationFilter(X.NEAREST),e.colorTexture.setMagnificationFilter(X.NEAREST),e.pwfTexture.setMinificationFilter(X.NEAREST),e.pwfTexture.setMagnificationFilter(X.NEAREST)):(e.volumeTexture.setMinificationFilter(X.LINEAR),e.volumeTexture.setMagnificationFilter(X.LINEAR),e.colorTexture.setMinificationFilter(X.LINEAR),e.colorTexture.setMagnificationFilter(X.LINEAR),e.pwfTexture.setMinificationFilter(X.LINEAR),e.pwfTexture.setMagnificationFilter(X.LINEAR))},t.getNeedToRebuildBufferObjects=(n,a)=>{let i=e.VBOBuildTime.getMTime();return i<t.getMTime()||i<e.renderable.getMTime()||i<a.getMTime()||i<e.currentImageDataInput.getMTime()||i<e.currentCenterlineInput.getMTime()||!e.volumeTexture?.getHandle()},t.buildBufferObjects=(n,a)=>{let i=e.currentImageDataInput,s=e.currentCenterlineInput,o=a.getProperty(),c=i?.getPointData()?.getScalars();if(!c)return;let f=e._openGLRenderWindow.getGraphicsResourceForObject(c),u=tn(i,c),g=!f?.oglObject?.getHandle()||f?.hash!==u,l=o.getUpdatedExtents(),h=!!l.length;if(g){e.volumeTexture=Se.newInstance(),e.volumeTexture.setOpenGLRenderWindow(e._openGLRenderWindow);let _=i.getDimensions();e.volumeTexture.setOglNorm16Ext(e.context.getExtension("EXT_texture_norm16")),e.volumeTexture.resetFormatAndType(),e.volumeTexture.create3DFilterableFromDataArray({width:_[0],height:_[1],depth:_[2],dataArray:c,preferSizeOverAccuracy:e.renderable.getPreferSizeOverAccuracy()}),e._openGLRenderWindow.setGraphicsResourceForObject(c,e.volumeTexture,u),c!==e._scalars&&(e._openGLRenderWindow.registerGraphicsResourceUser(c,t),e._openGLRenderWindow.unregisterGraphicsResourceUser(e._scalars,t)),e._scalars=c}else e.volumeTexture=f.oglObject;if(h){o.setUpdatedExtents([]);let _=i.getDimensions();e.volumeTexture.create3DFilterableFromDataArray({width:_[0],height:_[1],depth:_[2],dataArray:c,updatedExtents:l})}let y=c.getNumberOfComponents(),p=a.getProperty(),m=p.getIndependentComponents(),d=m?y:1,x=m?2*d:1,T=[];for(let _=0;_<d;++_)T.push(p.getRGBTransferFunction(_));let v=mt(T,m,d),C=p.getRGBTransferFunction(),O=e.renderable.getColorTextureWidth();O<=0&&(O=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));let M=C?v:`default-${O}`,S=C?e._openGLRenderWindow.getGraphicsResourceForObject(C):e._defaultColorTexture;if(!S?.oglObject?.getHandle()||S?.hash!==M){let _=O*x*3,N=new Uint8ClampedArray(_);if(e.colorTexture=Se.newInstance(),e.colorTexture.setOpenGLRenderWindow(e._openGLRenderWindow),C){let k=new Float32Array(O*3);for(let F=0;F<d;F++){let G=p.getRGBTransferFunction(F),b=G.getRange();if(G.getTable(b[0],b[1],O,k,1),m)for(let z=0;z<O*3;z++)N[F*O*6+z]=255*k[z],N[F*O*6+z+O*3]=255*k[z];else for(let z=0;z<O*3;z++)N[F*O*6+z]=255*k[z]}e.colorTexture.resetFormatAndType(),e.colorTexture.create2DFromRaw({width:O,height:x,numComps:3,dataType:re.UNSIGNED_CHAR,data:N})}else{for(let k=0;k<O*3;++k)N[k]=255*k/((O-1)*3),N[k+1]=255*k/((O-1)*3),N[k+2]=255*k/((O-1)*3);e.colorTexture.resetFormatAndType(),e.colorTexture.create2DFromRaw({width:O,height:1,numComps:3,dataType:re.UNSIGNED_CHAR,data:N})}C?(e._openGLRenderWindow.setGraphicsResourceForObject(C,e.colorTexture,v),C!==e._colorTransferFunc&&(e._openGLRenderWindow.registerGraphicsResourceUser(C,t),e._openGLRenderWindow.unregisterGraphicsResourceUser(e._colorTransferFunc,t)),e._colorTransferFunc=C):(e._defaultColorTexture?.oglObject.releaseGraphicsResources(e._openGLRenderWindow),e._defaultColorTexture={oglObject:e.colorTexture,hash:M})}else e.colorTexture=S.oglObject;let E=[];for(let _=0;_<d;++_)E.push(p.getPiecewiseFunction(_));let R=mt(E,m,d),D=p.getPiecewiseFunction(),V=e.renderable.getOpacityTextureWidth();V<=0&&(V=e.context.getParameter(e.context.MAX_TEXTURE_SIZE));let U=D?R:`default-${V}`,B=D?e._openGLRenderWindow.getGraphicsResourceForObject(D):e._defaultPwfTexture;if(!B?.oglObject?.getHandle()||B?.hash!==U){let _=V*x,N=new Uint8ClampedArray(_);if(e.pwfTexture=Se.newInstance(),e.pwfTexture.setOpenGLRenderWindow(e._openGLRenderWindow),D){let k=new Float32Array(_),F=new Float32Array(V);for(let G=0;G<d;++G){let b=p.getPiecewiseFunction(G);if(b===null)k.fill(1);else{let z=b.getRange();if(b.getTable(z[0],z[1],V,F,1),m)for(let I=0;I<V;I++)k[G*V*2+I]=F[I],k[G*V*2+I+V]=F[I];else for(let I=0;I<V;I++)k[G*V*2+I]=F[I]}}e.pwfTexture.resetFormatAndType(),e.pwfTexture.create2DFromRaw({width:V,height:x,numComps:1,dataType:re.FLOAT,data:k})}else N.fill(255),e.pwfTexture.resetFormatAndType(),e.pwfTexture.create2DFromRaw({width:V,height:1,numComps:1,dataType:re.UNSIGNED_CHAR,data:N});D?(e._openGLRenderWindow.setGraphicsResourceForObject(D,e.pwfTexture,R),D!==e._pwFunc&&(e._openGLRenderWindow.registerGraphicsResourceUser(D,t),e._openGLRenderWindow.unregisterGraphicsResourceUser(e._pwFunc,t)),e._pwFunc=D):(e._defaultPwfTexture?.oglObject.releaseGraphicsResources(e._openGLRenderWindow),e._defaultPwfTexture={oglObject:e.pwfTexture,hash:U})}else e.pwfTexture=B.oglObject;if(e.VBOBuildTime.getMTime()<e.renderable.getMTime()||e.VBOBuildTime.getMTime()<s.getMTime()){let _=s.getNumberOfPoints(),N=_<=1?0:_-1,k=s.getDistancesToFirstPoint(),F=e.renderable.getHeight(),G=4*N,b=new Float32Array(3*G),z=e.renderable.getWidth();for(let ce=0,ie=0;ce<N;++ce)b.set([0,F-k[ce],0],ie),ie+=3,b.set([z,F-k[ce],0],ie),ie+=3,b.set([z,F-k[ce+1],0],ie),ie+=3,b.set([0,F-k[ce+1],0],ie),ie+=3;let I=Z.newInstance({numberOfComponents:3,values:b});I.setName("points");let P=new Uint16Array(5*N);for(let ce=0,ie=0,fe=0;ce<N;++ce)P.set([4,fe+3,fe+2,fe+1,fe],ie),ie+=5,fe+=4;let Q=je.newInstance({values:P}),$=s.getPoints(),J=new Float32Array(3*G),Y=new Array(3),j=new Array(3);for(let ce=0,ie=0;ce<N;++ce)$.getPoint(ce,Y),$.getPoint(ce+1,j),J.set(Y,ie),ie+=3,J.set(Y,ie),ie+=3,J.set(j,ie),ie+=3,J.set(j,ie),ie+=3;let A=Z.newInstance({numberOfComponents:3,values:J,name:"centerlinePosition"}),se=new Float32Array(G);for(let ce=0,ie=0;ce<N;++ce)se.set([0,1,3,2],ie),ie+=4;let ae=[A,Z.newInstance({numberOfComponents:1,values:se,name:"quadIndex"})];if(!e.renderable.getUseUniformOrientation()){let ce=e.renderable.getOrientedCenterline().getOrientations()??[],ie=new Float32Array(4*G),fe=new Float32Array(4*G);for(let Fe=0;Fe<N;++Fe){let $t=ce[Fe],dt=ce[Fe+1];for(let Je=0;Je<4;++Je){let Bt=4*(Je+4*Fe);ie.set($t,Bt),fe.set(dt,Bt)}}let Mt=Z.newInstance({numberOfComponents:4,values:ie,name:"centerlineTopOrientation"}),Be=Z.newInstance({numberOfComponents:4,values:fe,name:"centerlineBotOrientation"});ae.push(Mt,Be)}e.tris.getCABO().createVBO(Q,"polys",Pe.SURFACE,{points:I,customAttributes:ae,forceFlatten:!0})}e.VBOBuildTime.modified()},t.getNeedToRebuildShaders=(n,a,i)=>{let s=e.volumeTexture.getComponents(),o=i.getProperty().getIndependentComponents(),c=!!e.renderable.getCenterPoint(),f=e.renderable.getUseUniformOrientation(),u=e.renderable.isProjectionEnabled()&&e.renderable.getProjectionMode();return n.getProgram()===0||e.lastUseCenterPoint!==c||e.lastUseUniformOrientation!==f||e.lastProjectionMode!==u||e.lastHaveSeenDepthRequest!==e.haveSeenDepthRequest||e.lastTextureComponents!==s||e.lastIndependentComponents!==o?(e.lastUseCenterPoint=c,e.lastUseUniformOrientation=f,e.lastProjectionMode=u,e.lastHaveSeenDepthRequest=e.haveSeenDepthRequest,e.lastTextureComponents=s,e.lastIndependentComponents=o,!0):!1},t.buildShaders=(n,a,i)=>{t.getShaderTemplate(n,a,i),t.replaceShaderValues(n,a,i)},t.replaceShaderValues=(n,a,i)=>{let s=n.Vertex,o=n.Fragment,c=["vec3 applyQuaternionToVec(vec4 q, vec3 v) {","  float uvx = q.y * v.z - q.z * v.y;","  float uvy = q.z * v.x - q.x * v.z;","  float uvz = q.x * v.y - q.y * v.x;","  float uuvx = q.y * uvz - q.z * uvy;","  float uuvy = q.z * uvx - q.x * uvz;","  float uuvz = q.x * uvy - q.y * uvx;","  float w2 = q.w * 2.0;","  uvx *= w2;","  uvy *= w2;","  uvz *= w2;","  uuvx *= 2.0;","  uuvy *= 2.0;","  uuvz *= 2.0;","  return vec3(v.x + uvx + uuvx, v.y + uvy + uuvy, v.z + uvz + uuvz);","}"];s=H.substitute(s,"//VTK::Camera::Dec",["uniform mat4 MCPCMatrix;"]).result,s=H.substitute(s,"//VTK::PositionVC::Impl",["  gl_Position = MCPCMatrix * vertexMC;"]).result;let f=["attribute vec3 centerlinePosition;","attribute float quadIndex;","uniform float width;","out vec2 quadOffsetVSOutput;","out vec3 centerlinePosVSOutput;"],u=e.renderable.isProjectionEnabled(),g=e.renderable.getUseUniformOrientation();g?(f.push("out vec3 samplingDirVSOutput;","uniform vec4 centerlineOrientation;","uniform vec3 tangentDirection;",...c),u&&f.push("out vec3 projectionDirVSOutput;","uniform vec3 bitangentDirection;")):f.push("out vec4 centerlineTopOrientationVSOutput;","out vec4 centerlineBotOrientationVSOutput;","attribute vec4 centerlineTopOrientation;","attribute vec4 centerlineBotOrientation;"),s=H.substitute(s,"//VTK::Color::Dec",f).result;let l=["quadOffsetVSOutput = vec2(width * (mod(quadIndex, 2.0) == 0.0 ? -0.5 : 0.5), quadIndex > 1.0 ? 0.0 : 1.0);","centerlinePosVSOutput = centerlinePosition;"];g?(l.push("samplingDirVSOutput = applyQuaternionToVec(centerlineOrientation, tangentDirection);"),u&&l.push("projectionDirVSOutput = applyQuaternionToVec(centerlineOrientation, bitangentDirection);")):l.push("centerlineTopOrientationVSOutput = centerlineTopOrientation;","centerlineBotOrientationVSOutput = centerlineBotOrientation;"),s=H.substitute(s,"//VTK::Color::Impl",l).result;let h=e.volumeTexture.getComponents(),y=i.getProperty().getIndependentComponents(),p=["uniform mat4 MCTCMatrix; // Model coordinates to texture coordinates","in vec2 quadOffsetVSOutput;","in vec3 centerlinePosVSOutput;","uniform highp sampler3D volumeTexture;","uniform sampler2D colorTexture1;","uniform sampler2D pwfTexture1;","uniform float opacity;","uniform vec4 backgroundColor;","uniform float cshift0;","uniform float cscale0;","uniform float pwfshift0;","uniform float pwfscale0;"];u&&p.push("uniform int projectionSlabNumberOfSamples;","uniform float projectionConstantOffset;","uniform float projectionStepLength;"),g?(p.push("in vec3 samplingDirVSOutput;"),u&&p.push("in vec3 projectionDirVSOutput;")):(p.push("uniform vec3 tangentDirection;","in vec4 centerlineTopOrientationVSOutput;","in vec4 centerlineBotOrientationVSOutput;",...c),u&&p.push("uniform vec3 bitangentDirection;"));let m=e.renderable.getCenterPoint();if(m&&p.push("uniform vec3 globalCenterPoint;"),y){for(let x=1;x<h;x++)p=p.concat([`uniform float cshift${x};`,`uniform float cscale${x};`,`uniform float pwfshift${x};`,`uniform float pwfscale${x};`]);switch(h){case 1:p=p.concat(["uniform float mix0;","#define height0 0.5"]);break;case 2:p=p.concat(["uniform float mix0;","uniform float mix1;","#define height0 0.25","#define height1 0.75"]);break;case 3:p=p.concat(["uniform float mix0;","uniform float mix1;","uniform float mix2;","#define height0 0.17","#define height1 0.5","#define height2 0.83"]);break;case 4:p=p.concat(["uniform float mix0;","uniform float mix1;","uniform float mix2;","uniform float mix3;","#define height0 0.125","#define height1 0.375","#define height2 0.625","#define height3 0.875"]);break;default:pi("Unsupported number of independent coordinates.")}}o=H.substitute(o,"//VTK::TCoord::Dec",p).result;let d=[];if(g?(d.push("vec3 samplingDirection = samplingDirVSOutput;"),u&&d.push("vec3 projectionDirection = projectionDirVSOutput;")):(d.push("vec4 q0 = centerlineBotOrientationVSOutput;","vec4 q1 = centerlineTopOrientationVSOutput;","float qCosAngle = dot(q0, q1);","vec4 interpolatedOrientation;","if (qCosAngle > 0.999 || qCosAngle < -0.999) {","  // Use LERP instead of SLERP when the two quaternions are close or opposite","  interpolatedOrientation = normalize(mix(q0, q1, quadOffsetVSOutput.y));","} else {","  float omega = acos(qCosAngle);","  interpolatedOrientation = normalize(sin((1.0 - quadOffsetVSOutput.y) * omega) * q0 + sin(quadOffsetVSOutput.y * omega) * q1);","}","vec3 samplingDirection = applyQuaternionToVec(interpolatedOrientation, tangentDirection);"),u&&d.push("vec3 projectionDirection = applyQuaternionToVec(interpolatedOrientation, bitangentDirection);")),m?d.push("float baseOffset = dot(samplingDirection, globalCenterPoint - centerlinePosVSOutput);","float horizontalOffset = quadOffsetVSOutput.x + baseOffset;"):d.push("float horizontalOffset = quadOffsetVSOutput.x;"),d.push("vec3 volumePosMC = centerlinePosVSOutput + horizontalOffset * samplingDirection;","vec3 volumePosTC = (MCTCMatrix * vec4(volumePosMC, 1.0)).xyz;","if (any(lessThan(volumePosTC, vec3(0.0))) || any(greaterThan(volumePosTC, vec3(1.0))))","{","  // set the background color and exit","  gl_FragData[0] = backgroundColor;","  return;","}"),u){let x=e.renderable.getProjectionMode();switch(x){case gt.MIN:d.push("const vec4 initialProjectionTextureValue = vec4(1.0);");break;case gt.MAX:case gt.AVERAGE:default:d.push("const vec4 initialProjectionTextureValue = vec4(0.0);")}switch(d.push("vec3 projectionScaledDirection = (MCTCMatrix * vec4(projectionDirection, 0.0)).xyz;","vec3 projectionStep = projectionStepLength * projectionScaledDirection;","vec3 projectionStartPosition = volumePosTC + projectionConstantOffset * projectionScaledDirection;","vec4 tvalue = initialProjectionTextureValue;","for (int projectionSampleIdx = 0; projectionSampleIdx < projectionSlabNumberOfSamples; ++projectionSampleIdx) {","  vec3 projectionSamplePosition = projectionStartPosition + float(projectionSampleIdx) * projectionStep;","  vec4 sampledTextureValue = texture(volumeTexture, projectionSamplePosition);"),x){case gt.MAX:d.push("  tvalue = max(tvalue, sampledTextureValue);");break;case gt.MIN:d.push("  tvalue = min(tvalue, sampledTextureValue);");break;case gt.AVERAGE:default:d.push("  tvalue = tvalue + sampledTextureValue;")}d.push("}"),x===gt.AVERAGE&&d.push("tvalue = tvalue / float(projectionSlabNumberOfSamples);")}else d.push("vec4 tvalue = texture(volumeTexture, volumePosTC);");if(y){let x=["r","g","b","a"];for(let T=0;T<h;++T)d=d.concat([`vec3 tcolor${T} = mix${T} * texture2D(colorTexture1, vec2(tvalue.${x[T]} * cscale${T} + cshift${T}, height${T})).rgb;`,`float compWeight${T} = mix${T} * texture2D(pwfTexture1, vec2(tvalue.${x[T]} * pwfscale${T} + pwfshift${T}, height${T})).r;`]);switch(h){case 1:d=d.concat(["gl_FragData[0] = vec4(tcolor0.rgb, compWeight0 * opacity);"]);break;case 2:d=d.concat(["float weightSum = compWeight0 + compWeight1;","gl_FragData[0] = vec4(vec3((tcolor0.rgb * (compWeight0 / weightSum)) + (tcolor1.rgb * (compWeight1 / weightSum))), opacity);"]);break;case 3:d=d.concat(["float weightSum = compWeight0 + compWeight1 + compWeight2;","gl_FragData[0] = vec4(vec3((tcolor0.rgb * (compWeight0 / weightSum)) + (tcolor1.rgb * (compWeight1 / weightSum)) + (tcolor2.rgb * (compWeight2 / weightSum))), opacity);"]);break;case 4:d=d.concat(["float weightSum = compWeight0 + compWeight1 + compWeight2 + compWeight3;","gl_FragData[0] = vec4(vec3((tcolor0.rgb * (compWeight0 / weightSum)) + (tcolor1.rgb * (compWeight1 / weightSum)) + (tcolor2.rgb * (compWeight2 / weightSum)) + (tcolor3.rgb * (compWeight3 / weightSum))), opacity);"]);break;default:pi("Unsupported number of independent coordinates.")}}else switch(h){case 1:d=d.concat(["// Dependent components","float intensity = tvalue.r;","vec3 tcolor = texture2D(colorTexture1, vec2(intensity * cscale0 + cshift0, 0.5)).rgb;","float scalarOpacity = texture2D(pwfTexture1, vec2(intensity * pwfscale0 + pwfshift0, 0.5)).r;","gl_FragData[0] = vec4(tcolor, scalarOpacity * opacity);"]);break;case 2:d=d.concat(["float intensity = tvalue.r*cscale0 + cshift0;","gl_FragData[0] = vec4(texture2D(colorTexture1, vec2(intensity, 0.5)).rgb, pwfscale0*tvalue.g + pwfshift0);"]);break;case 3:d=d.concat(["vec4 tcolor = cscale0*tvalue + cshift0;","gl_FragData[0] = vec4(texture2D(colorTexture1, vec2(tcolor.r,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.g,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.b,0.5)).r, opacity);"]);break;default:d=d.concat(["vec4 tcolor = cscale0*tvalue + cshift0;","gl_FragData[0] = vec4(texture2D(colorTexture1, vec2(tcolor.r,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.g,0.5)).r,","  texture2D(colorTexture1, vec2(tcolor.b,0.5)).r, tcolor.a);"])}o=H.substitute(o,"//VTK::TCoord::Impl",d).result,e.haveSeenDepthRequest&&(o=H.substitute(o,"//VTK::ZBuffer::Dec","uniform int depthRequest;").result,o=H.substitute(o,"//VTK::ZBuffer::Impl",["if (depthRequest == 1) {","float iz = floor(gl_FragCoord.z*65535.0 + 0.1);","float rf = floor(iz/256.0)/255.0;","float gf = mod(iz,256.0)/255.0;","gl_FragData[0] = vec4(rf, gf, 0.0, 1.0); }"]).result),n.Vertex=s,n.Fragment=o,t.replaceShaderClip(n,a,i),t.replaceShaderCoincidentOffset(n,a,i)},t.replaceShaderClip=(n,a,i)=>{let s=n.Vertex,o=n.Fragment;if(e.renderable.getNumberOfClippingPlanes()){let c=e.renderable.getNumberOfClippingPlanes();c>6&&(w.vtkErrorMacro("OpenGL has a limit of 6 clipping planes"),c=6),s=H.substitute(s,"//VTK::Clip::Dec",["uniform int numClipPlanes;","uniform vec4 clipPlanes[6];","varying float clipDistancesVSOutput[6];"]).result,s=H.substitute(s,"//VTK::Clip::Impl",["for (int planeNum = 0; planeNum < 6; planeNum++)","    {","    if (planeNum >= numClipPlanes)","        {","        break;","        }","    clipDistancesVSOutput[planeNum] = dot(clipPlanes[planeNum], vertexMC);","    }"]).result,o=H.substitute(o,"//VTK::Clip::Dec",["uniform int numClipPlanes;","varying float clipDistancesVSOutput[6];"]).result,o=H.substitute(o,"//VTK::Clip::Impl",["for (int planeNum = 0; planeNum < 6; planeNum++)","    {","    if (planeNum >= numClipPlanes)","        {","        break;","        }","    if (clipDistancesVSOutput[planeNum] < 0.0) discard;","    }"]).result}n.Vertex=s,n.Fragment=o},t.getShaderTemplate=(n,a,i)=>{n.Vertex=Pa,n.Fragment=$a,n.Geometry=""},t.setMapperShaderParameters=(n,a,i)=>{let s=n.getProgram(),o=n.getCABO();o.getElementCount()&&(e.VBOBuildTime.getMTime()>n.getAttributeUpdateTime().getMTime()||n.getShaderSourceTime().getMTime()>n.getAttributeUpdateTime().getMTime())&&(s.isAttributeUsed("vertexMC")&&(n.getVAO().addAttributeArray(s,o,"vertexMC",o.getVertexOffset(),o.getStride(),e.context.FLOAT,3,e.context.FALSE)||pi("Error setting vertexMC in shader VAO.")),n.getCABO().getCustomData().forEach(h=>{h&&s.isAttributeUsed(h.name)&&!n.getVAO().addAttributeArray(s,o,h.name,h.offset,o.getStride(),e.context.FLOAT,h.components,e.context.FALSE)&&pi(`Error setting ${h.name} in shader VAO.`)}),n.getAttributeUpdateTime().modified());let c=e.volumeTexture.getTextureUnit();if(s.setUniformi("volumeTexture",c),s.setUniformf("width",e.renderable.getWidth()),n.getProgram().setUniform4fv("backgroundColor",e.renderable.getBackgroundColor()),s.isUniformUsed("tangentDirection")){let h=e.renderable.getTangentDirection();n.getProgram().setUniform3fArray("tangentDirection",h)}if(s.isUniformUsed("bitangentDirection")){let h=e.renderable.getBitangentDirection();n.getProgram().setUniform3fArray("bitangentDirection",h)}if(s.isUniformUsed("centerlineOrientation")){let h=e.renderable.getUniformOrientation();n.getProgram().setUniform4fv("centerlineOrientation",h)}if(s.isUniformUsed("globalCenterPoint")){let h=e.renderable.getCenterPoint();s.setUniform3fArray("globalCenterPoint",h)}if(e.renderable.isProjectionEnabled()){let h=e.renderable.getProjectionSlabThickness(),y=e.renderable.getProjectionSlabNumberOfSamples();s.setUniformi("projectionSlabNumberOfSamples",y);let p=-.5*h;s.setUniformf("projectionConstantOffset",p);let m=h/(y-1);s.setUniformf("projectionStepLength",m)}let f=e.currentImageDataInput,u=f.getWorldToIndex(),g=L.fromScaling(new Float32Array(16),W.inverse([],f.getDimensions())),l=L.mul(g,g,u);if(s.setUniformMatrix("MCTCMatrix",l),e.haveSeenDepthRequest&&n.getProgram().setUniformi("depthRequest",e.renderDepth?1:0),e.renderable.getNumberOfClippingPlanes()){let h=e.renderable.getNumberOfClippingPlanes();h>6&&(w.vtkErrorMacro("OpenGL has a limit of 6 clipping planes"),h=6);let y=o.getCoordShiftAndScaleEnabled()?o.getInverseShiftAndScaleMatrix():null,p=y?L.copy(e.imagematinv,i.getMatrix()):i.getMatrix();y&&(L.transpose(p,p),L.multiply(p,p,y),L.transpose(p,p)),L.transpose(e.imagemat,e.currentImageDataInput.getIndexToWorld()),L.multiply(e.imagematinv,p,e.imagemat);let m=[];for(let d=0;d<h;d++){let x=[];e.renderable.getClippingPlaneInDataCoords(e.imagematinv,d,x);for(let T=0;T<4;T++)m.push(x[T])}s.setUniformi("numClipPlanes",h),s.setUniform4fv("clipPlanes",m)}if(s.isUniformUsed("coffset")){let h=t.getCoincidentParameters(a,i);s.setUniformf("coffset",h.offset),s.isUniformUsed("cfactor")&&s.setUniformf("cfactor",h.factor)}},t.setCameraShaderParameters=(n,a,i)=>{let s=e.openGLImageSlice.getKeyMatrices().mcwc,o=e.openGLCamera.getKeyMatrices(a).wcpc;if(L.multiply(e.imagemat,o,s),n.getCABO().getCoordShiftAndScaleEnabled()){let c=n.getCABO().getInverseShiftAndScaleMatrix();L.multiply(e.imagemat,e.imagemat,c)}n.getProgram().setUniformMatrix("MCPCMatrix",e.imagemat)},t.setPropertyShaderParameters=(n,a,i)=>{let s=n.getProgram(),o=i.getProperty(),c=o.getOpacity();s.setUniformf("opacity",c);let f=e.volumeTexture.getComponents(),u=o.getIndependentComponents();if(u)for(let y=0;y<f;++y)s.setUniformf(`mix${y}`,o.getComponentWeight(y));let g=e.volumeTexture.getVolumeInfo();for(let y=0;y<f;y++){let p=o.getColorWindow(),m=o.getColorLevel(),d=u?y:0,x=o.getRGBTransferFunction(d);if(x&&o.getUseLookupTableScalarRange()){let C=x.getRange();p=C[1]-C[0],m=.5*(C[1]+C[0])}let T=g.scale[y]/p,v=(g.offset[y]-m)/p+.5;s.setUniformf(`cshift${y}`,v),s.setUniformf(`cscale${y}`,T)}let l=e.colorTexture.getTextureUnit();s.setUniformi("colorTexture1",l);for(let y=0;y<f;y++){let p=1,m=0,d=u?y:0,x=o.getPiecewiseFunction(d);if(x){let T=x.getRange(),v=T[1]-T[0],C=.5*(T[0]+T[1]);p=g.scale[y]/v,m=(g.offset[y]-C)/v+.5}s.setUniformf(`pwfshift${y}`,m),s.setUniformf(`pwfscale${y}`,p)}let h=e.pwfTexture.getTextureUnit();s.setUniformi("pwfTexture1",h)},t.updateShaders=(n,a,i)=>{if(t.getNeedToRebuildShaders(n,a,i)){let s={Vertex:null,Fragment:null,Geometry:null};t.buildShaders(s,a,i);let o=e._openGLRenderWindow.getShaderCache().readyShaderProgramArray(s.Vertex,s.Fragment,s.Geometry);o!==n.getProgram()&&(n.setProgram(o),n.getVAO().releaseGraphicsResources()),n.getShaderSourceTime().modified()}else e._openGLRenderWindow.getShaderCache().readyShaderProgram(n.getProgram());n.getVAO().bind(),t.setMapperShaderParameters(n,a,i),t.setCameraShaderParameters(n,a,i),t.setPropertyShaderParameters(n,a,i)},t.delete=w.chain(()=>{e._openGLRenderWindow&&r(e._openGLRenderWindow)},t.delete)}var rC={currentRenderPass:null,volumeTexture:null,colorTexture:null,pwfTexture:null,tris:null,lastHaveSeenDepthRequest:!1,haveSeenDepthRequest:!1,lastTextureComponents:0,lastIndependentComponents:0,imagemat:null,imagematinv:null};function cp(t,e,r={}){Object.assign(e,rC,r),ve.extend(t,e,r),Gt.implementReplaceShaderCoincidentOffset(t,e,r),w.algo(t,e,2,0),e.tris=Nt.newInstance(),e.volumeTexture=null,e.colorTexture=null,e.pwfTexture=null,e.imagemat=L.identity(new Float64Array(16)),e.imagematinv=L.identity(new Float64Array(16)),e.VBOBuildTime={},w.obj(e.VBOBuildTime,{mtime:0}),tC(t,e)}var fp=w.newInstance(cp,"vtkOpenGLImageCPRMapper"),nC={},IF={newInstance:fp,extend:cp,...nC};_e("vtkImageCPRMapper",fp);var up=Object.create(null);function Ke(t,e){up[t]=e}function aC(t,e){e.classHierarchy.push("vtkWebGPUViewNodeFactory")}var iC={};function lp(t,e,r={}){Object.assign(e,iC,r),e.overrides=up,xa.extend(t,e,r),aC(t,e)}var sC=w.newInstance(lp,"vtkWebGPUViewNodeFactory"),pp={newInstance:sC,extend:lp};var vo=L.create();vo[10]=-.5;vo[14]=.5;function oC(t,e){e.classHierarchy.push("vtkWebGPUCamera"),t.getProjectionMatrix=(r,n,a,i)=>{if(e.renderable.getExplicitProjectionMatrix?.()){e.renderable.getProjectionMatrix(n,-1,1,r),L.transpose(r,r),L.multiply(r,vo,r);return}if(L.identity(r),e.renderable.getParallelProjection()){let s=e.renderable.getParallelScale(),o=s*n,c=s,f=(i[0]-1)*o,u=(i[0]+1)*o,g=(i[1]-1)*c,l=(i[1]+1)*c,h=1/(u-f),y=1/(l-g);r[0]=2*h,r[5]=2*y,r[10]=1/(a[1]-a[0]),r[12]=-(u+f)*h,r[13]=-(l+g)*y,r[14]=a[1]/(a[1]-a[0])}else{let s=Math.tan(Math.PI*e.renderable.getViewAngle()/360),o,c;e.renderable.getUseHorizontalViewAngle()===!0?(o=a[0]*s,c=a[0]*s/n):(o=a[0]*s*n,c=a[0]*s);let f=(i[0]-1)*o,u=(i[0]+1)*o,g=(i[1]-1)*c,l=(i[1]+1)*c;r[0]=2*a[0]/(u-f),r[5]=2*a[0]/(l-g),r[12]=(f+u)/(u-f),r[13]=(g+l)/(l-g),r[10]=0,r[14]=a[0],r[11]=-1,r[15]=0}},t.convertToOpenGLDepth=r=>{if(e.renderable.getParallelProjection()||e.renderable.getExplicitProjectionMatrix?.())return 1-r;let n=e.renderable.getClippingRangeByReference(),a=-n[0]/r;return a=(n[0]+n[1])/(n[1]-n[0])+2*n[0]*n[1]/(a*(n[1]-n[0])),.5*a+.5},t.getKeyMatrices=r=>{let n=r.getRenderable(),a=r.getParent();if(Math.max(a.getMTime(),t.getMTime(),n.getMTime(),e.renderable.getMTime(),r.getStabilizedTime())>e.keyMatrixTime.getMTime()){let i=e.renderable.getViewMatrix();L.copy(e.keyMatrices.normalMatrix,i),e.keyMatrices.normalMatrix[3]=0,e.keyMatrices.normalMatrix[7]=0,e.keyMatrices.normalMatrix[11]=0,L.invert(e.keyMatrices.normalMatrix,e.keyMatrices.normalMatrix),L.transpose(e.keyMatrices.wcvc,i);let s=r.getStabilizedCenterByReference();L.translate(e.keyMatrices.scvc,e.keyMatrices.wcvc,s);let o=r.getAspectRatio(),c=e.renderable.getClippingRangeByReference();t.getProjectionMatrix(e.keyMatrices.vcpc,o,c,e.renderable.getWindowCenterByReference()),L.multiply(e.keyMatrices.scpc,e.keyMatrices.vcpc,e.keyMatrices.scvc),L.invert(e.keyMatrices.pcsc,e.keyMatrices.scpc),e.keyMatrixTime.modified()}return e.keyMatrices}}var cC={keyMatrixTime:null,keyMatrices:null};function fC(t,e,r={}){Object.assign(e,cC,r),ve.extend(t,e,r),e.keyMatrixTime={},w.obj(e.keyMatrixTime),e.keyMatrices={normalMatrix:new Float64Array(16),vcpc:new Float64Array(16),pcsc:new Float64Array(16),wcvc:new Float64Array(16),scpc:new Float64Array(16),scvc:new Float64Array(16)},w.setGet(t,e,["keyMatrixTime"]),oC(t,e)}var uC=w.newInstance(fC);Ke("vtkCamera",uC);function lC(t,e){e.classHierarchy.push("vtkWebGPUShaderModule"),t.initialize=(r,n)=>{e.device=r,e.handle=e.device.getHandle().createShaderModule({code:n.getCode()})}}var pC={device:null,handle:null};function gp(t,e,r={}){Object.assign(e,pC,r),w.obj(t,e),w.get(t,e,["lastCameraMTime"]),w.setGet(t,e,["device","handle"]),lC(t,e)}var hp={newInstance:w.newInstance(gp,"vtkWebGPUShaderModule"),extend:gp};function gC(t,e,r,n=!0){let a=Array.isArray(r)?r.join(`
`):r,i=!1;t.search(e)!==-1&&(i=!0);let s="";n&&(s="g");let o=new RegExp(e,s),c=t.replace(o,a);return{replace:i,result:c}}function hC(t,e){e.classHierarchy.push("vtkWebGPUShaderCache"),t.getShaderModule=r=>{let n=r.getType(),a=r.getHash(),i=e._shaderModules.keys();for(let o=0;o<i.length;o++){let c=i[o];if(c.getHash()===a&&c.getType()===n)return e._shaderModules.get(c)}let s=hp.newInstance();return s.initialize(e.device,r),e._shaderModules.set(r,s),s}}var vC={shaderModules:null,device:null,window:null};function vp(t,e,r={}){Object.assign(e,vC,r),e._shaderModules=new Map,w.obj(t,e),w.setGet(t,e,["device","window"]),hC(t,e)}var dC=w.newInstance(vp,"vtkWebGPUShaderCache"),K={newInstance:dC,extend:vp,substitute:gC};var{vtkErrorMacro:TC}=w;function mC(t,e){e.classHierarchy.push("vtkWebGPUBindGroup"),t.setBindables=r=>{if(e.bindables.length===r.length){let n=!0;for(let a=0;a<e.bindables.length;a++)e.bindables[a]!==r[a]&&(n=!1);if(n)return}e.bindables=r,t.modified()},t.getBindGroupLayout=r=>{let n=[];for(let a=0;a<e.bindables.length;a++){e.bindables[a].setDevice?.(r);let i=e.bindables[a].getBindGroupLayoutEntry();i.binding=a,n.push(i)}return r.getBindGroupLayout({entries:n})},t.getBindGroup=r=>{let n=e.bindGroupDevice!==r;for(let s=0;s<e.bindables.length;s++)e.bindables[s].setDevice?.(r);let a=t.getMTime();for(let s=0;s<e.bindables.length;s++){let o=e.bindables[s].getBindGroupTime().getMTime();a=o>a?o:a}if(!n&&a<e.bindGroupTime.getMTime())return e.bindGroup;let i=[];for(let s=0;s<e.bindables.length;s++){let o=e.bindables[s].getBindGroupEntry();o.binding=s,i.push(o)}return e.bindGroup=r.getHandle().createBindGroup({layout:t.getBindGroupLayout(r),entries:i,label:e.label}),e.bindGroupDevice=r,e.bindGroupTime.modified(),e.bindGroup},t.getShaderCode=r=>{let n=[],a=r.getBindGroupLayoutIndex(e.label);if(a<0)return TC(`vtkWebGPUBindGroup: bind group layout ${e.label} was not found in pipeline`),"";for(let i=0;i<e.bindables.length;i++)n.push(e.bindables[i].getShaderCode(i,a));return n.join(`
`)},t.releaseGraphicsResources=()=>{e.bindGroup=null,e.bindGroupDevice=null,e.bindGroupTime.modified(),t.modified()}}var yC={device:null,handle:null,bindGroupDevice:null,label:null};function dp(t,e,r={}){Object.assign(e,yC,r),w.obj(t,e),e.bindables=[],e.bindGroupTime={},w.obj(e.bindGroupTime,{mtime:0}),w.get(t,e,["bindGroupTime","handle","sizeInBytes","usage"]),w.setGet(t,e,["label","device","arrayInformation"]),mC(t,e)}var SC=w.newInstance(dp),gi={newInstance:SC,extend:dp};function xC(t,e){e.classHierarchy.push("vtkWebGPUPipeline"),t.getShaderDescriptions=()=>e.shaderDescriptions,t.applyPipelineSettings=(r,n)=>n?{...r,...n,primitive:{...r.primitive,...n.primitive},depthStencil:{...r.depthStencil,...n.depthStencil},fragment:{...r.fragment,...n.fragment}}:r,t.initialize=(r,n)=>{e.pipelineDescription=t.applyPipelineSettings(e.renderEncoder.getPipelineSettings(),e.extraPipelineSettings),e.pipelineDescription.primitive.topology=e.topology,e.pipelineDescription.vertex=e.vertexState,e.pipelineDescription.label=n;let a=[];for(let i=0;i<e.layouts.length;i++)a.push(e.layouts[i].layout);e.pipelineLayout=r.getHandle().createPipelineLayout({bindGroupLayouts:a}),e.pipelineDescription.layout=e.pipelineLayout;for(let i=0;i<e.shaderDescriptions.length;i++){let s=e.shaderDescriptions[i],o=r.getShaderModule(s);s.getType()==="vertex"&&(e.pipelineDescription.vertex.module=o.getHandle(),e.pipelineDescription.vertex.entryPoint="main"),s.getType()==="fragment"&&(e.pipelineDescription.fragment.module=o.getHandle(),e.pipelineDescription.fragment.entryPoint="main")}e.handle=r.getHandle().createRenderPipeline(e.pipelineDescription)},t.getShaderDescription=r=>{for(let n=0;n<e.shaderDescriptions.length;n++)if(e.shaderDescriptions[n].getType()===r)return e.shaderDescriptions[n];return null},t.addBindGroupLayout=r=>{r&&e.layouts.push({layout:r.getBindGroupLayout(e.device),label:r.getLabel()})},t.getBindGroupLayout=r=>e.layouts[r].layout,t.getBindGroupLayoutIndex=r=>{for(let n=0;n<e.layouts.length;n++)if(e.layouts[n].label===r)return n;return-1},t.bindVertexInput=(r,n)=>{n.bindBuffers(r)}}var CC={extraPipelineSettings:null,handle:null,layouts:null,renderEncoder:null,shaderDescriptions:null,vertexState:null,topology:null,pipelineDescription:null};function Tp(t,e,r={}){Object.assign(e,CC,r),pe(t,e),e.layouts=[],e.shaderDescriptions=[],Ee(t,e,["handle","pipelineDescription"]),de(t,e,["device","extraPipelineSettings","renderEncoder","topology","vertexState"]),xC(t,e)}var OC=ue(Tp,"vtkWebGPUPipeline"),mp={newInstance:OC,extend:Tp};function wC(t,e){e.classHierarchy.push("vtkWebGPUShaderDescription"),t.hasOutput=r=>e.outputNames.includes(r),t.addOutput=(r,n,a=void 0)=>{e.outputTypes.push(r),e.outputNames.push(n),e.outputInterpolations.push(a)},t.addBuiltinOutput=(r,n)=>{e.builtinOutputNames.includes(n)||(e.builtinOutputTypes.push(r),e.builtinOutputNames.push(n))},t.addBuiltinInput=(r,n)=>{e.builtinInputNames.includes(n)||(e.builtinInputTypes.push(r),e.builtinInputNames.push(n))},t.replaceShaderCode=(r,n)=>{let a=[],i=[];if(n&&a.push(n.getShaderCode()),r||e.builtinInputNames.length){let s=[];if(s.push(`struct ${e.type}Input
{`),r){let o=r.getOutputNamesByReference(),c=r.getOutputTypesByReference(),f=r.getOutputInterpolationsByReference();for(let u=0;u<o.length;u++)f[u]!==void 0?s.push(`  @location(${u}) @interpolate(${f[u]}) ${o[u]} : ${c[u]},`):s.push(`  @location(${u}) ${o[u]} : ${c[u]},`)}for(let o=0;o<e.builtinInputNames.length;o++)s.push(`  ${e.builtinInputNames[o]} : ${e.builtinInputTypes[o]},`);s.length>1&&(s.push("};"),i=s,a[a.length-1]+=",",a.push(`input: ${e.type}Input`))}if(a.length&&(e.code=K.substitute(e.code,"//VTK::IOStructs::Input",a).result),e.outputNames.length+e.builtinOutputNames.length||e.code.includes("//VTK::IOStructs::Output")){let s=[`struct ${e.type}Output
{`];for(let o=0;o<e.outputNames.length;o++)e.outputInterpolations[o]!==void 0?s.push(`  @location(${o}) @interpolate(${e.outputInterpolations[o]}) ${e.outputNames[o]} : ${e.outputTypes[o]},`):s.push(`  @location(${o}) ${e.outputNames[o]} : ${e.outputTypes[o]},`);for(let o=0;o<e.builtinOutputNames.length;o++)s.push(`  ${e.builtinOutputNames[o]} : ${e.builtinOutputTypes[o]},`);s.push("};"),i=i.concat(s),e.code=K.substitute(e.code,"//VTK::IOStructs::Output",[`-> ${e.type}Output`]).result}e.code=K.substitute(e.code,"//VTK::IOStructs::Dec",i).result}}var RC={type:null,hash:null,code:null,outputNames:null,outputTypes:null};function yp(t,e,r={}){Object.assign(e,RC,r),e.outputNames=[],e.outputTypes=[],e.outputInterpolations=[],e.builtinOutputNames=[],e.builtinOutputTypes=[],e.builtinInputNames=[],e.builtinInputTypes=[],w.obj(t,e),w.setGet(t,e,["type","hash","code"]),w.getArray(t,e,["outputTypes","outputNames","outputInterpolations"]),wC(t,e)}var EC=w.newInstance(yp,"vtkWebGPUShaderDescription"),To={newInstance:EC,extend:yp};var Sp={r8unorm:{numComponents:1,nativeType:Uint8Array,stride:1,elementSize:1,sampleType:"float"},r8snorm:{numComponents:1,nativeType:Int8Array,stride:1,elementSize:1,sampleType:"float"},r8uint:{numComponents:1,nativeType:Uint8Array,stride:1,elementSize:1,sampleType:"uint"},r8sint:{numComponents:1,nativeType:Int8Array,stride:1,elementSize:1,sampleType:"sint"},r16uint:{numComponents:1,nativeType:Uint16Array,stride:2,elementSize:2,sampleType:"uint"},r16sint:{numComponents:1,nativeType:Int16Array,stride:2,elementSize:2,sampleType:"sint"},r16unorm:{numComponents:1,nativeType:Uint16Array,stride:2,elementSize:2,sampleType:"float"},r16snorm:{numComponents:1,nativeType:Int16Array,stride:2,elementSize:2,sampleType:"float"},r16float:{numComponents:1,nativeType:Float32Array,stride:2,elementSize:2,sampleType:"float"},rg8unorm:{numComponents:2,nativeType:Uint8Array,stride:2,elementSize:1,sampleType:"float"},rg8snorm:{numComponents:2,nativeType:Int8Array,stride:2,elementSize:1,sampleType:"float"},rg8uint:{numComponents:2,nativeType:Uint8Array,stride:2,elementSize:1,sampleType:"uint"},rg8sint:{numComponents:2,nativeType:Int8Array,stride:2,elementSize:1,sampleType:"sint"},r32uint:{numComponents:1,nativeType:Uint32Array,stride:4,elementSize:4,sampleType:"uint"},r32sint:{numComponents:1,nativeType:Int32Array,stride:4,elementSize:4,sampleType:"sint"},r32float:{numComponents:1,nativeType:Float32Array,stride:4,elementSize:4,sampleType:"unfilterable-float"},rg16uint:{numComponents:2,nativeType:Uint16Array,stride:4,elementSize:2,sampleType:"uint"},rg16sint:{numComponents:2,nativeType:Int16Array,stride:4,elementSize:2,sampleType:"sint"},rg16unorm:{numComponents:2,nativeType:Uint16Array,stride:4,elementSize:2,sampleType:"float"},rg16snorm:{numComponents:2,nativeType:Int16Array,stride:4,elementSize:2,sampleType:"float"},rg16float:{numComponents:2,nativeType:Float32Array,stride:4,elementSize:2,sampleType:"float"},rgba8unorm:{numComponents:4,nativeType:Uint8Array,stride:4,elementSize:1,sampleType:"float"},"rgba8unorm-srgb":{numComponents:4,nativeType:Uint8Array,stride:4,elementSize:1,sampleType:"float"},rgba8snorm:{numComponents:4,nativeType:Int8Array,stride:4,elementSize:1,sampleType:"float"},rgba8uint:{numComponents:4,nativeType:Uint8Array,stride:4,elementSize:1,sampleType:"uint"},rgba8sint:{numComponents:4,nativeType:Int8Array,stride:4,elementSize:1,sampleType:"sint"},bgra8unorm:{numComponents:4,nativeType:Uint8Array,stride:4,elementSize:1,sampleType:"float"},"bgra8unorm-srgb":{numComponents:4,nativeType:Uint8Array,stride:4,elementSize:1,sampleType:"float"},rgb9e5ufloat:{numComponents:4,nativeType:Uint32Array,stride:4,sampleType:"float"},rgb10a2unorm:{numComponents:4,nativeType:Uint32Array,stride:4,sampleType:"float"},rg11b10ufloat:{numComponents:4,nativeType:Float32Array,stride:4,sampleType:"float"},rg32uint:{numComponents:2,nativeType:Uint32Array,stride:8,elementSize:4,sampleType:"uint"},rg32sint:{numComponents:2,nativeType:Int32Array,stride:8,elementSize:4,sampleType:"sint"},rg32float:{numComponents:2,nativeType:Float32Array,stride:8,elementSize:4,sampleType:"unfilterable-float"},rgba16uint:{numComponents:4,nativeType:Uint16Array,stride:8,elementSize:2,sampleType:"uint"},rgba16sint:{numComponents:4,nativeType:Int16Array,stride:8,elementSize:2,sampleType:"sint"},rgba16unorm:{numComponents:4,nativeType:Uint16Array,stride:8,elementSize:2,sampleType:"float"},rgba16snorm:{numComponents:4,nativeType:Int16Array,stride:8,elementSize:2,sampleType:"float"},rgba16float:{numComponents:4,nativeType:Float32Array,stride:8,elementSize:2,sampleType:"float"},rgba32uint:{numComponents:4,nativeType:Uint32Array,stride:16,elementSize:4,sampleType:"uint"},rgba32sint:{numComponents:4,nativeType:Int32Array,stride:16,elementSize:4,sampleType:"sint"},rgba32float:{numComponents:4,nativeType:Float32Array,stride:16,elementSize:4,sampleType:"unfilterable-float"},stencil8:{numComponents:1,nativeType:Uint8Array,stride:1,elementSize:1,sampleType:"uint"},depth16unorm:{numComponents:1,nativeType:Uint16Array,stride:2,elementSize:2,sampleType:"depth"},depth24plus:{numComponents:1,nativeType:Uint32Array,stride:4,elementSize:3,sampleType:"depth"},"depth24plus-stencil8":{numComponents:2,nativeType:Uint32Array,stride:4,sampleType:"mixed"},depth32float:{numComponents:1,nativeType:Float32Array,stride:4,elementSize:4,sampleType:"depth"}};function MC(t){return!t||t.length<6?0:t in Sp?Sp[t]:(le(`unknown format ${t}`),null)}function DC(t){if(!t||t.length<5)return 0;let e=1;t[t.length-2]==="x"&&(e=Number(t[t.length-1]));let r=e===1?t.length-1:t.length-3,n=Number(t[r]);if(Number.isNaN(n))return le(`unknown format ${t}`),0;let a=5-n/2;return e*a}function VC(t){if(!t||t.length<5)return 0;let e=1;return t[t.length-2]==="x"&&(e=Number(t[t.length-1])),e}function LC(t){if(!t||t.length<5)return 0;let e;if(t[0]==="f")e="Float";else if(t[0]==="s")e="Int";else if(t[0]==="u")e="Uint";else{le(`unknown format ${t}`);return}let r=t.split("x")[0],n=Number(r[r.length-1]);if(Number.isNaN(n)){le(`unknown format ${t}`);return}return e+=8*(5-n/2),e+="Array",e}function _C(t){let e;if(t[0]==="f"||t[1]==="n")e="f32";else if(t[0]==="s"&&t[1]==="i")e="i32";else if(t[0]==="u"&&t[1]==="i")e="u32";else{le(`unknown format ${t}`);return}let r=1;return t[t.length-2]==="x"&&(r=Number(t[t.length-1])),r===4?`vec4<${e}>`:r===3?`vec3<${e}>`:r===2?`vec2<${e}>`:e}function BC(t){if(!t)return 0;let e=1;return t.substring(0,3)==="vec"?e=Number(t[3]):t.substring(0,3)==="mat"&&(e=t[3]*t[5]),e*4}function FC(t){if(t){if(t.includes("f32"))return"Float32Array";if(t.includes("i32"))return"Int32Array";if(t.includes("u32"))return"Uint32Array";le(`unknown format ${t}`)}}var Ve={getDetailsFromTextureFormat:MC,getByteStrideFromBufferFormat:DC,getNumberOfComponentsFromBufferFormat:VC,getNativeTypeFromBufferFormat:LC,getShaderTypeFromBufferFormat:_C,getByteStrideFromShaderFormat:BC,getNativeTypeFromShaderFormat:FC};function UC(t,e){if(t===e)return!0;if(t==null||e==null||t.length!==e.length)return!1;let r=new Set(e);for(let n=0;n<t.length;++n)if(!r.has(t[n]))return!1;return!0}function NC(t,e){e.classHierarchy.push("vtkWebGPUVertexInput"),t.addBuffer=(r,n,a="vertex")=>{let i=n;Array.isArray(i)||(i=[i]);for(let s=0;s<e.inputs.length;s++)if(UC(e.inputs[s].names,i)){if(e.inputs[s].buffer===r)return;e.inputs[s].buffer=r;return}e.inputs.push({buffer:r,stepMode:a,names:i}),e.inputs=e.inputs.sort((s,o)=>s.names[0]<o.names[0]?-1:s.names[0]>o.names[0]?1:0)},t.removeBufferIfPresent=r=>{for(let n=0;n<e.inputs.length;n++)e.inputs[n].names.includes(r)&&e.inputs.splice(n,1)},t.getBuffer=r=>{for(let n=0;n<e.inputs.length;n++)if(e.inputs[n].names.includes(r))return e.inputs[n].buffer;return null},t.hasAttribute=r=>{for(let n=0;n<e.inputs.length;n++)if(e.inputs[n].names.includes(r))return!0;return!1},t.getAttributeTime=r=>{for(let n=0;n<e.inputs.length;n++)if(e.inputs[n].names.includes(r))return e.inputs[n].buffer.getSourceTime();return 0},t.getShaderCode=()=>{let r="",n=0;for(let a=0;a<e.inputs.length;a++)for(let i=0;i<e.inputs[a].names.length;i++){let s=e.inputs[a].buffer.getArrayInformation()[i],o=Ve.getShaderTypeFromBufferFormat(s.format);n>0&&(r+=`,
`),r=`${r}  @location(${n}) ${e.inputs[a].names[i]} : ${o}`,n++}return r},t.getVertexInputInformation=()=>{let r={};if(e.inputs.length){let n=[],a=0;for(let i=0;i<e.inputs.length;i++){let s=e.inputs[i].buffer,o={arrayStride:s.getStrideInBytes(),stepMode:e.inputs[i].stepMode,attributes:[]},c=s.getArrayInformation();for(let f=0;f<e.inputs[i].names.length;f++)o.attributes.push({shaderLocation:a,offset:c[f].offset,format:c[f].format}),a++;n.push(o)}r.buffers=n}return r},t.bindBuffers=r=>{for(let n=0;n<e.inputs.length;n++)r.setVertexBuffer(n,e.inputs[n].buffer.getHandle());e.indexBuffer&&r.setIndexBuffer(e.indexBuffer.getHandle(),e.indexBuffer.getArrayInformation()[0].format)},t.getReady=()=>{},t.releaseGraphicsResources=()=>{e.created&&(e.inputs=[],e.bindingDescriptions=[],e.attributeDescriptions=[])}}var GC={inputs:null,bindingDescriptions:!1,attributeDescriptions:null,indexBuffer:null};function xp(t,e,r={}){Object.assign(e,GC,r),pe(t,e),e.bindingDescriptions=[],e.attributeDescriptions=[],e.inputs=[],de(t,e,["created","device","handle","indexBuffer"]),NC(t,e)}var kC=ue(xp,"vtkWebGPUVertexInput"),Cp={newInstance:kC,extend:xp};var bC=`
//VTK::Renderer::Dec

//VTK::Color::Dec

//VTK::Normal::Dec

//VTK::TCoord::Dec

//VTK::Select::Dec

//VTK::Mapper::Dec

//VTK::IOStructs::Dec

@vertex
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output : vertexOutput;

  // var vertex: vec4<f32> = vertexBC;

  //VTK::Color::Impl

  //VTK::Normal::Impl

  //VTK::TCoord::Impl

  //VTK::Select::Impl

  //VTK::Position::Impl

  return output;
}
`,zC=`
//VTK::Renderer::Dec

//VTK::Color::Dec

//VTK::Normal::Dec

//VTK::TCoord::Dec

//VTK::Select::Dec

//VTK::RenderEncoder::Dec

//VTK::Mapper::Dec

//VTK::IOStructs::Dec

@fragment
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output : fragmentOutput;

  //VTK::Color::Impl

  //VTK::Normal::Impl

  //VTK::Light::Impl

  //VTK::TCoord::Impl

  //VTK::Select::Impl

  // var computedColor:vec4<f32> = vec4<f32>(1.0,0.5,0.5,1.0);

  //VTK::RenderEncoder::Impl
  return output;
}
`;function WC(t,e){e.classHierarchy.push("vtkWebGPUSimpleMapper"),t.generateShaderDescriptions=(r,n,a)=>{let i=To.newInstance({type:"vertex",hash:r,code:e.vertexShaderTemplate}),s=To.newInstance({type:"fragment",hash:r,code:e.fragmentShaderTemplate}),o=n.getShaderDescriptions();o.push(i),o.push(s);let c=e.vertexShaderTemplate+e.fragmentShaderTemplate,f=new RegExp("//VTK::[^:]*::","g"),u=c.match(f).filter((g,l,h)=>h.indexOf(g)===l).map(g=>`replaceShader${g.substring(7,g.length-2)}`);for(let g=0;g<u.length;g++){let l=u[g];l!=="replaceShaderIOStructs"&&e.shaderReplacements.has(l)&&e.shaderReplacements.get(l)(r,n,a)}t.replaceShaderIOStructs(r,n,a)},t.replaceShaderIOStructs=(r,n,a)=>{let i=n.getShaderDescription("vertex");i.replaceShaderCode(null,a),n.getShaderDescription("fragment").replaceShaderCode(i)},t.replaceShaderRenderEncoder=(r,n,a)=>{e.renderEncoder.replaceShaderCode(n)},e.shaderReplacements.set("replaceShaderRenderEncoder",t.replaceShaderRenderEncoder),t.replaceShaderRenderer=(r,n,a)=>{if(!e.WebGPURenderer)return;let i=e.WebGPURenderer.getBindGroup().getShaderCode(n),s=n.getShaderDescription("vertex"),o=s.getCode();o=K.substitute(o,"//VTK::Renderer::Dec",[i]).result,s.setCode(o);let c=n.getShaderDescription("fragment");o=c.getCode(),o=K.substitute(o,"//VTK::Renderer::Dec",[i]).result,c.setCode(o)},e.shaderReplacements.set("replaceShaderRenderer",t.replaceShaderRenderer),t.replaceShaderMapper=(r,n,a)=>{let i=e.bindGroup.getShaderCode(n),s=n.getShaderDescription("vertex"),o=s.getCode();o=K.substitute(o,"//VTK::Mapper::Dec",[i]).result,s.setCode(o);let c=n.getShaderDescription("fragment");c.addBuiltinInput("bool","@builtin(front_facing) frontFacing"),o=c.getCode(),o=K.substitute(o,"//VTK::Mapper::Dec",[i]).result,c.setCode(o)},e.shaderReplacements.set("replaceShaderMapper",t.replaceShaderMapper),t.replaceShaderPosition=(r,n,a)=>{let i=n.getShaderDescription("vertex");i.addBuiltinOutput("vec4<f32>","@builtin(position) Position");let s=i.getCode();s=K.substitute(s,"//VTK::Position::Impl",["    output.Position = rendererUBO.SCPCMatrix*vertexBC;"]).result,i.setCode(s)},e.shaderReplacements.set("replaceShaderPosition",t.replaceShaderPosition),t.replaceShaderTCoord=(r,n,a)=>{n.getShaderDescription("vertex").addOutput("vec2<f32>","tcoordVS")},e.shaderReplacements.set("replaceShaderTCoord",t.replaceShaderTCoord),t.addTextureView=r=>{e.textureViews.includes(r)||e.textureViews.push(r)},t.prepareToDraw=r=>{e.renderEncoder=r,t.updateInput(),t.updateBuffers(),t.updateBindings(),t.updatePipeline()},t.updateInput=()=>{},t.updateBuffers=()=>{},t.updateBindings=()=>{e.bindGroup.setBindables(t.getBindables())},t.computePipelineHash=()=>{},t.getPipelineSettings=()=>null,t.registerDrawCallback=r=>{r.registerDrawCallback(e.pipeline,t.draw)},t.prepareAndDraw=r=>{t.prepareToDraw(r),r.setPipeline(e.pipeline),t.draw(r)},t.draw=r=>{if(e.numberOfVertices===0||e.numberOfInstances===0)return;let n=r.getBoundPipeline();r.activateBindGroup(e.bindGroup),e.WebGPURenderer&&e.WebGPURenderer.bindUBO(r),n.bindVertexInput(r,e.vertexInput);let a=e.vertexInput.getIndexBuffer();a?r.drawIndexed(a.getIndexCount(),e.numberOfInstances,0,0,0):r.draw(e.numberOfVertices,e.numberOfInstances,0,0)},t.getBindables=()=>{let r=[...e.additionalBindables];e.UBO&&r.push(e.UBO),e.SSBO&&r.push(e.SSBO);for(let n=0;n<e.textureViews.length;n++){r.push(e.textureViews[n]);let a=e.textureViews[n].getSampler();a&&r.push(a)}return r},t.updatePipeline=()=>{t.computePipelineHash();let r=`${e.pipelineHash}${e.renderEncoder?.getPipelineHash()??""}`;e.pipeline=e.device.getPipeline(r),e.pipeline||(e.pipeline=mp.newInstance(),e.pipeline.setDevice(e.device),e.WebGPURenderer&&e.pipeline.addBindGroupLayout(e.WebGPURenderer.getBindGroup()),e.pipeline.addBindGroupLayout(e.bindGroup),t.generateShaderDescriptions(e.pipelineHash,e.pipeline,e.vertexInput),e.pipeline.setExtraPipelineSettings(t.getPipelineSettings()),e.pipeline.setTopology(e.topology),e.pipeline.setRenderEncoder(e.renderEncoder),e.pipeline.setVertexState(e.vertexInput.getVertexInputInformation()),e.device.createPipeline(r,e.pipeline))},t.releaseGraphicsResources=()=>{e.vertexInput?.releaseGraphicsResources?.(),e.bindGroup?.releaseGraphicsResources?.(),e.UBO?.releaseGraphicsResources?.(),e.SSBO?.releaseGraphicsResources?.(),e.pipeline=null,e.renderEncoder=null,e.textureViews.length=0}}var IC={additionalBindables:void 0,bindGroup:null,device:null,fragmentShaderTemplate:null,numberOfInstances:1,numberOfVertices:0,pipelineHash:null,shaderReplacements:null,SSBO:null,textureViews:null,topology:"triangle-list",UBO:null,vertexShaderTemplate:null,WebGPURenderer:null};function Op(t,e,r={}){Object.assign(e,IC,r),ve.extend(t,e,r),e.textureViews=[],e.vertexInput=Cp.newInstance(),e.bindGroup=gi.newInstance({label:"mapperBG"}),e.additionalBindables=[],e.fragmentShaderTemplate=e.fragmentShaderTemplate||zC,e.vertexShaderTemplate=e.vertexShaderTemplate||bC,e.shaderReplacements=new Map,w.get(t,e,["pipeline","vertexInput"]),w.setGet(t,e,["additionalBindables","device","fragmentShaderTemplate","interpolate","numberOfInstances","numberOfVertices","pipelineHash","shaderReplacements","SSBO","textureViews","topology","UBO","vertexShaderTemplate","WebGPURenderer"]),WC(t,e)}var HC=w.newInstance(Op,"vtkWebGPUSimpleMapper"),on={newInstance:HC,extend:Op};function jC(t,e){e.classHierarchy.push("vtkWebGPUFullScreenQuad"),t.replaceShaderPosition=(r,n,a)=>{let i=n.getShaderDescription("vertex");i.addBuiltinOutput("vec4<f32>","@builtin(position) Position"),i.addOutput("vec4<f32>","vertexVC");let s=i.getCode();s=K.substitute(s,"//VTK::Position::Impl",["output.tcoordVS = vec2<f32>(vertexBC.x * 0.5 + 0.5, 1.0 - vertexBC.y * 0.5 - 0.5);","output.Position = vec4<f32>(vertexBC, 1.0);","output.vertexVC = vec4<f32>(vertexBC, 1);"]).result,i.setCode(s)},e.shaderReplacements.set("replaceShaderPosition",t.replaceShaderPosition),t.updateBuffers=()=>{let r=e.device.getBufferManager().getFullScreenQuadBuffer();e.vertexInput.addBuffer(r,["vertexBC"]),e.numberOfVertices=6}}var PC={};function wp(t,e,r={}){Object.assign(e,PC,r),on.extend(t,e,r),jC(t,e)}var $C=w.newInstance(wp,"vtkWebGPUFullScreenQuad"),xt={newInstance:$C,extend:wp};var Pn={Verts:0,Lines:1,Triangles:2,Strips:3,LinesFromStrips:4,LinesFromTriangles:5,Points:6,UniformArray:7,PointArray:8,NormalsFromPoints:9,Texture:10,RawVertex:11,Storage:12,Index:13},mo={Start:0,Points:0,Lines:1,Triangles:2,TriangleStrips:3,TriangleEdges:4,TriangleStripEdges:5,End:6},hr={BufferUsage:Pn,PrimitiveTypes:mo};var yo=["getMappedRange","mapAsync","unmap"];function AC(t,e,r,n){let a=n.byteLength,i=t.createBuffer({size:a,usage:GPUBufferUsage.COPY_SRC,mappedAtCreation:!0}),s=i.getMappedRange(0,a);new Uint8Array(s).set(new Uint8Array(n)),i.unmap();let o=t.createCommandEncoder();o.copyBufferToBuffer(i,0,e,r,a);let c=o.finish();t.queue.submit([c]),i.destroy()}function KC(t,e){e.classHierarchy.push("vtkWebGPUBuffer"),t.create=(r,n)=>{e.handle=e.device.getHandle().createBuffer({size:r,usage:n,label:e.label}),e.sizeInBytes=r,e.usage=n},t.write=r=>{AC(e.device.getHandle(),e.handle,0,r.buffer)},t.createAndWrite=(r,n)=>{let a=Math.ceil(r.byteLength/4)*4;e.handle=e.device.getHandle().createBuffer({size:a,usage:n,mappedAtCreation:!0,label:e.label}),e.sizeInBytes=a,e.usage=n,new Uint8Array(e.handle.getMappedRange()).set(new Uint8Array(r.buffer)),e.handle.unmap()};for(let r=0;r<yo.length;r++)t[yo[r]]=(...n)=>e.handle[yo[r]](...n)}var XC={device:null,handle:null,sizeInBytes:0,strideInBytes:0,arrayInformation:null,usage:null,label:null,sourceTime:null};function Rp(t,e,r={}){Object.assign(e,XC,r),w.obj(t,e),w.get(t,e,["handle","sizeInBytes","usage"]),w.setGet(t,e,["strideInBytes","device","arrayInformation","label","sourceTime"]),KC(t,e)}var YC=w.newInstance(Rp),zt={newInstance:YC,extend:Rp,...hr};var{Representation:$n,Interpolation:cn}=Gs;function Ep(t){return()=>w.vtkErrorMacro(`vtkProperty::${t} - NOT IMPLEMENTED`)}function qC(t,e){e.classHierarchy.push("vtkProperty"),t.setColor=(r,n,a)=>{Array.isArray(r)?(e.color[0]!==r[0]||e.color[1]!==r[1]||e.color[2]!==r[2])&&(e.color[0]=r[0],e.color[1]=r[1],e.color[2]=r[2],t.modified()):(e.color[0]!==r||e.color[1]!==n||e.color[2]!==a)&&(e.color[0]=r,e.color[1]=n,e.color[2]=a,t.modified()),t.setDiffuseColor(e.color),t.setAmbientColor(e.color),t.setSpecularColor(e.color)},t.computeCompositeColor=Ep("ComputeCompositeColor"),t.getColor=()=>{let r=0;e.ambient+e.diffuse+e.specular>0&&(r=1/(e.ambient+e.diffuse+e.specular));for(let n=0;n<3;n++)e.color[n]=r*(e.ambient*e.ambientColor[n]+e.diffuse*e.diffuseColor[n]+e.specular*e.specularColor[n]);return[].concat(e.color)},t.addShaderVariable=Ep("AddShaderVariable"),t.setInterpolationToFlat=()=>t.setInterpolation(cn.FLAT),t.setInterpolationToGouraud=()=>t.setInterpolation(cn.GOURAUD),t.setInterpolationToPhong=()=>t.setInterpolation(cn.PHONG),t.setInterpolationToPBR=()=>t.setInterpolation(cn.PBR),t.getInterpolationAsString=()=>w.enumToString(cn,e.interpolation),t.setRepresentationToWireframe=()=>t.setRepresentation($n.WIREFRAME),t.setRepresentationToSurface=()=>t.setRepresentation($n.SURFACE),t.setRepresentationToPoints=()=>t.setRepresentation($n.POINTS),t.getRepresentationAsString=()=>w.enumToString($n,e.representation)}var ZC={color:[1,1,1],ambientColor:[1,1,1],diffuseColor:[1,1,1],specularColor:[1,1,1],edgeColor:[0,0,0],ambient:0,diffuse:1,metallic:0,roughness:.6,normalStrength:1,emission:1,baseIOR:1.45,specular:0,specularPower:1,opacity:1,edgeOpacity:1,interpolation:cn.GOURAUD,representation:$n.SURFACE,edgeVisibility:!1,backfaceCulling:!1,frontfaceCulling:!1,pointSize:1,lineWidth:1,lighting:!0,anisotropy:0,anisotropyRotation:0,coatStrength:0,coatRoughness:0,coatColor:[1,1,1],coatF0:.04,coatNormalStrength:1,displacementFactor:1,emissiveStrength:1,occlusionStrength:1,transmissionFactor:0,alphaCutoff:0,alphaMode:0,thicknessFactor:0,attenuationDistance:1/0,attenuationColor:[1,1,1],iridescenceFactor:0,iridescenceIOR:1.3,iridescenceThicknessMinimum:100,iridescenceThicknessMaximum:400,sheenColorFactor:[0,0,0],sheenRoughnessFactor:0,diffuseTransmissionFactor:0,diffuseTransmissionColorFactor:[1,1,1],dispersion:0,specularFactor:1,specularColorFactor:[1,1,1],textureTransforms:{},shading:!1,materialName:null,ORMTexture:null,RMTexture:null,anisotropyTexture:null,coatTexture:null,coatRoughnessTexture:null,coatNormalTexture:null,displacementTexture:null,transmissionTexture:null,thicknessTexture:null,iridescenceTexture:null,iridescenceThicknessTexture:null,sheenColorTexture:null,sheenRoughnessTexture:null,diffuseTransmissionTexture:null,diffuseTransmissionColorTexture:null,specularTexture:null,specularColorTexture:null};function Mp(t,e,r={}){Object.assign(e,ZC,r),w.obj(t,e),w.setGet(t,e,["lighting","interpolation","ambient","diffuse","metallic","roughness","normalStrength","emission","baseIOR","specular","specularPower","opacity","edgeOpacity","edgeVisibility","lineWidth","pointSize","backfaceCulling","frontfaceCulling","representation","diffuseTexture","metallicTexture","roughnessTexture","normalTexture","ambientOcclusionTexture","emissionTexture","anisotropy","anisotropyRotation","coatStrength","coatRoughness","coatF0","coatNormalStrength","displacementFactor","emissiveStrength","occlusionStrength","transmissionFactor","alphaCutoff","alphaMode","thicknessFactor","attenuationDistance","iridescenceFactor","iridescenceIOR","iridescenceThicknessMinimum","iridescenceThicknessMaximum","sheenRoughnessFactor","diffuseTransmissionFactor","dispersion","ORMTexture","RMTexture","anisotropyTexture","coatTexture","coatRoughnessTexture","coatNormalTexture","displacementTexture","transmissionTexture","thicknessTexture","iridescenceTexture","iridescenceThicknessTexture","sheenColorTexture","sheenRoughnessTexture","diffuseTransmissionTexture","diffuseTransmissionColorTexture","specularFactor","specularTexture","specularColorTexture"]),w.setGetArray(t,e,["ambientColor","specularColor","diffuseColor","edgeColor","coatColor","attenuationColor","sheenColorFactor","diffuseTransmissionColorFactor","specularColorFactor"],3),t.setTextureTransform=(n,a)=>{e.textureTransforms||(e.textureTransforms={}),e.textureTransforms[n]={...a},t.modified()},t.setTextureTransforms=n=>{e.textureTransforms=n||{},t.modified()},t.getTextureTransform=n=>e.textureTransforms?.[n]||null,t.getTextureTransforms=()=>e.textureTransforms||{},qC(t,e)}var QC=w.newInstance(Mp,"vtkProperty"),vr={newInstance:QC,extend:Mp,...Gs};var{Representation:Dp}=vr,{PrimitiveTypes:Tr}=hr,JC=class{constructor(){this.keys=new Uint32Array(10),this.values=new Uint32Array(10),this.count=0}clear(){this.count=0}has(t){for(let e=0;e<this.count;e++)if(this.keys[e]===t)return!0;return!1}get(t){for(let e=0;e<this.count;e++)if(this.keys[e]===t)return this.values[e]}set(t,e){this.count<9&&(this.keys[this.count]=t,this.values[this.count++]=e)}};function e2(t){switch(t){case Tr.Points:return"points";case Tr.Lines:return"lines";case Tr.Triangles:case Tr.TriangleEdges:return"polys";case Tr.TriangleStripEdges:case Tr.TriangleStrips:return"strips";default:return""}}function hi(t,e,r){let n=t.pointIdToFlatId[e];return n<0&&(n=t.flatId,t.pointIdToFlatId[e]=n,t.flatIdToPointId[t.flatId]=e,t.flatIdToCellId[t.flatId]=r,t.flatId++),n}function t2(t,e,r){let n=t.length;for(let s=0;s<n;s++){let o=t[s];if(r.cellProvokedMap.has(o)){r.ibo[r.iboId++]=r.cellProvokedMap.get(o);for(let c=s+1;c<s+n;c++){o=t[c%n];let f=hi(r,o,e);r.ibo[r.iboId++]=f}return}}for(let s=0;s<n;s++){let o=t[s];if(!r.provokedPointIds[o]){let c=hi(r,o,e);r.provokedPointIds[o]=1,r.cellProvokedMap.set(o,c),r.flatIdToCellId[c]=e,r.ibo[r.iboId++]=c;for(let f=s+1;f<s+n;f++)o=t[f%n],c=hi(r,o,e),r.ibo[r.iboId++]=c;return}}let a=t[0],i=r.flatId;r.cellProvokedMap.set(a,i),r.flatIdToPointId[r.flatId]=a,r.flatIdToCellId[r.flatId]=e,r.flatId++,r.ibo[r.iboId++]=i;for(let s=1;s<n;s++)a=t[s],i=hi(r,a,e),r.ibo[r.iboId++]=i}function r2(t,e,r){let n=t.length;r.iboSize+=n;for(let a=0;a<n;a++){let i=t[a];if(r.cellProvokedMap.has(i))return}for(let a=0;a<n;a++){let i=t[a];if(!r.provokedPointIds[i]){r.provokedPointIds[i]=1,r.cellProvokedMap.set(i,1);return}}r.cellProvokedMap.set(t[0],1),r.extraPoints++}function n2(t,e,r){r.iboSize+=t.length,r.primitiveCount++}function a2(t,e,r){for(let n=0;n<t.length;n++)r.ibo[r.iboId++]=t[n];r.primitiveToCellId&&(r.primitiveToCellId[r.primitiveCount]=e),r.primitiveCount++}var Lt,Vp=new Uint32Array(1),Ct=new Uint32Array(2),dr=new Uint32Array(3),So={anythingToPoints(t,e,r,n,a){for(let i=0;i<t;++i)Vp[0]=e[r+i],Lt(Vp,n,a)},linesToWireframe(t,e,r,n,a){for(let i=0;i<t-1;++i)Ct[0]=e[r+i],Ct[1]=e[r+i+1],Lt(Ct,n,a)},polysToWireframe(t,e,r,n,a){if(t>2)for(let i=0;i<t;++i)Ct[0]=e[r+i],Ct[1]=e[r+(i+1)%t],Lt(Ct,n,a)},stripsToWireframe(t,e,r,n,a){if(t>2){for(let i=0;i<t-1;++i)Ct[0]=e[r+i],Ct[1]=e[r+i+1],Lt(Ct,n,a);for(let i=0;i<t-2;i++)Ct[0]=e[r+i],Ct[1]=e[r+i+2],Lt(Ct,n,a)}},polysToSurface(t,e,r,n,a){for(let i=0;i<t-2;i++)dr[0]=e[r],dr[1]=e[r+i+1],dr[2]=e[r+i+2],Lt(dr,n,a)},stripsToSurface(t,e,r,n,a){for(let i=0;i<t-2;i++)dr[0]=e[r+i],dr[1]=e[r+i+1+i%2],dr[2]=e[r+i+1+(i+1)%2],Lt(dr,n,a)}};function Lp(t,e){let r=e2(t);return e===Dp.POINTS||t===Tr.Points?So.anythingToPoints:e===Dp.WIREFRAME||t===Tr.Lines?So[`${r}ToWireframe`]:So[`${r}ToSurface`]}function i2(t,e){e.classHierarchy.push("vtkWebGPUIndexBuffer"),t.buildPointIdIndexBuffer=r=>{let n=r.cells.getData(),a=n.length,i=r.cellOffset||0,s=r.numberOfPoints,o=Lp(r.primitiveType,r.representation),c={iboSize:0,iboId:0,primitiveCount:0,primitiveToCellId:null};Lt=n2;let f=!0,u=i;for(let g=0;g<a;){let l=c.primitiveCount;o(n[g],n,g+1,u,c),c.primitiveCount-l!==1&&(f=!1),g+=n[g]+1,u++}s<=65535?(c.ibo=new Uint16Array(c.iboSize),r.format="uint16"):(c.ibo=new Uint32Array(c.iboSize),r.format="uint32"),f||(c.primitiveToCellId=new Uint32Array(c.primitiveCount)),Lt=a2,c.primitiveCount=0,u=i;for(let g=0;g<a;)o(n[g],n,g+1,u,c),g+=n[g]+1,u++;r.nativeArray=c.ibo,e.flatIdToPointId=null,e.flatIdToCellId=null,e.flatSize=s,e.indexCount=c.iboId,e.primitiveToCellId=c.primitiveToCellId},t.buildFlatIndexBuffer=r=>{let n=r.cells,a=r.primitiveType,i=r.representation,s=r.cellOffset,o=n.getData(),c=o.length,f=r.numberOfPoints,u={provokedPointIds:new Uint8Array(f),extraPoints:0,iboSize:0,flatId:0,iboId:0,cellProvokedMap:new JC},g=Lp(a,i);Lt=r2;let l=s||0;for(let h=0;h<c;)u.cellProvokedMap.clear(),g(o[h],o,h+1,l,u),h+=o[h]+1,l++;f<=65535?u.flatIdToPointId=new Uint16Array(f+u.extraPoints):u.flatIdToPointId=new Uint32Array(f+u.extraPoints),f+u.extraPoints<=32767?u.pointIdToFlatId=new Int16Array(f):u.pointIdToFlatId=new Int32Array(f),f+u.extraPoints<=65535?(u.ibo=new Uint16Array(u.iboSize),r.format="uint16"):(u.ibo=new Uint32Array(u.iboSize),r.format="uint32"),l<=65535?u.flatIdToCellId=new Uint16Array(f+u.extraPoints):u.flatIdToCellId=new Uint32Array(f+u.extraPoints),u.pointIdToFlatId.fill(-1),u.provokedPointIds.fill(0),Lt=t2,l=s||0;for(let h=0;h<c;)u.cellProvokedMap.clear(),g(o[h],o,h+1,l,u),h+=o[h]+1,l++;delete u.provokedPointIds,delete u.pointIdToFlatId,r.nativeArray=u.ibo,e.flatIdToPointId=u.flatIdToPointId,e.flatIdToCellId=u.flatIdToCellId,e.flatSize=u.flatId,e.indexCount=u.iboId,e.primitiveToCellId=null},t.buildIndexBuffer=r=>{r.pointIds?t.buildPointIdIndexBuffer(r):t.buildFlatIndexBuffer(r)}}var s2={flatIdToPointId:null,flatIdToCellId:null,flatSize:0,indexCount:0,primitiveToCellId:null,primitiveToCellIdBuffer:null};function _p(t,e,r={}){Object.assign(e,s2,r),zt.extend(t,e,r),w.setGet(t,e,["flatIdToPointId","flatIdToCellId","flatSize","indexCount","primitiveToCellId","primitiveToCellIdBuffer"]),i2(t,e)}var o2=w.newInstance(_p),Bp={newInstance:o2,extend:_p,...hr};var{BufferUsage:it}=hr,{vtkErrorMacro:c2}=we,{VtkDataTypes:br}=Z,f2={};function Fp(t){let e;switch(t.getDataType()){case br.UNSIGNED_CHAR:e="uint8";break;case br.FLOAT:e="float32";break;case br.UNSIGNED_INT:e="uint32";break;case br.INT:e="sint32";break;case br.DOUBLE:e="float32";break;case br.UNSIGNED_SHORT:e="uint16";break;case br.SHORT:e="sint16";break;default:e="float32"}switch(t.getNumberOfComponents()){case 2:e+="x2";break;case 3:e.includes("32")||c2(`unsupported x3 type for ${e}`),e+="x3";break;case 4:e+="x4"}return e}function Up(t,e,r,n,a){let i={},s=t.getFlatSize();if(!s)return i;let o=[0,0,0,0];a.shift&&(a.shift.length?o=a.shift:o.fill(a.shift));let c=[1,1,1,1];a.scale&&(a.scale.length?c=a.scale:c.fill(a.scale));let f=Object.prototype.hasOwnProperty.call(a,"packExtra")?a.packExtra:!1,u,g=0,l=r+(f?1:0),h=Xr(n,s*l),y=t.getFlatIdToPointId(),p=0;if(a.cellData&&(y=t.getFlatIdToCellId(),p=a.cellOffset||0),r===1?u=function(d){h[g++]=c[0]*e[d]+o[0]}:r===2?u=function(d){h[g++]=c[0]*e[d]+o[0],h[g++]=c[1]*e[d+1]+o[1]}:r===3&&!f?u=function(d){h[g++]=c[0]*e[d]+o[0],h[g++]=c[1]*e[d+1]+o[1],h[g++]=c[2]*e[d+2]+o[2]}:r===3&&f?u=function(d){h[g++]=c[0]*e[d]+o[0],h[g++]=c[1]*e[d+1]+o[1],h[g++]=c[2]*e[d+2]+o[2],h[g++]=c[3]*1+o[3]}:r===4&&(u=function(d){h[g++]=c[0]*e[d]+o[0],h[g++]=c[1]*e[d+1]+o[1],h[g++]=c[2]*e[d+2]+o[2],h[g++]=c[3]*e[d+3]+o[3]}),y)for(let m=0;m<s;m++){let d=r*(y[m]-p);u(d)}else for(let m=0;m<s;m++)u(r*m);return i.nativeArray=h,i}function u2(t,e,r,n){let a=[t[n*3]-t[r*3],t[n*3+1]-t[r*3+1],t[n*3+2]-t[r*3+2]],i=[t[e*3]-t[r*3],t[e*3+1]-t[r*3+1],t[e*3+2]-t[r*3+2]],s=[];return Ge(a,i,s),et(s),s}function Np(t,e){let r=e.getData(),n=t.getData();if(!n||!r)return null;let a=new Int8Array(t.getNumberOfCells()*4),i=n.length,s=0;for(let o=0;o<i;){let c=u2(r,n[o+1],n[o+2],n[o+3]);a[s++]=127*c[0],a[s++]=127*c[1],a[s++]=127*c[2],a[s++]=127,o+=n[o]+1}return a}function l2(t){switch(t.usage){case it.Index:case it.PointArray:case it.NormalsFromPoints:break;default:return null}let e=`u${t.usage}`;return t.format&&(e+=`f${t.format}`),t.dataArray&&(e+=`d${t.dataArray.getMTime()}`),t.cells&&(e+=`c${t.cells.getMTime()}`),t.indexBuffer&&(e+=`i${t.indexBuffer.getMTime?.()??0}`),t.representation!==void 0&&(e+=`R${t.representation}`),t.primitiveType!==void 0&&(e+=`P${t.primitiveType}`),t.cellOffset!==void 0&&(e+=`O${t.cellOffset}`),t.cellData&&(e+="cd"),t.pointIds&&(e+="pi"),t.packExtra&&(e+="pe"),t.shift!==void 0&&(e+=`s${Array.isArray(t.shift)?t.shift.join():t.shift}`),t.scale!==void 0&&(e+=`S${Array.isArray(t.scale)?t.scale.join():t.scale}`),e}function p2(t,e){e.classHierarchy.push("vtkWebGPUBufferManager");function r(n){n.dataArray&&!n.nativeArray&&(n.nativeArray=n.dataArray.getData());let a,i;if(n.usage===it.Index){a=Bp.newInstance({label:n.label}),a.setDevice(e.device),i=GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST,a.buildIndexBuffer(n),a.createAndWrite(n.nativeArray,i),a.setArrayInformation([{format:n.format}]);let s=a.getPrimitiveToCellId();s?.length&&a.setPrimitiveToCellIdBuffer(r({usage:it.Storage,nativeArray:s,label:"cellPrimitiveMap"}))}if(a||(a=zt.newInstance({label:n.label}),a.setDevice(e.device)),n.usage===it.UniformArray&&(i=GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,a.createAndWrite(n.nativeArray,i)),n.usage===it.Storage&&(i=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST,a.createAndWrite(n.nativeArray,i)),n.usage===it.Texture&&(i=GPUBufferUsage.COPY_SRC,a.createAndWrite(n.nativeArray,i)),n.usage===it.PointArray){i=GPUBufferUsage.VERTEX;let s=Ve.getNativeTypeFromBufferFormat(n.format),o=Up(n.indexBuffer,n.dataArray.getData(),n.dataArray.getNumberOfComponents(),s,{packExtra:n.packExtra,shift:n.shift,scale:n.scale,cellData:n.cellData,cellOffset:n.cellOffset});a.createAndWrite(o.nativeArray,i),a.setStrideInBytes(Ve.getByteStrideFromBufferFormat(n.format));let c="perspective";n.cellData&&(c="flat"),a.setArrayInformation([{offset:0,format:n.format,interpolation:c}])}if(n.usage===it.NormalsFromPoints){i=GPUBufferUsage.VERTEX;let s=Ve.getNativeTypeFromBufferFormat(n.format),o=Np(n.cells,n.dataArray),c=Up(n.indexBuffer,o,4,s,{cellData:!0,cellOffset:n.cellOffset});a.createAndWrite(c.nativeArray,i),a.setStrideInBytes(Ve.getByteStrideFromBufferFormat(n.format)),a.setArrayInformation([{offset:0,format:n.format,interpolation:"flat"}])}return n.usage===it.RawVertex&&(i=GPUBufferUsage.VERTEX,a.createAndWrite(n.nativeArray,i),a.setStrideInBytes(Ve.getByteStrideFromBufferFormat(n.format)),a.setArrayInformation([{offset:0,format:n.format,interpolation:n.interpolation}])),a.setSourceTime(n.time),a}t.hasBuffer=n=>e.device.hasCachedObject(n),t.getBuffer=n=>{let a=n.hash??l2(n);return a?e.device.getCachedObject(a,r,n):r(n)},t.getStorageBuffer=(n,a,i)=>e.device.getCachedObject(n,()=>r({usage:it.Storage,nativeArray:a(),label:i})),t.getStorageBufferForCellNormals=(n,a)=>t.getStorageBuffer(`cellNormals${n.getMTime()}P${a.getMTime()}`,()=>Np(n,a),"cellNormals"),t.getBufferForPointArray=(n,a)=>{let i=Fp(n),s={hash:`${n.getMTime()}I${a.getMTime()}${i}`,usage:it.PointArray,format:i,dataArray:n,indexBuffer:a};return t.getBuffer(s)},t.getBufferForCellArray=(n,a,i=0)=>{let s=Fp(n),o={hash:`cell${n.getMTime()}I${a.getMTime()}O${i}${s}`,usage:it.PointArray,format:s,dataArray:n,indexBuffer:a,cellData:!0,cellOffset:i};return t.getBuffer(o)},t.getFullScreenQuadBuffer=()=>{if(e.fullScreenQuadBuffer)return e.fullScreenQuadBuffer;e.fullScreenQuadBuffer=zt.newInstance(),e.fullScreenQuadBuffer.setDevice(e.device);let n=new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,-1,0,1,1,0,-1,1,0]);return e.fullScreenQuadBuffer.createAndWrite(n,GPUBufferUsage.VERTEX),e.fullScreenQuadBuffer.setStrideInBytes(12),e.fullScreenQuadBuffer.setArrayInformation([{offset:0,format:"float32x3"}]),e.fullScreenQuadBuffer}}var g2={device:null,fullScreenQuadBuffer:null};function Gp(t,e,r={}){Object.assign(e,g2,r),pe(t,e),de(t,e,["device"]),p2(t,e)}var h2=ue(Gp),Wt={newInstance:h2,extend:Gp,...f2,...hr};var{BufferUsage:v2}=Wt,{vtkErrorMacro:xo}=w;function d2(t,e){e.classHierarchy.push("vtkWebGPUUniformBuffer");function r(n){if(e.UBO)return;t.sortBufferEntries(),t.createView("Float32Array");let a={nativeArray:e.Float32Array,usage:v2.UniformArray,label:e.label};e.UBO=n.getBufferManager().getBuffer(a),e.bindGroupTime.modified(),e.sendDirty=!1}t.addEntry=(n,a)=>{if(e._bufferEntryNames.has(n)){xo(`entry named ${n} already exists`);return}e.sortDirty=!0,e._bufferEntryNames.set(n,e.bufferEntries.length),e.bufferEntries.push({name:n,type:a,sizeInBytes:Ve.getByteStrideFromShaderFormat(a),offset:-1,nativeType:Ve.getNativeTypeFromShaderFormat(a),packed:!1})},t.sortBufferEntries=()=>{if(!e.sortDirty)return;let n=0,a=[],i=4;for(let s=0;s<e.bufferEntries.length;s++){let o=e.bufferEntries[s];o.sizeInBytes%16===0&&(i=Math.max(16,i)),o.sizeInBytes%8===0&&(i=Math.max(8,i))}for(let s=0;s<e.bufferEntries.length;s++){let o=e.bufferEntries[s];o.packed===!1&&o.sizeInBytes%16===0&&(o.packed=!0,o.offset=n,a.push(o),n+=o.sizeInBytes)}for(let s=0;s<e.bufferEntries.length;s++){let o=e.bufferEntries[s];if(o.packed===!1&&o.sizeInBytes===12)for(let c=0;c<e.bufferEntries.length;c++){let f=e.bufferEntries[c];if(f.packed===!1&&f.sizeInBytes===4){o.packed=!0,o.offset=n,a.push(o),n+=o.sizeInBytes,f.packed=!0,f.offset=n,a.push(f),n+=f.sizeInBytes;break}}}for(let s=0;s<e.bufferEntries.length;s++){let o=e.bufferEntries[s];if(!o.packed&&o.sizeInBytes%8===0)for(let c=s+1;c<e.bufferEntries.length;c++){let f=e.bufferEntries[c];if(!f.packed&&f.sizeInBytes%8===0){o.packed=!0,o.offset=n,a.push(o),n+=o.sizeInBytes,f.packed=!0,f.offset=n,a.push(f),n+=f.sizeInBytes;break}}}for(let s=0;s<e.bufferEntries.length;s++){let o=e.bufferEntries[s];if(!o.packed&&o.sizeInBytes%8===0){let c=!1;for(let f=0;!c&&f<e.bufferEntries.length;f++){let u=e.bufferEntries[f];if(!u.packed&&u.sizeInBytes===4)for(let g=f+1;g<e.bufferEntries.length;g++){let l=e.bufferEntries[g];if(!l.packed&&l.sizeInBytes===4){o.packed=!0,o.offset=n,a.push(o),n+=o.sizeInBytes,u.packed=!0,u.offset=n,a.push(u),n+=u.sizeInBytes,l.packed=!0,l.offset=n,a.push(l),n+=l.sizeInBytes,c=!0;break}}}}}for(let s=0;s<e.bufferEntries.length;s++){let o=e.bufferEntries[s];!o.packed&&o.sizeInBytes>4&&(o.packed=!0,o.offset=n,a.push(o),n+=o.sizeInBytes)}for(let s=0;s<e.bufferEntries.length;s++){let o=e.bufferEntries[s];o.packed||(o.packed=!0,o.offset=n,a.push(o),n+=o.sizeInBytes)}e.bufferEntries=a,e._bufferEntryNames.clear();for(let s=0;s<e.bufferEntries.length;s++)e._bufferEntryNames.set(e.bufferEntries[s].name,s);e.sizeInBytes=n,e.sizeInBytes=i*Math.ceil(e.sizeInBytes/i),e.sortDirty=!1},t.sendIfNeeded=n=>{e.device=n,r(n),e.sendDirty&&(n.getHandle().queue.writeBuffer(e.UBO.getHandle(),0,e.arrayBuffer,0,e.sizeInBytes),e.sendDirty=!1),e.sendTime.modified()},t.createView=n=>{n in e||(e.arrayBuffer||(e.arrayBuffer=new ArrayBuffer(e.sizeInBytes)),e[n]=w.newTypedArray(n,e.arrayBuffer))},t.setValue=(n,a)=>{t.sortBufferEntries();let i=e._bufferEntryNames.get(n);if(i===void 0){xo(`entry named ${n} not found in UBO`);return}let s=e.bufferEntries[i];t.createView(s.nativeType);let o=e[s.nativeType];s.lastValue!==a&&(o[s.offset/o.BYTES_PER_ELEMENT]=a,e.sendDirty=!0),s.lastValue=a},t.setArray=(n,a)=>{t.sortBufferEntries();let i=e._bufferEntryNames.get(n);if(i===void 0){xo(`entry named ${n} not found in UBO`);return}let s=e.bufferEntries[i];t.createView(s.nativeType);let o=e[s.nativeType],c=!1;for(let f=0;f<a.length;f++)(!s.lastValue||s.lastValue[f]!==a[f])&&(o[s.offset/o.BYTES_PER_ELEMENT+f]=a[f],c=!0);c&&(e.sendDirty=!0,s.lastValue=[...a])},t.getBindGroupEntry=()=>(!e.UBO&&e.device&&r(e.device),{resource:{buffer:e.UBO.getHandle()}}),t.getSendTime=()=>e.sendTime.getMTime(),t.getShaderCode=(n,a)=>{t.sortBufferEntries();let i=[`struct ${e.label}Struct
{`];for(let s=0;s<e.bufferEntries.length;s++){let o=e.bufferEntries[s];i.push(`  ${o.name}: ${o.type},`)}return i.push(`};
@binding(${n}) @group(${a}) var<uniform> ${e.label}: ${e.label}Struct;`),i.join(`
`)},t.releaseGraphicsResources=()=>{e.UBO=null,e.bindGroupTime.modified(),e.sendDirty=!0}}var T2={bufferEntries:null,bufferEntryNames:null,sizeInBytes:0,label:null,bindGroupLayoutEntry:null,bindGroupEntry:null};function kp(t,e,r={}){Object.assign(e,T2,r),w.obj(t,e),e._bufferEntryNames=new Map,e.bufferEntries=[],e.bindGroupLayoutEntry=e.bindGroupLayoutEntry||{buffer:{type:"uniform"}},e.sendTime={},w.obj(e.sendTime,{mtime:0}),e.bindGroupTime={},w.obj(e.bindGroupTime,{mtime:0}),e.sendDirty=!0,e.sortDirty=!0,w.get(t,e,["binding","bindGroupTime"]),w.setGet(t,e,["bindGroupLayoutEntry","device","label","sizeInBytes"]),d2(t,e)}var m2=w.newInstance(kp,"vtkWebGPUUniformBuffer"),Ot={newInstance:m2,extend:kp};function fn(t,e){for(let r=0;r<6;r++)t.addEntry(`${e}${r}`,"vec4<f32>")}function vi({countName:t,planePrefix:e,positionName:r,returnValue:n="discard"}){let a=[];for(let i=0;i<6;i++)a.push(`  if (${t} > ${i}u && dot(${e}${i}, ${r}) < 0.0) { ${n}; }`);return a}function di(t,e,r){let n=t.getClippingPlanes().length;for(let a=0;a<n;a++)t.getClippingPlaneInCoords(e,a,r[a]);return n}function wt(t,e=null){let r=e?t.getFirstAncestorOfType(e):null,n=(r??t)?.getFirstAncestorOfType("vtkWebGPURenderer"),a=n?.getFirstAncestorOfType("vtkWebGPURenderWindow");return{parent:r,renderer:n,renderWindow:a,device:a?.getDevice()}}var xe={SINGLE:"single",DEPENDENT_LA:"dependent-la",DEPENDENT_RGB:"dependent-rgb",DEPENDENT_RGBA:"dependent-rgba",INDEPENDENT_1:"independent-1",INDEPENDENT_2:"independent-2",INDEPENDENT_3:"independent-3",INDEPENDENT_4:"independent-4"},rt={IMAGE:0,COLOR_LUT:1,OPACITY_LUT:2,LABEL_OUTLINE_THICKNESS:3,LABEL_OUTLINE_OPACITY:4};function bp(t,e){let r=t?.getSampler?.();if(!r)return!1;let n=r.getOptions();return n.minFilter===e.minFilter&&n.magFilter===e.magFilter&&n.mipmapFilter===(e.mipmapFilter??"nearest")&&n.addressModeU===(e.addressModeU??"clamp-to-edge")&&n.addressModeV===(e.addressModeV??"clamp-to-edge")&&n.addressModeW===(e.addressModeW??"clamp-to-edge")}function Ti(t,e){if(t)switch(e){case 1:return xe.INDEPENDENT_1;case 2:return xe.INDEPENDENT_2;case 3:return xe.INDEPENDENT_3;default:return xe.INDEPENDENT_4}switch(e){case 1:return xe.SINGLE;case 2:return xe.DEPENDENT_LA;case 3:return xe.DEPENDENT_RGB;default:return xe.DEPENDENT_RGBA}}function _t(t,e="tfunRows"){return`${2*t+.5} / ${e}`}function zp(t,e,r){return t.getUseLabelOutline()&&!e&&r===1}function un(t,e,r,n={}){let a=[n.label??"tfun",n.rowLength??0,r];for(let i=0;i<r;i++){let s=e.call(t,i);s?a.push(`${s.getMTime()}:${s.getRange().join(",")}`):a.push("none")}return a.join("-")}var{vtkErrorMacro:y2}=we,{VtkDataTypes:S2}=Z,{SlicingMode:Wp}=Wa,x2=`
//VTK::Renderer::Dec

//VTK::Mapper::Dec

//VTK::TCoord::Dec

//VTK::Image::Dec

//VTK::Clip::Dec

//VTK::RenderEncoder::Dec

//VTK::IOStructs::Dec

@fragment
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output: fragmentOutput;

  //VTK::Clip::Impl

  //VTK::Select::Impl

  //VTK::Image::Sample

  // var computedColor: vec4<f32> = vec4<f32>(1.0,0.7, 0.5, 1.0);

  //VTK::Position::Impl

//VTK::RenderEncoder::Impl

  return output;
}
`,ht=new Float64Array(16),Rt=new Float64Array(16),mi=new Float64Array(16),yi=new Float64Array(3),Si=new Float64Array(3),rr=new Float64Array(4),be=new Float64Array(4);function C2(t,e){e.classHierarchy.push("vtkWebGPUImageMapper"),t.ensureTextureSampler=(a,i)=>{a&&!bp(a,i)&&a.addSampler(e.device,i)},t.computeImageState=()=>{let a=e.WebGPUImageSlice.getRenderable().getProperty(),i=t.getTextureViews()[rt.IMAGE]?.getTexture().getNumberOfComponents()??1,s=a.getIndependentComponents();return{actorProperty:a,numberOfComponents:i,independentComponents:s,numberOfIComponents:s?i:1,useLabelOutline:zp(a,s,i),textureChannelMode:Ti(s,i)}},t.getImageState=()=>e.imageState??t.computeImageState(),t.useImageMipmaps=()=>{let a=e.currentInput?.getPointData?.()?.getScalars?.();if(!a)return!1;let i=e.WebGPUImageSlice.getRenderable().getProperty();return e.currentInput.getDimensions()[2]===1&&a.getNumberOfComponents()===4&&a.getDataType()===S2.UNSIGNED_CHAR&&!i.getIndependentComponents()&&i.getInterpolationType()!==Qe.NEAREST},t.buildPass=a=>{if(a){let{parent:i,renderer:s,renderWindow:o,device:c}=wt(t,"vtkWebGPUImageSlice");e.WebGPUImageSlice=i,e.WebGPURenderer=s,e.WebGPURenderWindow=o,e.device=c;let f=e.WebGPURenderer.getRenderable();e.renderable.isA("vtkImageMapper")&&e.renderable.getSliceAtFocalPoint()&&e.renderable.setSliceFromCamera(f.getActiveCamera())}},t.translucentPass=a=>{a&&t.render()},t.zBufferPass=a=>{a&&t.render()},t.opaqueZBufferPass=a=>t.zBufferPass(a),t.opaquePass=a=>{a&&t.render()},t.render=()=>{if(e.renderable.update(),e.currentInput=e.renderable.getCurrentImage(),!e.currentInput){y2("No input!");return}t.prepareToDraw(e.WebGPURenderer.getRenderEncoder()),e.renderEncoder.registerDrawCallback(e.pipeline,t.draw)},t.getCoincidentParameters=()=>e.renderable.getResolveCoincidentTopology()==$e.PolygonOffset?e.renderable.getCoincidentTopologyPolygonOffsetParameters():{factor:0,offset:0},t.computePipelineHash=()=>{let a=e.currentInput.getExtent(),i=t.getImageState();a[0]===a[1]||a[2]===a[3]||a[4]===a[5]?(e.dimensions=2,e.pipelineHash="img2"):(e.dimensions=3,e.pipelineHash="img3"),e.pipelineHash+=i.textureChannelMode,i.useLabelOutline&&(e.pipelineHash+="outline"),t.useImageMipmaps()&&(e.pipelineHash+="mip"),e.pipelineHash+=e.renderEncoder.getPipelineHash()},t.updateUBO=()=>{let a=e.UBO.getSendTime(),i=e.WebGPUImageSlice.getRenderable(),s=i.getMapper(),o=e.WebGPUImageSlice.getPropID(),c=e.WebGPURenderer.getSelector(),f=o;c?.getPropIDForSelection&&(f=c.getPropIDForSelection(o,i)+1),e.UBO.setValue("PropID",f);let u=e.renderable.getClippingPlanesMTime();if(t.getMTime()>a||e.renderable.getMTime()>a||i.getProperty().getMTime()>a||u>a){let g=s.getCurrentImage(),l=e.WebGPURenderer.getStabilizedCenterByReference();L.identity(ht),L.translate(ht,ht,l);let h=i.getMatrix();L.transpose(Rt,h),L.invert(Rt,Rt),L.multiply(ht,Rt,ht);let y=g.getWorldToIndex();L.multiply(ht,y,ht),L.invert(mi,ht),yi[0]=.5,yi[1]=.5,yi[2]=.5,L.fromTranslation(Rt,yi),L.multiply(ht,Rt,ht);let p=g.getDimensions();L.identity(Rt),Si[0]=1/p[0],Si[1]=1/p[1],Si[2]=1/p[2],L.scale(Rt,Rt,Si),L.multiply(ht,Rt,ht),e.UBO.setArray("SCTCMatrix",ht);let m=e.currentInput.getExtent(),{ijkMode:d}=e.renderable.getClosestIJKAxis(),x;e.renderable.isA("vtkImageArrayMapper")?x=e.renderable.getSubSlice()??0:(x=e.renderable.getSlice(),d!==e.renderable.getSlicingMode()&&(x=e.renderable.getSliceAtPosition(x)));let T=2,v=0,C=1;d===Wp.I?(T=0,v=1,C=2):d===Wp.J&&(T=1,v=2,C=0),rr[T]=x,rr[v]=m[v*2]-.5,rr[C]=m[C*2]-.5,rr[3]=1,He.transformMat4(rr,rr,mi),e.UBO.setArray("Origin",rr),be[T]=x,be[v]=m[v*2+1]+.5,be[C]=m[C*2]-.5,be[3]=1,He.transformMat4(be,be,mi),He.subtract(be,be,rr),be[3]=1,e.UBO.setArray("Axis1",be),be[T]=x,be[v]=m[v*2]-.5,be[C]=m[C*2+1]+.5,be[3]=1,He.transformMat4(be,be,mi),He.subtract(be,be,rr),be[3]=1,e.UBO.setArray("Axis2",be);let{cScale:O,cShift:M,oScale:S,oShift:E,componentWeight:R}=e;O[0]=1,O[1]=1,O[2]=1,O[3]=1,M[0]=0,M[1]=0,M[2]=0,M[3]=0,S[0]=1,S[1]=1,S[2]=1,S[3]=1,E[0]=0,E[1]=0,E[2]=0,E[3]=0,R[0]=1,R[1]=1,R[2]=1,R[3]=1;let D=e.textureViews[0].getTexture().getScale(),{numberOfComponents:V,independentComponents:U}=t.getImageState(),B=i.getProperty();for(let k=0;k<V;k++){let F=B.getColorWindow(),G=B.getColorLevel(),b=U?k:0,z=B.getRGBTransferFunction(b);if(z&&B.getUseLookupTableScalarRange()){let $=z.getRange();F=$[1]-$[0],G=.5*($[1]+$[0])}O[k]=D/F,M[k]=-G/F+.5;let I=1,P=0,Q=B.getPiecewiseFunction(b);if(Q){let $=Q.getRange(),J=$[1]-$[0],Y=.5*($[0]+$[1]);I=D/J,P=-Y/J+.5}S[k]=I,E[k]=P,R[k]=B.getComponentWeight(k)}e.UBO.setArray("cScale",O),e.UBO.setArray("cShift",M),e.UBO.setArray("oScale",S),e.UBO.setArray("oShift",E),e.UBO.setArray("componentWeight",R),e.UBO.setValue("Opacity",B.getOpacity());let _=t.getCoincidentParameters();e.UBO.setValue("CoincidentFactor",_.factor),e.UBO.setValue("CoincidentOffset",_.offset),e.UBO.setValue("NumClipPlanes",0);let N=e.renderable.getClippingPlanes().length;if(e.UBO.setValue("NumClipPlanes",N),N>0){L.fromTranslation(Rt,[-l[0],-l[1],-l[2]]),di(e.renderable,Rt,e.clipPlanes);for(let k=0;k<N;k++)e.UBO.setArray(`ClipPlane${k}`,e.clipPlanes[k])}}e.UBO.sendIfNeeded(e.device)},t.updateLUTImage=()=>{let a=t.getImageState(),{actorProperty:i}=a,s=a.numberOfIComponents,o=un(i,i.getRGBTransferFunction,s,{label:"imageColorLUT",rowLength:e.rowLength});if(e.colorTextureString!==o){e.numRows=s;let c=e.numRows*2*e.rowLength*4;(!e.colorLUTArray||e.colorLUTArray.length!==c)&&(e.colorLUTArray=new Uint8ClampedArray(c));let f=e.colorLUTArray,u=i.getRGBTransferFunction();if(u){let g=e.colorTmpTable;for(let l=0;l<s;l++){u=i.getRGBTransferFunction(l);let h=u.getRange();u.getTable(h[0],h[1],e.rowLength,g,1);for(let y=0;y<e.rowLength;y++){let p=l*e.rowLength*8+y*4;f[p]=255*g[y*3],f[p+1]=255*g[y*3+1],f[p+2]=255*g[y*3+2],f[p+3]=255;for(let m=0;m<4;m++)f[p+e.rowLength*4+m]=f[p+m]}}}else for(let g=0;g<s;g++){let l=g*e.rowLength*8;for(let h=0;h<e.rowLength;++h){let y=255*h/(e.rowLength-1),p=l+h*4;f[p]=y,f[p+1]=y,f[p+2]=y,f[p+3]=255;for(let m=0;m<4;m++)f[p+e.rowLength*4+m]=f[p+m]}}{let g={hash:o,nativeArray:f,width:e.rowLength,height:e.numRows*2,depth:1,format:"rgba8unorm"},l=e.device.getTextureManager().getTexture(g).createView("tfunTexture");t.ensureTextureSampler(l,{minFilter:"linear",magFilter:"linear"}),e.textureViews[rt.COLOR_LUT]=l}e.colorTextureString=o}},t.updateOpacityLUTImage=()=>{let a=t.getImageState(),{actorProperty:i}=a,s=a.numberOfIComponents;e.numRows=s;let o=un(i,i.getPiecewiseFunction,s,{label:"imageOpacityLUT",rowLength:e.rowLength});if(e.opacityTextureString!==o){let c=e.numRows*2*e.rowLength;(!e.opacityLUTArray||e.opacityLUTArray.length!==c)&&(e.opacityLUTArray=new Float32Array(c));let f=e.opacityLUTArray,u=e.opacityTmpTable;for(let h=0;h<s;h++){let y=i.getPiecewiseFunction(h);if(!y){let d=h*e.rowLength*2;f.fill(1,d,d+e.rowLength*2);continue}let p=y.getRange();y.getTable(p[0],p[1],e.rowLength,u,1);let m=h*e.rowLength*2;for(let d=0;d<e.rowLength;d++)f[m+d]=u[d],f[m+e.rowLength+d]=u[d]}let g={hash:o,nativeArray:f,width:e.rowLength,height:e.numRows*2,depth:1,format:"r16float"},l=e.device.getTextureManager().getTexture(g).createView("ofunTexture");t.ensureTextureSampler(l,{minFilter:"linear",magFilter:"linear"}),e.textureViews[rt.OPACITY_LUT]=l,e.opacityTextureString=o}},t.updateLabelOutlineThicknessTexture=()=>{let a=e.WebGPUImageSlice.getRenderable().getProperty().getLabelOutlineThicknessByReference(),i=Math.max(1,e.renderable.getLabelOutlineTextureWidth()),s=`${a.join("-")}-${i}`;if(e.labelOutlineThicknessString!==s){let o=new Uint8Array(i);for(let u=0;u<i;++u){let g=typeof a[u]<"u"?a[u]:a[0];o[u]=g}let c={hash:`imageOutlineThickness-${s}`,nativeArray:o,width:i,height:1,depth:1,format:"r8unorm"},f=e.device.getTextureManager().getTexture(c).createView("labelOutlineTexture");t.ensureTextureSampler(f,{minFilter:"nearest",magFilter:"nearest"}),e.textureViews[rt.LABEL_OUTLINE_THICKNESS]=f,e.labelOutlineThicknessString=s}},t.updateLabelOutlineOpacityTexture=()=>{let a=e.WebGPUImageSlice.getRenderable().getProperty().getLabelOutlineOpacity(),i=Array.isArray(a)?a:[a],s=Math.max(1,e.renderable.getLabelOutlineTextureWidth()),o=`${i.join("-")}-${s}`;if(e.labelOutlineOpacityString!==o){let c=new Float32Array(s);for(let g=0;g<s;++g)c[g]=i[g]??i[0];let f={hash:`imageOutlineOpacity-${o}`,nativeArray:c,width:s,height:1,depth:1,format:"r16float"},u=e.device.getTextureManager().getTexture(f).createView("labelOutlineOpacityTexture");t.ensureTextureSampler(u,{minFilter:"nearest",magFilter:"nearest"}),e.textureViews[rt.LABEL_OUTLINE_OPACITY]=u,e.labelOutlineOpacityString=o}};let r=t.updateBuffers;t.updateBuffers=()=>{r();let a=e.textureViews,i=e.WebGPUImageSlice.getRenderable().getProperty(),s=i?.getUpdatedExtents?.()??[],o=a[rt.IMAGE]?.getTexture(),c=!!e.renderable.getPreferSizeOverAccuracy?.(),f=e.device.getTextureManager().getTextureForImageData(e.currentInput,{updatedExtents:s,existingTexture:o,preferSizeOverAccuracy:c,generateMipmaps:t.useImageMipmaps(),owner:e.imageTextureOwner});if(s.length&&i.setUpdatedExtents([]),!a[rt.IMAGE]||a[rt.IMAGE].getTexture()!==f){let g=f.createView("imgTexture");t.ensureTextureSampler(g,{minFilter:"linear",magFilter:"linear"}),a[rt.IMAGE]=g}e.imageState=t.computeImageState(),t.updateLUTImage(),t.updateOpacityLUTImage(),e.imageState.useLabelOutline?(t.updateLabelOutlineThicknessTexture(),t.updateLabelOutlineOpacityTexture()):e.textureViews.length=Math.min(e.textureViews.length,rt.OPACITY_LUT+1),t.updateUBO();let u=e.WebGPUImageSlice.getRenderable().getProperty().getInterpolationType()===Qe.NEAREST?"nearest":"linear";t.ensureTextureSampler(a[rt.IMAGE],{minFilter:u,magFilter:u,mipmapFilter:t.useImageMipmaps()?"linear":"nearest"})};let n=t.getShaderReplacements();t.replaceShaderPosition=(a,i,s)=>{let o=i.getShaderDescription("vertex");o.addBuiltinOutput("vec4<f32>","@builtin(position) Position"),o.addOutput("vec4<f32>","vertexSC");let c=o.getCode(),f=["var pos: vec4<f32> = mapperUBO.Origin +","   (vertexBC.x * 0.5 + 0.5) * mapperUBO.Axis1 + (vertexBC.y * 0.5 + 0.5) * mapperUBO.Axis2;","pos.w = 1.0;"];e.dimensions===2?f.push("var tcoord : vec2<f32> = (mapperUBO.SCTCMatrix * pos).xy;"):f.push("var tcoord : vec3<f32> = (mapperUBO.SCTCMatrix * pos).xyz;"),f.push("output.vertexSC = pos;","pos = rendererUBO.SCPCMatrix * pos;","pos.z = clamp(pos.z - 0.000016 * mapperUBO.CoincidentOffset * pos.w, 0.0, pos.w);","output.tcoordVS = tcoord;","output.Position = pos;"),c=K.substitute(c,"//VTK::Position::Impl",f).result,o.setCode(c)},n.set("replaceShaderPosition",t.replaceShaderPosition),t.replaceShaderTCoord=(a,i,s)=>{let o=i.getShaderDescription("vertex"),c=e.dimensions===2?"vec2<f32>":"vec3<f32>";o.addOutput(c,"tcoordVS")},n.set("replaceShaderTCoord",t.replaceShaderTCoord),t.replaceShaderImage=(a,i,s)=>{let o=i.getShaderDescription("fragment"),c=o.getCode(),f=t.getImageState(),u=t.useImageMipmaps()?"textureSample(imgTexture, imgTextureSampler, input.tcoordVS)":"textureSampleLevel(imgTexture, imgTextureSampler, input.tcoordVS, 0.0)";switch(c=K.substitute(c,"//VTK::Image::Sample",["    var computedColor: vec4<f32> =",`      ${u};`,"//VTK::Image::Sample"]).result,f.textureChannelMode){case xe.SINGLE:if(f.useLabelOutline){let g=e.dimensions===3?"vec3<f32>":"vec2<f32>",l=[`    let centerCoord: ${g} = input.tcoordVS;`,`    let stepX: ${g} = dpdx(input.tcoordVS);`,`    let stepY: ${g} = dpdy(input.tcoordVS);`,`    let clampMin: ${g} = ${g}(0.0);`,`    let clampMax: ${g} = ${g}(1.0);`];c=K.substitute(c,"//VTK::Image::Sample",[...l,"    let centerValue: f32 = textureSampleLevel(","      imgTexture,","      imgTextureSampler,","      centerCoord,","      0.0).r;","    let segmentIndex: i32 = i32(round(centerValue * 255.0));","    if (segmentIndex == 0) {","      computedColor = vec4<f32>(0.0);","    } else {","      let colorCoord: vec2<f32> = vec2<f32>(","        centerValue * mapperUBO.cScale.r + mapperUBO.cShift.r,","        0.5);","      let tColor: vec4<f32> =","        textureSampleLevel(tfunTexture, tfunTextureSampler, colorCoord, 0.0);","      let opacityCoord: vec2<f32> = vec2<f32>(","        centerValue * mapperUBO.oScale.r + mapperUBO.oShift.r,","        0.5);","      let scalarOpacity: f32 =","        textureSampleLevel(ofunTexture, ofunTextureSampler, opacityCoord, 0.0).r;","      let outlineWidth: i32 = i32(textureDimensions(labelOutlineTexture).x);","      let outlineIndex: i32 = clamp(segmentIndex - 1, 0, outlineWidth - 1);","      let outlineCoord: vec2<f32> = vec2<f32>(","        (f32(outlineIndex) + 0.5) / f32(outlineWidth),","        0.5);","      let thicknessValue: f32 = textureSampleLevel(","        labelOutlineTexture,","        labelOutlineTextureSampler,","        outlineCoord,","        0.0).r;","      let outlineOpacity: f32 = textureSampleLevel(","        labelOutlineOpacityTexture,","        labelOutlineOpacityTextureSampler,","        outlineCoord,","        0.0).r;","      let actualThickness: i32 = i32(round(thicknessValue * 255.0));","      var pixelOnBorder: bool = false;","      if (actualThickness > 0) {","        for (var i: i32 = -actualThickness; i <= actualThickness; i++) {","          for (var j: i32 = -actualThickness; j <= actualThickness; j++) {","            if (i == 0 && j == 0) {","              continue;","            }","            let neighborCoord = clamp(","              centerCoord + f32(i) * stepX + f32(j) * stepY,","              clampMin,","              clampMax);","            let neighborValue: f32 = textureSampleLevel(","              imgTexture,","              imgTextureSampler,","              neighborCoord,","              0.0).r;","            if (neighborValue != centerValue) {","              pixelOnBorder = true;","              break;","            }","          }","          if (pixelOnBorder) {","            break;","          }","        }","      }","      if (pixelOnBorder) {","        computedColor = vec4<f32>(tColor.rgb, outlineOpacity);","      } else {","        computedColor = vec4<f32>(","          tColor.rgb,","          scalarOpacity * mapperUBO.Opacity);","      }","    }"]).result}else c=K.substitute(c,"//VTK::Image::Sample",["    let scalar: f32 = computedColor.r;","    var colorCoord: vec2<f32> =","      vec2<f32>(scalar * mapperUBO.cScale.r + mapperUBO.cShift.r, 0.5);","    let tColor: vec4<f32> =","      textureSampleLevel(tfunTexture, tfunTextureSampler, colorCoord, 0.0);","    var opacityCoord: vec2<f32> =","      vec2<f32>(scalar * mapperUBO.oScale.r + mapperUBO.oShift.r, 0.5);","    let scalarOpacity: f32 =","      textureSampleLevel(ofunTexture, ofunTextureSampler, opacityCoord, 0.0).r;","    computedColor = vec4<f32>(tColor.rgb, scalarOpacity * mapperUBO.Opacity);"]).result;break;case xe.INDEPENDENT_1:c=K.substitute(c,"//VTK::Image::Sample",["    let tfunRows: f32 = f32(textureDimensions(tfunTexture).y);","    let scalar: f32 = computedColor.r;",`    let rowCoord: f32 = ${_t(0)};`,"    let colorCoord: vec2<f32> =","      vec2<f32>(scalar * mapperUBO.cScale.r + mapperUBO.cShift.r, rowCoord);","    let tColor: vec4<f32> =","      textureSampleLevel(tfunTexture, tfunTextureSampler, colorCoord, 0.0);","    computedColor = vec4<f32>(","      tColor.rgb * mapperUBO.componentWeight.r,","      mapperUBO.Opacity);"]).result;break;case xe.INDEPENDENT_2:c=K.substitute(c,"//VTK::Image::Sample",["    let tfunRows: f32 = f32(textureDimensions(tfunTexture).y);","    // Independent component LUT rows are duplicated, so sample the","    // center of row 2 * componentIndex for each component.","    let rawColor: vec4<f32> = computedColor;",`    let rowCoord0: f32 = ${_t(0)};`,`    let rowCoord1: f32 = ${_t(1)};`,"    let scalar0: f32 = rawColor.r;","    let scalar1: f32 = rawColor.g;","    let color0: vec3<f32> = mapperUBO.componentWeight.r *","      textureSampleLevel(","        tfunTexture,","        tfunTextureSampler,","        vec2<f32>(scalar0 * mapperUBO.cScale.r + mapperUBO.cShift.r, rowCoord0),","        0.0).rgb;","    let color1: vec3<f32> = mapperUBO.componentWeight.g *","      textureSampleLevel(","        tfunTexture,","        tfunTextureSampler,","        vec2<f32>(scalar1 * mapperUBO.cScale.g + mapperUBO.cShift.g, rowCoord1),","        0.0).rgb;","    let weight0: f32 = mapperUBO.componentWeight.r *","      textureSampleLevel(","        ofunTexture,","        ofunTextureSampler,","        vec2<f32>(scalar0 * mapperUBO.oScale.r + mapperUBO.oShift.r, rowCoord0),","        0.0).r;","    let weight1: f32 = mapperUBO.componentWeight.g *","      textureSampleLevel(","        ofunTexture,","        ofunTextureSampler,","        vec2<f32>(scalar1 * mapperUBO.oScale.g + mapperUBO.oShift.g, rowCoord1),","        0.0).r;","    let weightSum: f32 = max(weight0 + weight1, 1.0e-6);","    computedColor = vec4<f32>(","      color0 * (weight0 / weightSum) + color1 * (weight1 / weightSum),","      mapperUBO.Opacity);"]).result;break;case xe.INDEPENDENT_3:c=K.substitute(c,"//VTK::Image::Sample",["    let tfunRows: f32 = f32(textureDimensions(tfunTexture).y);","    let rawColor: vec4<f32> = computedColor;",`    let rowCoord0: f32 = ${_t(0)};`,`    let rowCoord1: f32 = ${_t(1)};`,`    let rowCoord2: f32 = ${_t(2)};`,"    let scalar0: f32 = rawColor.r;","    let scalar1: f32 = rawColor.g;","    let scalar2: f32 = rawColor.b;","    let color0: vec3<f32> = mapperUBO.componentWeight.r *","      textureSampleLevel(","        tfunTexture,","        tfunTextureSampler,","        vec2<f32>(scalar0 * mapperUBO.cScale.r + mapperUBO.cShift.r, rowCoord0),","        0.0).rgb;","    let color1: vec3<f32> = mapperUBO.componentWeight.g *","      textureSampleLevel(","        tfunTexture,","        tfunTextureSampler,","        vec2<f32>(scalar1 * mapperUBO.cScale.g + mapperUBO.cShift.g, rowCoord1),","        0.0).rgb;","    let color2: vec3<f32> = mapperUBO.componentWeight.b *","      textureSampleLevel(","        tfunTexture,","        tfunTextureSampler,","        vec2<f32>(scalar2 * mapperUBO.cScale.b + mapperUBO.cShift.b, rowCoord2),","        0.0).rgb;","    let weight0: f32 = mapperUBO.componentWeight.r *","      textureSampleLevel(","        ofunTexture,","        ofunTextureSampler,","        vec2<f32>(scalar0 * mapperUBO.oScale.r + mapperUBO.oShift.r, rowCoord0),","        0.0).r;","    let weight1: f32 = mapperUBO.componentWeight.g *","      textureSampleLevel(","        ofunTexture,","        ofunTextureSampler,","        vec2<f32>(scalar1 * mapperUBO.oScale.g + mapperUBO.oShift.g, rowCoord1),","        0.0).r;","    let weight2: f32 = mapperUBO.componentWeight.b *","      textureSampleLevel(","        ofunTexture,","        ofunTextureSampler,","        vec2<f32>(scalar2 * mapperUBO.oScale.b + mapperUBO.oShift.b, rowCoord2),","        0.0).r;","    let weightSum: f32 = max(weight0 + weight1 + weight2, 1.0e-6);","    computedColor = vec4<f32>(","      color0 * (weight0 / weightSum) + color1 * (weight1 / weightSum) + color2 * (weight2 / weightSum),","      mapperUBO.Opacity);"]).result;break;case xe.INDEPENDENT_4:c=K.substitute(c,"//VTK::Image::Sample",["    let tfunRows: f32 = f32(textureDimensions(tfunTexture).y);","    let rawColor: vec4<f32> = computedColor;",`    let rowCoord0: f32 = ${_t(0)};`,`    let rowCoord1: f32 = ${_t(1)};`,`    let rowCoord2: f32 = ${_t(2)};`,`    let rowCoord3: f32 = ${_t(3)};`,"    let scalar0: f32 = rawColor.r;","    let scalar1: f32 = rawColor.g;","    let scalar2: f32 = rawColor.b;","    let scalar3: f32 = rawColor.a;","    let color0: vec3<f32> = mapperUBO.componentWeight.r *","      textureSampleLevel(","        tfunTexture,","        tfunTextureSampler,","        vec2<f32>(scalar0 * mapperUBO.cScale.r + mapperUBO.cShift.r, rowCoord0),","        0.0).rgb;","    let color1: vec3<f32> = mapperUBO.componentWeight.g *","      textureSampleLevel(","        tfunTexture,","        tfunTextureSampler,","        vec2<f32>(scalar1 * mapperUBO.cScale.g + mapperUBO.cShift.g, rowCoord1),","        0.0).rgb;","    let color2: vec3<f32> = mapperUBO.componentWeight.b *","      textureSampleLevel(","        tfunTexture,","        tfunTextureSampler,","        vec2<f32>(scalar2 * mapperUBO.cScale.b + mapperUBO.cShift.b, rowCoord2),","        0.0).rgb;","    let color3: vec3<f32> = mapperUBO.componentWeight.a *","      textureSampleLevel(","        tfunTexture,","        tfunTextureSampler,","        vec2<f32>(scalar3 * mapperUBO.cScale.a + mapperUBO.cShift.a, rowCoord3),","        0.0).rgb;","    let weight0: f32 = mapperUBO.componentWeight.r *","      textureSampleLevel(","        ofunTexture,","        ofunTextureSampler,","        vec2<f32>(scalar0 * mapperUBO.oScale.r + mapperUBO.oShift.r, rowCoord0),","        0.0).r;","    let weight1: f32 = mapperUBO.componentWeight.g *","      textureSampleLevel(","        ofunTexture,","        ofunTextureSampler,","        vec2<f32>(scalar1 * mapperUBO.oScale.g + mapperUBO.oShift.g, rowCoord1),","        0.0).r;","    let weight2: f32 = mapperUBO.componentWeight.b *","      textureSampleLevel(","        ofunTexture,","        ofunTextureSampler,","        vec2<f32>(scalar2 * mapperUBO.oScale.b + mapperUBO.oShift.b, rowCoord2),","        0.0).r;","    let weight3: f32 = mapperUBO.componentWeight.a *","      textureSampleLevel(","        ofunTexture,","        ofunTextureSampler,","        vec2<f32>(scalar3 * mapperUBO.oScale.a + mapperUBO.oShift.a, rowCoord3),","        0.0).r;","    let weightSum: f32 = max(weight0 + weight1 + weight2 + weight3, 1.0e-6);","    computedColor = vec4<f32>(","      color0 * (weight0 / weightSum) + color1 * (weight1 / weightSum) + color2 * (weight2 / weightSum) + color3 * (weight3 / weightSum),","      mapperUBO.Opacity);"]).result;break;case xe.DEPENDENT_LA:c=K.substitute(c,"//VTK::Image::Sample",["    let rawColor: vec4<f32> = computedColor;","    let intensity: f32 = rawColor.r * mapperUBO.cScale.r + mapperUBO.cShift.r;","    let tColor: vec4<f32> =","      textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(intensity, 0.5), 0.0);","    computedColor = vec4<f32>(","      tColor.rgb,","      rawColor.g * mapperUBO.oScale.r + mapperUBO.oShift.r);"]).result;break;case xe.DEPENDENT_RGB:c=K.substitute(c,"//VTK::Image::Sample",["    let rawColor: vec4<f32> =","      computedColor * vec4<f32>(mapperUBO.cScale.x) + vec4<f32>(mapperUBO.cShift.x);","    computedColor = vec4<f32>(","      textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.r, 0.5), 0.0).r,","      textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.g, 0.5), 0.0).r,","      textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.b, 0.5), 0.0).r,","      mapperUBO.Opacity);"]).result;break;case xe.DEPENDENT_RGBA:c=K.substitute(c,"//VTK::Image::Sample",["    let rawColor: vec4<f32> =","      computedColor * vec4<f32>(mapperUBO.cScale.x) + vec4<f32>(mapperUBO.cShift.x);","    computedColor = vec4<f32>(","      textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.r, 0.5), 0.0).r,","      textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.g, 0.5), 0.0).r,","      textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.b, 0.5), 0.0).r,","      rawColor.a);"]).result;break;default:c=K.substitute(c,"//VTK::Image::Sample",["    let scalar: f32 = computedColor.r;","    var colorCoord: vec2<f32> =","      vec2<f32>(scalar * mapperUBO.cScale.r + mapperUBO.cShift.r, 0.5);","    computedColor = textureSampleLevel(tfunTexture, tfunTextureSampler, colorCoord, 0.0);"]).result}o.setCode(c)},n.set("replaceShaderImage",t.replaceShaderImage),t.replaceShaderClip=(a,i,s)=>{let o=i.getShaderDescription("fragment"),c=o.getCode(),f=vi({countName:"mapperUBO.NumClipPlanes",planePrefix:"mapperUBO.ClipPlane",positionName:"input.vertexSC"});c=K.substitute(c,"//VTK::Clip::Impl",[...f,"//VTK::Clip::Impl"]).result,o.setCode(c)},n.set("replaceShaderClip",t.replaceShaderClip),t.replaceShaderCoincidentOffset=(a,i,s)=>{let o=i.getShaderDescription("fragment");if(!o)return;o.addBuiltinInput("vec4<f32>","@builtin(position) fragPos"),o.addBuiltinOutput("f32","@builtin(frag_depth) fragDepth");let c=o.getCode();c=K.substitute(c,"//VTK::Position::Impl",["  var coincidentDepth: f32 = input.fragPos.z;","  if (mapperUBO.CoincidentFactor != 0.0) {","    let cscale = length(vec2<f32>(dpdx(input.fragPos.z), dpdy(input.fragPos.z)));","    coincidentDepth = coincidentDepth - mapperUBO.CoincidentFactor * cscale;","  }","  output.fragDepth = clamp(coincidentDepth, 0.0, 1.0);"]).result,o.setCode(c)},n.set("replaceShaderCoincidentOffset",t.replaceShaderCoincidentOffset),t.replaceShaderSelect=(a,i,s)=>{let o=i.getShaderDescription("fragment");if(!o)return;let c=o.getCode();c=K.substitute(c,"//VTK::Select::Impl",["  var compositeID: u32 = 0u;","  var attributeID: u32 = 0u;"]).result,o.setCode(c)},n.set("replaceShaderSelect",t.replaceShaderSelect)}var O2={imageState:null,rowLength:1024};function Ip(t,e,r={}){Object.assign(e,O2,r),xt.extend(t,e,r),t.setFragmentShaderTemplate(x2),e.UBO=Ot.newInstance({label:"mapperUBO"}),e.UBO.addEntry("SCTCMatrix","mat4x4<f32>"),e.UBO.addEntry("Origin","vec4<f32>"),e.UBO.addEntry("Axis2","vec4<f32>"),e.UBO.addEntry("Axis1","vec4<f32>"),e.UBO.addEntry("cScale","vec4<f32>"),e.UBO.addEntry("cShift","vec4<f32>"),e.UBO.addEntry("oScale","vec4<f32>"),e.UBO.addEntry("oShift","vec4<f32>"),e.UBO.addEntry("componentWeight","vec4<f32>"),e.UBO.addEntry("Opacity","f32"),e.UBO.addEntry("CoincidentFactor","f32"),e.UBO.addEntry("CoincidentOffset","f32"),e.UBO.addEntry("PropID","u32"),fn(e.UBO,"ClipPlane"),e.UBO.addEntry("NumClipPlanes","u32"),e.lutBuildTime={},pe(e.lutBuildTime,{mtime:0}),e.imageTextureOwner={};let n=t.releaseGraphicsResources;t.releaseGraphicsResources=()=>{e.device?.getTextureManager().releaseTexture(e.imageTextureOwner),n()},t.delete=at(()=>{e.device?.getTextureManager().releaseTexture(e.imageTextureOwner)},t.delete),e.imagemat=L.identity(new Float64Array(16)),e.imagematinv=L.identity(new Float64Array(16)),e.cScale=new Float32Array(4),e.cShift=new Float32Array(4),e.oScale=new Float32Array(4),e.oShift=new Float32Array(4),e.componentWeight=new Float32Array(4),e.colorTmpTable=new Float32Array(e.rowLength*3),e.opacityTmpTable=new Float32Array(e.rowLength),e.colorLUTArray=null,e.opacityLUTArray=null,e.clipPlanes=Array.from({length:6},()=>[0,0,0,0]),e.VBOBuildTime={},pe(e.VBOBuildTime),C2(t,e)}var Hp=ue(Ip,"vtkWebGPUImageMapper"),jp={newInstance:Hp,extend:Ip};Ke("vtkAbstractImageMapper",Hp);function w2(t,e){e.classHierarchy.push("vtkWebGPUImageSlice"),t.buildPass=r=>{if(!(!e.renderable||!e.renderable.getVisibility())&&r){if(!e.renderable)return;let{renderer:n,renderWindow:a}=wt(t);e.WebGPURenderer=n,e.WebGPURenderWindow=a,e.propID===void 0&&(e.propID=e.WebGPURenderWindow.getUniquePropID()),t.prepareNodes(),t.addMissingNode(e.renderable.getMapper()),t.removeUnusedNodes()}},t.traverseZBufferPass=r=>{!e.renderable||!e.renderable.getNestedVisibility()||e.WebGPURenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(r,!0),e.children.forEach(n=>{n.traverse(r)}),t.apply(r,!1))},t.traverseOpaqueZBufferPass=r=>t.traverseOpaquePass(r),t.traverseOpaquePass=r=>{!e.renderable||!e.renderable.getNestedVisibility()||!e.renderable.getIsOpaque()||e.WebGPURenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(r,!0),e.children.forEach(n=>{n.traverse(r)}),t.apply(r,!1))},t.traverseTranslucentPass=r=>{!e.renderable||!e.renderable.getNestedVisibility()||e.renderable.getIsOpaque()||e.WebGPURenderer.getSelector()&&!e.renderable.getNestedPickable()||(t.apply(r,!0),e.children.forEach(n=>{n.traverse(r)}),t.apply(r,!1))},t.queryPass=(r,n)=>{if(r){if(!e.renderable||!e.renderable.getVisibility())return;e.renderable.getIsOpaque()?n.incrementOpaqueActorCount():n.incrementTranslucentActorCount()}},t.getBufferShift=r=>(t.getKeyMatrices(r),e.bufferShift),t.getKeyMatrices=r=>{if(Math.max(e.renderable.getMTime(),r.getStabilizedTime())>e.keyMatricesTime.getMTime()){e.renderable.computeMatrix();let n=e.renderable.getMatrix(),a=r.getStabilizedCenterByReference();e.bufferShift[0]=n[3]-a[0],e.bufferShift[1]=n[7]-a[1],e.bufferShift[2]=n[11]-a[2],L.transpose(e.keyMatrices.bcwc,n),e.renderable.getIsIdentity()?L.identity(e.keyMatrices.normalMatrix):(L.copy(e.keyMatrices.normalMatrix,e.keyMatrices.bcwc),e.keyMatrices.normalMatrix[3]=0,e.keyMatrices.normalMatrix[7]=0,e.keyMatrices.normalMatrix[11]=0,L.invert(e.keyMatrices.normalMatrix,e.keyMatrices.normalMatrix),L.transpose(e.keyMatrices.normalMatrix,e.keyMatrices.normalMatrix)),L.translate(e.keyMatrices.bcwc,e.keyMatrices.bcwc,[-e.bufferShift[0],-e.bufferShift[1],-e.bufferShift[2]]),L.translate(e.keyMatrices.bcsc,e.keyMatrices.bcwc,[-a[0],-a[1],-a[2]]),e.keyMatricesTime.modified()}return e.keyMatrices}}var R2={bufferShift:void 0,keyMatrixTime:null,keyMatrices:null,propID:void 0};function E2(t,e,r={}){Object.assign(e,R2,r),ve.extend(t,e,r),e.keyMatricesTime={},pe(e.keyMatricesTime,{mtime:0}),e.keyMatrices={normalMatrix:new Float64Array(16),bcwc:new Float64Array(16),bcsc:new Float64Array(16)},e.keyMatrixTime={},pe(e.keyMatrixTime,{mtime:0}),e.keyMatrices={mcwc:L.identity(new Float64Array(16))},e.bufferShift=[0,0,0,0],Ee(t,e,["propID","keyMatricesTime"]),w2(t,e)}var M2=ue(E2,"vtkWebGPUImageSlice");Ke("vtkImageSlice",M2);function D2(t,e){e.classHierarchy.push("vtkWebGPUPixelSpaceCallbackMapper"),t.opaquePass=(r,n)=>{let{renderer:a,renderWindow:i}=wt(t);e.WebGPURenderer=a,e.WebGPURenderWindow=i;let s=e.WebGPURenderer.getAspectRatio(),o=e.WebGPURenderer?e.WebGPURenderer.getRenderable().getActiveCamera():null,c=e.WebGPURenderer.getTiledSizeAndOrigin(),f=null;e.renderable.getUseZValues(),e.renderable.invokeCallback(e.renderable.getInputData(),o,s,c,f)}}var V2={};function L2(t,e,r={}){Object.assign(e,V2,r),ve.extend(t,e,r),D2(t,e)}var _2=w.newInstance(L2,"vtkWebGPUPixelSpaceCallbackMapper");Ke("vtkPixelSpaceCallbackMapper",_2);var{BufferUsage:B2}=Wt,{vtkErrorMacro:ln}=w;function F2(t,e){e.classHierarchy.push("vtkWebGPUStorageBuffer");function r(n){if(e._buffer)return;t.createView("Float32Array");let a={nativeArray:e.Float32Array,usage:B2.Storage,label:e.label};e._buffer=n.getBufferManager().getBuffer(a),e.bindGroupTime.modified()}t.addEntry=(n,a)=>{if(e._bufferEntryNames.has(n)){ln(`entry named ${n} already exists`);return}e._bufferEntryNames.set(n,e.bufferEntries.length);let i=Ve.getByteStrideFromShaderFormat(a);e.bufferEntries.push({name:n,type:a,sizeInBytes:i,offset:e.sizeInBytes,nativeType:Ve.getNativeTypeFromShaderFormat(a)}),e.sizeInBytes+=i},t.send=n=>{if(e.device=n,!e._buffer){r(n),e._sendTime.modified();return}n.getHandle().queue.writeBuffer(e._buffer.getHandle(),0,e.arrayBuffer,0,e.sizeInBytes*e.numberOfInstances),e._sendTime.modified()},t.createView=n=>{n in e||(e.arrayBuffer||(e.arrayBuffer=new ArrayBuffer(e.sizeInBytes*e.numberOfInstances)),e[n]=w.newTypedArray(n,e.arrayBuffer))},t.setValue=(n,a,i)=>{let s=e._bufferEntryNames.get(n);if(s===void 0){ln(`entry named ${n} not found in UBO`);return}let o=e.bufferEntries[s];t.createView(o.nativeType);let c=e[o.nativeType];c[(o.offset+a*e.sizeInBytes)/c.BYTES_PER_ELEMENT]=i},t.setArray=(n,a,i)=>{let s=e._bufferEntryNames.get(n);if(s===void 0){ln(`entry named ${n} not found in UBO`);return}let o=e.bufferEntries[s];t.createView(o.nativeType);let c=e[o.nativeType],f=(o.offset+a*e.sizeInBytes)/c.BYTES_PER_ELEMENT;for(let u=0;u<i.length;u++)c[f+u]=i[u]},t.setAllInstancesFromArray=(n,a)=>{let i=e._bufferEntryNames.get(n);if(i===void 0){ln(`entry named ${n} not found in UBO`);return}let s=e.bufferEntries[i];t.createView(s.nativeType);let o=e[s.nativeType],c=a.length/e.numberOfInstances;for(let f=0;f<e.numberOfInstances;f++){let u=(s.offset+f*e.sizeInBytes)/o.BYTES_PER_ELEMENT;for(let g=0;g<c;g++)o[u+g]=a[f*c+g]}},t.setAllInstancesFromArrayColorToFloat=(n,a)=>{let i=e._bufferEntryNames.get(n);if(i===void 0){ln(`entry named ${n} not found in UBO`);return}let s=e.bufferEntries[i];t.createView(s.nativeType);let o=e[s.nativeType],c=a.length/e.numberOfInstances;for(let f=0;f<e.numberOfInstances;f++){let u=(s.offset+f*e.sizeInBytes)/o.BYTES_PER_ELEMENT;for(let g=0;g<c;g++)o[u+g]=a[f*c+g]/255}},t.setAllInstancesFromArray3x3To4x4=(n,a)=>{let i=e._bufferEntryNames.get(n);if(i===void 0){ln(`entry named ${n} not found in UBO`);return}let s=e.bufferEntries[i];t.createView(s.nativeType);let o=e[s.nativeType],c=9;for(let f=0;f<e.numberOfInstances;f++){let u=(s.offset+f*e.sizeInBytes)/o.BYTES_PER_ELEMENT;for(let g=0;g<3;g++)for(let l=0;l<3;l++)o[u+g*4+l]=a[f*c+g*3+l]}},t.getSendTime=()=>e._sendTime.getMTime(),t.getShaderCode=(n,a)=>{let i=[`struct ${e.label}StructEntry
{`];for(let s=0;s<e.bufferEntries.length;s++){let o=e.bufferEntries[s];i.push(`  ${o.name}: ${o.type},`)}return i.push(`
};
struct ${e.label}Struct
{
  values: array<${e.label}StructEntry>,
};
@binding(${n}) @group(${a}) var<storage, read> ${e.label}: ${e.label}Struct;
`),i.join(`
`)},t.getBindGroupEntry=()=>(!e._buffer&&e.device&&r(e.device),{resource:{buffer:e._buffer.getHandle()}}),t.clearData=()=>{e.numberOfInstances=0,e.sizeInBytes=0,e.bufferEntries=[],e._bufferEntryNames=new Map,e._buffer=null,delete e.arrayBuffer,delete e.Float32Array},t.releaseGraphicsResources=()=>{e._buffer=null,e.bindGroupTime.modified()}}var U2={bufferEntries:null,bufferEntryNames:null,sizeInBytes:0,label:null,numberOfInstances:1};function Pp(t,e,r={}){Object.assign(e,U2,r),w.obj(t,e),e._bufferEntryNames=new Map,e.bufferEntries=[],e._sendTime={},w.obj(e._sendTime,{mtime:0}),e.bindGroupTime={},w.obj(e.bindGroupTime,{mtime:0}),e.bindGroupLayoutEntry=e.bindGroupLayoutEntry||{buffer:{type:"read-only-storage"}},w.get(t,e,["bindGroupTime"]),w.setGet(t,e,["device","bindGroupLayoutEntry","label","numberOfInstances","sizeInBytes"]),F2(t,e)}var N2=w.newInstance(Pp,"vtkWebGPUStorageBuffer"),zr={newInstance:N2,extend:Pp};var G2=`
//VTK::Renderer::Dec

//VTK::Mapper::Dec

//VTK::TCoord::Dec

//VTK::RenderEncoder::Dec

//VTK::IOStructs::Dec

@fragment
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output: fragmentOutput;

  var computedColor: vec4<f32> = mapperUBO.BackgroundColor;

  //VTK::RenderEncoder::Impl
  return output;
}
`,k2=`
//VTK::Renderer::Dec

//VTK::Mapper::Dec

//VTK::TCoord::Dec

//VTK::RenderEncoder::Dec

//VTK::IOStructs::Dec

@fragment
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output: fragmentOutput;

  let t = clamp(input.tcoordVS.y, 0.0, 1.0);
  var computedColor: vec4<f32> = mix(mapperUBO.BackgroundColor2, mapperUBO.BackgroundColor, t);

  //VTK::RenderEncoder::Impl
  return output;
}
`,b2=`
//VTK::Renderer::Dec

//VTK::Mapper::Dec

//VTK::TCoord::Dec

//VTK::RenderEncoder::Dec

//VTK::IOStructs::Dec

@fragment
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output: fragmentOutput;

  var computedColor: vec4<f32> = textureSampleLevel(BackgroundTexture, BackgroundTextureSampler, input.tcoordVS, 0.0);

  //VTK::RenderEncoder::Impl
  return output;
}
`,z2=`
fn vecToRectCoord(dir: vec3<f32>) -> vec2<f32> {
  var tau: f32 = 6.28318530718;
  var pi: f32 = 3.14159265359;
  var out: vec2<f32> = vec2<f32>(0.0);

  out.x = atan2(dir.z, dir.x) / tau;
  out.x += 0.5;

  var phix: f32 = length(vec2(dir.x, dir.z));
  out.y = atan2(dir.y, phix) / pi + 0.5;

  return out;
}

//VTK::Renderer::Dec

//VTK::Mapper::Dec

//VTK::TCoord::Dec

//VTK::RenderEncoder::Dec

//VTK::IOStructs::Dec

@fragment
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output: fragmentOutput;

  var tcoord: vec4<f32> = vec4<f32>(input.vertexVC.xy, -1, 1);
  var V: vec4<f32> = normalize(mapperUBO.FSQMatrix * tcoord);
  var background = textureSampleLevel(EnvironmentTexture, EnvironmentTextureSampler, vecToRectCoord(V.xyz), 0.0);
  var computedColor: vec4<f32> = vec4<f32>(background.rgb, 1.0);

  //VTK::RenderEncoder::Impl
  return output;
}
`,xi=new Float64Array(16),$p=new Float64Array(16);function W2(t,e){e.classHierarchy.push("vtkWebGPUBackground"),t.getMode=r=>{if(r.getTexturedBackground?.()&&r.getBackgroundTexture?.().getImageLoaded?.())return{mode:"texture",texture:r.getBackgroundTexture(),textureName:"BackgroundTexture",pipelineHash:"backgroundTexture"};if(r.getUseEnvironmentTextureAsBackground?.()&&r.getEnvironmentTexture?.().getImageLoaded?.())return{mode:"environment",texture:r.getEnvironmentTexture(),textureName:"EnvironmentTexture",pipelineHash:"backgroundEnvironment"};let n=r.getGradientBackground?.(),a=r.getBackgroundByReference?.()??[0,0,0],i=r.getBackground2ByReference?.()??[0,0,0];return n&&!Fa(a,i)?{mode:"gradient",texture:null,textureName:null,pipelineHash:"backgroundGradient"}:{mode:"solid",texture:null,textureName:null,pipelineHash:"backgroundSolid"}},t.ensureQuad=r=>{e.quad||(e.quad=xt.newInstance(),e.quad.setDevice(r),e.UBO=Ot.newInstance({label:"mapperUBO"}),e.UBO.addEntry("FSQMatrix","mat4x4<f32>"),e.UBO.addEntry("BackgroundColor","vec4<f32>"),e.UBO.addEntry("BackgroundColor2","vec4<f32>"),e.quad.setUBO(e.UBO))},t.getFragmentTemplate=r=>{switch(r){case"gradient":return k2;case"texture":return b2;case"environment":return z2;default:return G2}},t.updateTexture=(r,n,a)=>{if(!n||!a){e.quad.setTextureViews([]);return}let i=r.getTextureManager().getTextureForVTKTexture(n,a);if(!i.getReady()){e.quad.setTextureViews([]);return}let s=i.createView(a),o=n.getInterpolate?.()?"linear":"nearest",c={minFilter:o,magFilter:o};a==="EnvironmentTexture"&&(c={addressModeU:"repeat",addressModeV:"clamp-to-edge",addressModeW:"repeat",minFilter:o,magFilter:o,mipmapFilter:"linear"}),s.addSampler(r,c),e.quad.setTextureViews([s])},t.updateUBO=(r,n,a)=>{let i=a.getBackgroundByReference?.()??[0,0,0],s=a.getBackground2ByReference?.()??[0,0,0];e.UBO.setArray("BackgroundColor",[i[0],i[1],i[2],1]),e.UBO.setArray("BackgroundColor2",[s[0],s[1],s[2],1]);let o=e.webgpuCamera.getKeyMatrices(n);L.transpose($p,o.normalMatrix),L.mul(xi,o.scvc,o.pcsc),L.mul(xi,$p,xi),e.UBO.setArray("FSQMatrix",xi),e.UBO.sendIfNeeded(r)},t.render=(r,n)=>{let a=n.getRenderable(),i=n.getParent().getDevice();t.ensureQuad(i),e.webgpuCamera=n.getViewNodeFor(a.getActiveCamera(),e.webgpuCamera);let{mode:s,texture:o,textureName:c,pipelineHash:f}=t.getMode(a);e.quad.setPipelineHash(f),e.quad.setFragmentShaderTemplate(t.getFragmentTemplate(s)),t.updateTexture(i,o,c),t.updateUBO(i,n,a),e.quad.prepareAndDraw(r)}}var I2={quad:null,UBO:null,webgpuCamera:null};function Ap(t,e,r={}){Object.assign(e,I2,r),w.obj(t,e),W2(t,e)}var H2=w.newInstance(Ap,"vtkWebGPUBackground"),Kp={newInstance:H2,extend:Ap};var{vtkDebugMacro:j2}=we;function P2(t){return t.getPositional()?t.getConeAngle()>=90?0:2:1}function $2(t,e){e.classHierarchy.push("vtkWebGPURenderer"),t.buildPass=r=>{if(r){if(!e.renderable)return;e.camera=e.renderable.getActiveCamera(),e.renderable.updateLightGeometry(),t.updateLights(),t.prepareNodes(),t.addMissingNode(e.camera),t.addMissingNodes(e.renderable.getViewPropsWithNestedProps()),t.removeUnusedNodes(),e.webgpuCamera=t.getViewNodeFor(e.camera,e.webgpuCamera),t.updateStabilizedMatrix()}},t.updateStabilizedMatrix=()=>{let r=e.camera.getClippingRange(),n=e.camera.getPositionByReference(),a=e.camera.getDirectionOfProjectionByReference(),i=[],s=[];W.scale(s,a,.5*(r[0]+r[1])),W.add(i,n,s),W.sub(s,i,e.stabilizedCenter),W.len(s)/(r[1]-r[0])>e.recenterThreshold&&(e.stabilizedCenter=i,e.stabilizedTime.modified())},t.updateLights=()=>{let r=0,n=e.renderable.getLightsByReference();for(let a=0;a<n.length;++a)n[a].getSwitch()>0&&r++;return r||(j2("No lights are on, creating one."),e.renderable.createLight()),r},t.updateUBO=()=>{let r=e.UBO.getSendTime();if(e._parent.getMTime()>r||t.getMTime()>r||e.camera.getMTime()>r||e.renderable.getMTime()>r){let n=e.webgpuCamera.getKeyMatrices(t);e.UBO.setArray("WCVCMatrix",n.wcvc),e.UBO.setArray("SCPCMatrix",n.scpc),e.UBO.setArray("PCSCMatrix",n.pcsc),e.UBO.setArray("SCVCMatrix",n.scvc),e.UBO.setArray("VCPCMatrix",n.vcpc),e.UBO.setArray("WCVCNormals",n.normalMatrix),e.UBO.setValue("LightCount",e.renderable.getLights().filter(s=>s.getSwitch()>0).length),e.UBO.setValue("MaxEnvironmentMipLevel",e.renderable.getEnvironmentTexture()?.getMipLevel()),e.UBO.setValue("BackgroundDiffuseStrength",e.renderable.getEnvironmentTextureDiffuseStrength()),e.UBO.setValue("BackgroundSpecularStrength",e.renderable.getEnvironmentTextureSpecularStrength());let a=t.getYInvertedTiledSizeAndOrigin();e.UBO.setArray("viewportSize",[a.usize,a.vsize]),e.UBO.setArray("viewportOrigin",[a.lowerLeftU,a.lowerLeftV]),e.UBO.setValue("cameraParallel",e.camera.getParallelProjection());let i=e._parent.getDevice();e.UBO.sendIfNeeded(i)}},t.updateSSBO=()=>{let r=e.renderable.getLights().filter(i=>i.getSwitch()>0),n=e.webgpuCamera.getKeyMatrices(t),a=`${e.renderable.getMTime()}`;for(let i=0;i<r.length;i++)a+=r[i].getMTime();if(a!==e.lightTimeString){let i=new Float32Array(r.length*4),s=new Float32Array(r.length*4),o=new Float32Array(r.length*4),c=new Float32Array(r.length*4),f=new Float32Array(r.length*4);for(let g=0;g<r.length;g++){let l=g*4,h=r[g].getPosition();W.transformMat4(h,h,n.wcvc),i[l]=h[0],i[l+1]=h[1],i[l+2]=h[2],i[l+3]=0,s[l]=-r[g].getDirection()[0],s[l+1]=-r[g].getDirection()[1],s[l+2]=-r[g].getDirection()[2],s[l+3]=0,o[l]=r[g].getColor()[0],o[l+1]=r[g].getColor()[1],o[l+2]=r[g].getColor()[2],o[l+3]=r[g].getIntensity()*5,c[l]=P2(r[g]),c[l+1]=Math.cos(ye(r[g].getConeAngle())),c[l+2]=Math.cos(ye(r[g].getConeAngle()+r[g].getConeFalloff())),c[l+3]=0;let y=r[g].getAttenuationValues();f[l]=y[0],f[l+1]=y[1],f[l+2]=y[2],f[l+3]=r[g].getExponent()}e.SSBO.clearData(),e.SSBO.setNumberOfInstances(r.length),e.SSBO.addEntry("LightPos","vec4<f32>"),e.SSBO.addEntry("LightDir","vec4<f32>"),e.SSBO.addEntry("LightColor","vec4<f32>"),e.SSBO.addEntry("LightData","vec4<f32>"),e.SSBO.addEntry("LightAttenuation","vec4<f32>"),e.SSBO.setAllInstancesFromArray("LightPos",i),e.SSBO.setAllInstancesFromArray("LightDir",s),e.SSBO.setAllInstancesFromArray("LightColor",o),e.SSBO.setAllInstancesFromArray("LightData",c),e.SSBO.setAllInstancesFromArray("LightAttenuation",f);let u=e._parent.getDevice();e.SSBO.send(u)}e.lightTimeString=a},t.scissorAndViewport=r=>{let n=t.getYInvertedTiledSizeAndOrigin();r.getHandle().setViewport(n.lowerLeftU,n.lowerLeftV,n.usize,n.vsize,0,1),r.getHandle().setScissorRect(n.lowerLeftU,n.lowerLeftV,n.usize,n.vsize)},t.bindUBO=r=>{r.activateBindGroup(e.bindGroup)},t.opaquePass=r=>{r?(e.renderEncoder.begin(e._parent.getCommandEncoder()),t.updateUBO(),t.updateSSBO()):(t.scissorAndViewport(e.renderEncoder),t.clear(),e.renderEncoder.end())},t.zBufferPass=r=>{r?(e.renderEncoder.begin(e._parent.getCommandEncoder()),t.updateUBO(),t.updateSSBO()):(t.scissorAndViewport(e.renderEncoder),e.renderEncoder.end())},t.opaqueZBufferPass=r=>t.zBufferPass(r),t.clear=()=>{e.renderable.getTransparent()||e.suppressClear||e.background.render(e.renderEncoder,t)},t.translucentPass=r=>{r?e.renderEncoder.begin(e._parent.getCommandEncoder()):(t.scissorAndViewport(e.renderEncoder),e.renderEncoder.end())},t.volumeDepthRangePass=r=>{if(r)e.renderEncoder.begin(e._parent.getCommandEncoder());else{let n=e._parent.getSizeByReference();e.renderEncoder.getHandle().setViewport(0,0,n[0],n[1],0,1),e.renderEncoder.getHandle().setScissorRect(0,0,n[0],n[1]),e.renderEncoder.end()}},t.getAspectRatio=()=>{let r=e._parent.getSizeByReference(),n=e.renderable.getViewportByReference();return r[0]*(n[2]-n[0])/((n[3]-n[1])*r[1])},t.convertToOpenGLDepth=r=>e.webgpuCamera.convertToOpenGLDepth(r),t.getYInvertedTiledSizeAndOrigin=()=>{let r=t.getTiledSizeAndOrigin();return r.lowerLeftV=e._parent.getSizeByReference()[1]-r.vsize-r.lowerLeftV,r},t.getTiledSizeAndOrigin=()=>{let r=e.renderable.getViewportByReference(),n=[0,0,1,1],a=r[0]-n[0],i=r[1]-n[1],s=e._parent.normalizedDisplayToDisplay(a,i),o=Math.round(s[0]),c=Math.round(s[1]),f=r[2]-n[0],u=r[3]-n[1],g=e._parent.normalizedDisplayToDisplay(f,u),l=Math.round(g[0])-o,h=Math.round(g[1])-c;return l<0&&(l=0),h<0&&(h=0),{usize:l,vsize:h,lowerLeftU:o,lowerLeftV:c}},t.getPropFromID=r=>{for(let n=0;n<e.children.length;n++)if((e.children[n].getPropID?e.children[n].getPropID():-1)===r)return e.children[n];return null},t.getStabilizedTime=()=>e.stabilizedTime.getMTime(),t.releaseGraphicsResources=()=>{e.selector!==null&&e.selector.releaseGraphicsResources(),e.clearFSQ?.releaseGraphicsResources?.(),e.clearFSQ=null,e.bindGroup.releaseGraphicsResources?.(),e.UBO.releaseGraphicsResources?.(),e.SSBO.releaseGraphicsResources?.(),e.renderEncoder=null,e.backgroundTexLoaded=!1}}var A2={bindGroup:null,selector:null,renderEncoder:null,opaqueColorTextureView:null,recenterThreshold:20,suppressClear:!1,stabilizedCenter:[0,0,0]};function K2(t,e,r={}){Object.assign(e,A2,r),ve.extend(t,e,r),e.UBO=Ot.newInstance({label:"rendererUBO"}),e.UBO.addEntry("WCVCMatrix","mat4x4<f32>"),e.UBO.addEntry("SCPCMatrix","mat4x4<f32>"),e.UBO.addEntry("PCSCMatrix","mat4x4<f32>"),e.UBO.addEntry("SCVCMatrix","mat4x4<f32>"),e.UBO.addEntry("VCPCMatrix","mat4x4<f32>"),e.UBO.addEntry("WCVCNormals","mat4x4<f32>"),e.UBO.addEntry("viewportSize","vec2<f32>"),e.UBO.addEntry("viewportOrigin","vec2<f32>"),e.UBO.addEntry("LightCount","i32"),e.UBO.addEntry("MaxEnvironmentMipLevel","f32"),e.UBO.addEntry("BackgroundDiffuseStrength","f32"),e.UBO.addEntry("BackgroundSpecularStrength","f32"),e.UBO.addEntry("cameraParallel","u32"),e.SSBO=zr.newInstance({label:"rendererLightSSBO"}),e.lightTimeString="",e.bindGroup=gi.newInstance({label:"rendererBG"}),e.bindGroup.setBindables([e.UBO,e.SSBO]),e.background=Kp.newInstance(),e.tmpMat4=L.identity(new Float64Array(16)),e.stabilizedTime={},pe(e.stabilizedTime,{mtime:0}),Ee(t,e,["bindGroup","stabilizedTime"]),Kt(t,e,["stabilizedCenter"]),de(t,e,["renderEncoder","opaqueColorTextureView","selector","suppressClear","UBO"]),$2(t,e)}var X2=ue(K2,"vtkWebGPURenderer");Ke("vtkRenderer",X2);function Y2(t,e){e.classHierarchy.push("vtkWebGPUVolume"),t.buildPass=a=>{if(!(!e.renderable||!e.renderable.getVisibility())&&a){let{renderer:i,renderWindow:s}=wt(t);e.WebGPURenderer=i,e.WebGPURenderWindow=s,e.propID===void 0&&(e.propID=e.WebGPURenderWindow.getUniquePropID()),e.renderable.getMapper().update()}},t.queryPass=(a,i)=>{if(a){if(!e.renderable||!e.renderable.getVisibility())return;let s=e.renderable.getMapper().getBounds();if(!s||s.length!==6||s[0]>s[1])return;i.addVolume(t)}};let r=new Float64Array(3),n=new Float64Array(3);t.getBoundingCubePoints=(a,i)=>{let s=e.renderable.getMapper().getInputData();if(!s)return;let o=s.getSpatialExtent(),c=e.renderable.getMatrix(),f=0;for(let u=4;u<6;u++){r[2]=o[u];for(let g=2;g<4;g++){r[1]=o[g];for(let l=0;l<2;l++){r[0]=o[l],s.indexToWorld(r,n);let h=i+f*3;a[h++]=c[0]*n[0]+c[1]*n[1]+c[2]*n[2]+c[3],a[h++]=c[4]*n[0]+c[5]*n[1]+c[6]*n[2]+c[7],a[h++]=c[8]*n[0]+c[9]*n[1]+c[10]*n[2]+c[11],f++}}}},t.getKeyMatrices=a=>{if(Math.max(e.renderable.getMTime(),a.getStabilizedTime())>e.keyMatricesTime.getMTime()){e.renderable.computeMatrix();let i=e.renderable.getMatrix(),s=a.getStabilizedCenterByReference();L.transpose(e.keyMatrices.bcwc,i),L.translate(e.keyMatrices.bcsc,e.keyMatrices.bcwc,[-s[0],-s[1],-s[2]]),e.keyMatricesTime.modified()}return e.keyMatrices}}var q2={propID:void 0,keyMatricesTime:null};function Z2(t,e,r={}){Object.assign(e,q2,r),ve.extend(t,e,r),e.keyMatricesTime={},w.obj(e.keyMatricesTime,{mtime:0}),e.keyMatrices={bcwc:new Float64Array(16),bcsc:new Float64Array(16)},w.get(t,e,["propID","keyMatricesTime"]),Y2(t,e),t.delete=w.chain(()=>{e.WebGPURenderWindow?.getDevice()?.getTextureManager().releaseTexture(t)},t.delete)}var Q2=w.newInstance(Z2,"vtkWebGPUVolume");Ke("vtkVolume",Q2);function J2(t,e){e.classHierarchy.push("vtkWebGPUSampler"),t.create=(r,n={})=>{e.device=r,e.options.addressModeU=n.addressModeU?n.addressModeU:"clamp-to-edge",e.options.addressModeV=n.addressModeV?n.addressModeV:"clamp-to-edge",e.options.addressModeW=n.addressModeW?n.addressModeW:"clamp-to-edge",e.options.magFilter=n.magFilter?n.magFilter:"nearest",e.options.minFilter=n.minFilter?n.minFilter:"nearest",e.options.mipmapFilter=n.mipmapFilter?n.mipmapFilter:"nearest",e.options.label=e.label,e.handle=e.device.getHandle().createSampler(e.options),e.bindGroupTime.modified()},t.getShaderCode=(r,n)=>`@binding(${r}) @group(${n}) var ${e.label}: sampler;`,t.getBindGroupEntry=()=>({resource:e.handle})}var eO={device:null,handle:null,label:null,options:null};function Xp(t,e,r={}){Object.assign(e,eO,r),w.obj(t,e),e.options={},e.bindGroupLayoutEntry={visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,sampler:{}},e.bindGroupTime={},w.obj(e.bindGroupTime,{mtime:0}),w.get(t,e,["bindGroupTime","handle","options"]),w.setGet(t,e,["bindGroupLayoutEntry","device","label"]),J2(t,e)}var tO=w.newInstance(Xp),mr={newInstance:tO,extend:Xp};var{BufferUsage:rO}=Wt,nO=`
//VTK::Renderer::Dec

//VTK::Mapper::Dec

//VTK::IOStructs::Dec

@vertex
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output : vertexOutput;

  //VTK::ImageCPR::Impl

  return output;
}
`,aO=`
//VTK::Renderer::Dec

//VTK::Mapper::Dec

//VTK::Clip::Dec

//VTK::Coincident::Dec

//VTK::RenderEncoder::Dec

//VTK::IOStructs::Dec

fn applyQuaternionToVec(q: vec4<f32>, v: vec3<f32>) -> vec3<f32>
{
  let uv = cross(q.xyz, v);
  let uuv = cross(q.xyz, uv);
  return v + (2.0 * q.w) * uv + 2.0 * uuv;
}

fn quaternionLerpOrSlerp(q0In: vec4<f32>, q1In: vec4<f32>, t: f32) -> vec4<f32>
{
  var q0 = normalize(q0In);
  var q1 = normalize(q1In);
  var cosAngle = dot(q0, q1);
  if (cosAngle < 0.0)
  {
    q1 = -q1;
    cosAngle = -cosAngle;
  }
  if (cosAngle > 0.999)
  {
    return normalize((1.0 - t) * q0 + t * q1);
  }
  let omega = acos(cosAngle);
  let sinOmega = max(sin(omega), 0.000001);
  let w0 = sin((1.0 - t) * omega) / sinOmega;
  let w1 = sin(t * omega) / sinOmega;
  return normalize(w0 * q0 + w1 * q1);
}

fn getComponent(v: vec4<f32>, idx: u32) -> f32
{
  if (idx == 0u) { return v.x; }
  if (idx == 1u) { return v.y; }
  if (idx == 2u) { return v.z; }
  return v.w;
}

fn sampleColorTF(value: f32) -> vec4<f32>
{
  return textureSampleLevel(colorTexture, cprSampler, vec2<f32>(value, 0.5), 0.0);
}

fn sampleScalarColor(value: f32) -> vec3<f32>
{
  return sampleColorTF(value).rgb;
}

fn sampleColorRow(value: f32, row: f32) -> vec4<f32>
{
  return textureSampleLevel(colorTexture, cprSampler, vec2<f32>(value, row), 0.0);
}

fn sampleOpacityRow(value: f32, row: f32) -> f32
{
  return textureSampleLevel(pwfTexture, cprSampler, vec2<f32>(value, row), 0.0).r;
}

fn getProjectedValue(volumePosTC: vec3<f32>, projectionDirection: vec3<f32>) -> vec4<f32>
{
  let scaledDirection =
    (mapperUBO.MCTCMatrix * vec4<f32>(projectionDirection, 0.0)).xyz;
  let projectionStep = mapperUBO.ProjectionParams.z * scaledDirection;
  let projectionStart = volumePosTC + mapperUBO.ProjectionParams.y * scaledDirection;

  var tvalue = vec4<f32>(0.0);
  if (mapperUBO.ProjectionMode == ${gt.MIN}u)
  {
    tvalue = vec4<f32>(1.0);
  }

  for (var projectionSampleIdx: u32 = 0u;
    projectionSampleIdx < mapperUBO.ProjectionSamples;
    projectionSampleIdx = projectionSampleIdx + 1u)
  {
    let projectionSamplePosition =
      projectionStart + f32(projectionSampleIdx) * projectionStep;
    let sampledTextureValue =
      textureSampleLevel(volumeTexture, cprSampler, projectionSamplePosition, 0.0);

    if (mapperUBO.ProjectionMode == ${gt.MAX}u)
    {
      tvalue = max(tvalue, sampledTextureValue);
    }
    else if (mapperUBO.ProjectionMode == ${gt.MIN}u)
    {
      tvalue = min(tvalue, sampledTextureValue);
    }
    else
    {
      tvalue = tvalue + sampledTextureValue;
    }
  }

  if (mapperUBO.ProjectionMode == ${gt.AVERAGE}u)
  {
    tvalue = tvalue / max(f32(mapperUBO.ProjectionSamples), 1.0);
  }
  return tvalue;
}

@fragment
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output : fragmentOutput;

  var interpolatedOrientation = mapperUBO.UniformOrientation;
  if (mapperUBO.UseUniformOrientation == 0u)
  {
    interpolatedOrientation = quaternionLerpOrSlerp(
      input.centerlineBottomOrientationVS,
      input.centerlineTopOrientationVS,
      input.quadOffsetVS.y
    );
  }
  let samplingDirection = applyQuaternionToVec(
    interpolatedOrientation,
    mapperUBO.TangentDirection.xyz
  );
  let projectionDirection = applyQuaternionToVec(
    interpolatedOrientation,
    mapperUBO.BitangentDirection.xyz
  );

  var horizontalOffset = input.quadOffsetVS.x;
  if (mapperUBO.UseCenterPoint != 0u)
  {
    let baseOffset = dot(
      samplingDirection,
      mapperUBO.GlobalCenterPoint.xyz - input.centerlinePosVS
    );
    horizontalOffset = horizontalOffset + baseOffset;
  }

  let volumePosMC = input.centerlinePosVS + horizontalOffset * samplingDirection;
  //VTK::Clip::Impl
  let volumePosTC =
    (mapperUBO.MCTCMatrix * vec4<f32>(volumePosMC, 1.0)).xyz;

  if (any(volumePosTC < vec3<f32>(0.0)) || any(volumePosTC > vec3<f32>(1.0)))
  {
    var computedColor = mapperUBO.BackgroundColor;
    //VTK::RenderEncoder::Impl
    return output;
  }

  var tvalue = textureSampleLevel(volumeTexture, cprSampler, volumePosTC, 0.0);
  if (mapperUBO.ProjectionSamples > 1u)
  {
    tvalue = getProjectedValue(volumePosTC, projectionDirection);
  }

  var computedColor = vec4<f32>(0.0);
  if (mapperUBO.IndependentComponents != 0u)
  {
    var sumColor = vec3<f32>(0.0);
    var sumWeight = 0.0;
    for (var c: u32 = 0u; c < mapperUBO.NumComponents; c = c + 1u)
    {
      let row = (f32(c) + 0.5) / max(f32(mapperUBO.NumComponents), 1.0);
      let componentValue = getComponent(tvalue, c);
      let lutValue = componentValue * getComponent(mapperUBO.CScale, c) +
        getComponent(mapperUBO.CShift, c);
      let opacityValue = componentValue * getComponent(mapperUBO.PWFScale, c) +
        getComponent(mapperUBO.PWFShift, c);
      let componentMix = getComponent(mapperUBO.ComponentMix, c);
      let color = sampleColorRow(lutValue, row).rgb;
      let weight = componentMix * sampleOpacityRow(opacityValue, row);
      sumColor = sumColor + weight * color;
      sumWeight = sumWeight + weight;
    }

    let finalColor = select(sumColor, sumColor / max(sumWeight, 0.000001), sumWeight > 0.0);
    if (mapperUBO.NumComponents == 1u)
    {
      computedColor = vec4<f32>(finalColor, sumWeight * mapperUBO.Opacity);
    }
    else
    {
      computedColor = vec4<f32>(finalColor, mapperUBO.Opacity);
    }
  }
  else if (mapperUBO.NumComponents == 1u)
  {
    let intensity = tvalue.r;
    let lutValue = intensity * mapperUBO.CScale.x + mapperUBO.CShift.x;
    let opacityValue = intensity * mapperUBO.PWFScale.x + mapperUBO.PWFShift.x;
    computedColor = vec4<f32>(
      sampleScalarColor(lutValue),
      sampleOpacityRow(opacityValue, 0.5) * mapperUBO.Opacity
    );
  }
  else if (mapperUBO.NumComponents == 2u)
  {
    let intensity = tvalue.r * mapperUBO.CScale.x + mapperUBO.CShift.x;
    computedColor = vec4<f32>(
      sampleScalarColor(intensity),
      mapperUBO.PWFScale.x * tvalue.g + mapperUBO.PWFShift.x
    );
  }
  else if (mapperUBO.NumComponents == 3u)
  {
    let tcolor = mapperUBO.CScale * tvalue + mapperUBO.CShift;
    computedColor = vec4<f32>(
      sampleColorTF(tcolor.r).r,
      sampleColorTF(tcolor.g).r,
      sampleColorTF(tcolor.b).r,
      mapperUBO.Opacity
    );
  }
  else
  {
    let tcolor = mapperUBO.CScale * tvalue + mapperUBO.CShift;
    computedColor = vec4<f32>(
      sampleColorTF(tcolor.r).r,
      sampleColorTF(tcolor.g).r,
      sampleColorTF(tcolor.b).r,
      tcolor.a
    );
  }

  //VTK::Select::Impl
  //VTK::Coincident::Impl
  //VTK::RenderEncoder::Impl
  return output;
}
`,pn=new Float64Array(16),Ci=new Float64Array(16),iO=[0,0,0,1],sO=[0,1,3,0,3,2];function oO(t,e){e.classHierarchy.push("vtkWebGPUImageCPRMapper"),t.getCoincidentParameters=()=>e.renderable.getResolveCoincidentTopology()===$e.PolygonOffset?e.renderable.getCoincidentTopologyPolygonOffsetParameters():null,t.buildPass=n=>{if(n){let{parent:a,renderer:i,renderWindow:s,device:o}=wt(t,"vtkWebGPUImageSlice");e.WebGPUImageSlice=a,e.WebGPURenderer=i,e.WebGPURenderWindow=s,e.device=o,t.setWebGPURenderer(e.WebGPURenderer)}},t.opaquePass=n=>{n&&t.render()},t.translucentPass=n=>{n&&t.render()},t.zBufferPass=n=>{n&&t.render()},t.opaqueZBufferPass=n=>t.zBufferPass(n),t.render=()=>{if(e.renderable.update(),!e.renderable.preRenderCheck())return;e.currentImageDataInput=e.renderable.getInputData(0),e.currentCenterlineInput=e.renderable.getOrientedCenterline();let n=e.WebGPURenderer.getRenderEncoder();e.selectionPass=n?.getPipelineHash?.()==="sel",t.prepareToDraw(n),e.renderEncoder.registerDrawCallback(e.pipeline,t.draw)},t.computePipelineHash=()=>{let n=Math.min(e.renderable.getNumberOfClippingPlanes(),6),a=t.getCoincidentParameters();e.pipelineHash=`cprcp${n}co${a?.factor||a?.offset?1:0}${e.renderEncoder.getPipelineHash()}`},t.updateGeometry=()=>{let n=e.currentCenterlineInput,a=n?.getNumberOfPoints?.()??0,i=a<=1?0:a-1;if(!i){t.setNumberOfVertices(0);return}let s=e.renderable.getHeight(),o=e.renderable.getWidth(),c=n.getDistancesToFirstPoint(),f=n.getPoints(),u=n.getOrientations()??[],g=6*i,l=new Float32Array(g*3),h=new Float32Array(g*3),y=new Uint32Array(g),p=new Float32Array(g*4),m=new Float32Array(g*4),d=[0,0,0],x=[0,0,0];for(let R=0;R<i;++R){f.getPoint(R,d),f.getPoint(R+1,x);let D=s-c[R],V=s-c[R+1],U=u[R]??iO,B=u[R+1]??U;for(let _=0;_<6;++_){let N=sO[_],k=R*6+_,F=k*3,G=k*4;l[F]=N===1||N===3?o:0,l[F+1]=N>1?V:D,l[F+2]=0;let b=N>1?x:d;h[F]=b[0],h[F+1]=b[1],h[F+2]=b[2],y[k]=N,p[G]=U[0],p[G+1]=U[1],p[G+2]=U[2],p[G+3]=U[3],m[G]=B[0],m[G+1]=B[1],m[G+2]=B[2],m[G+3]=B[3]}}let T=e.device.getBufferManager(),v=Math.max(e.renderable.getMTime(),n.getMTime(),n.getPoints().getMTime()),C=`cpr-vertex-${v}`,O=`cpr-centerline-${v}`,M=`cpr-quad-${v}`,S=`cpr-top-${v}`,E=`cpr-bottom-${v}`;[[C,l,"float32x3",["vertexMC"]],[O,h,"float32x3",["centerlinePosition"]],[M,y,"uint32",["quadIndex"]],[S,p,"float32x4",["centerlineTopOrientation"]],[E,m,"float32x4",["centerlineBottomOrientation"]]].forEach(([R,D,V,U])=>{let B=T.getBuffer({hash:R,nativeArray:D,usage:rO.RawVertex,format:V});e.vertexInput.addBuffer(B,U)}),t.setNumberOfVertices(g)},t.updateVolumeTexture=()=>{let n=e.WebGPUImageSlice.getRenderable().getProperty(),a=n?.getUpdatedExtents?.()??[],i=e.textureViews[0]?.getTexture(),s=!!e.renderable.getPreferSizeOverAccuracy?.(),o=e.device.getTextureManager().getTextureForImageData(e.currentImageDataInput,{updatedExtents:a,existingTexture:i,preferSizeOverAccuracy:s,owner:e.volumeTextureOwner});a.length&&n.setUpdatedExtents([]),(!e.textureViews[0]||e.textureViews[0].getTexture()!==o)&&(e.textureViews[0]=o.createView("volumeTexture"))},t.updateColorTexture=()=>{let n=e.WebGPUImageSlice.getRenderable().getProperty(),a=e.currentImageDataInput?.getPointData()?.getScalars();if(!a)return;let i=a.getNumberOfComponents(),s=n.getIndependentComponents()?i:1,o=un(n,n.getRGBTransferFunction,s,{label:"cprColorLUT",rowLength:e.rowLength});if(e.colorTextureString===o)return;let c=new Uint8ClampedArray(e.rowLength*s*4),f=new Float32Array(e.rowLength*3);if(n.getRGBTransferFunction())for(let g=0;g<s;++g){let l=n.getRGBTransferFunction(g),h=l.getRange();l.getTable(h[0],h[1],e.rowLength,f,1);for(let y=0;y<e.rowLength;++y){let p=g*e.rowLength*4+y*4;c[p]=255*f[y*3],c[p+1]=255*f[y*3+1],c[p+2]=255*f[y*3+2],c[p+3]=255}}else{let g=Math.max(e.rowLength-1,1);for(let l=0;l<e.rowLength;++l){let h=l*4,y=255*l/g;c[h]=y,c[h+1]=y,c[h+2]=y,c[h+3]=255}}let u=e.device.getTextureManager().getTexture({hash:o,nativeArray:c,width:e.rowLength,height:s,depth:1,format:"rgba8unorm"});e.textureViews[1]=u.createView("colorTexture"),e.colorTextureString=o},t.updateOpacityTexture=()=>{let n=e.WebGPUImageSlice.getRenderable().getProperty(),a=e.currentImageDataInput?.getPointData()?.getScalars();if(!a)return;let i=a.getNumberOfComponents(),s=n.getIndependentComponents()?i:1,o=un(n,n.getPiecewiseFunction,s,{label:"cprOpacityLUT",rowLength:e.rowLength});if(e.pwfTextureString===o)return;let c=new Float32Array(e.rowLength*s),f=new Float32Array(e.rowLength);if(n.getPiecewiseFunction())for(let g=0;g<s;++g){let l=n.getPiecewiseFunction(g);if(l){let h=l.getRange();l.getTable(h[0],h[1],e.rowLength,f,1),c.set(f,g*e.rowLength)}else c.fill(1,g*e.rowLength,(g+1)*e.rowLength)}else c.fill(1);let u=e.device.getTextureManager().getTexture({hash:o,nativeArray:c,width:e.rowLength,height:s,depth:1,format:"r16float"});e.textureViews[2]=u.createView("pwfTexture"),e.pwfTextureString=o},t.updateUBO=()=>{let n=e.UBO.getSendTime(),a=e.WebGPUImageSlice.getRenderable(),i=a.getProperty(),s=e.currentImageDataInput,o=e.WebGPUImageSlice.getPropID(),c=e.WebGPURenderer.getSelector(),f=o;if(c?.getPropIDForSelection&&(f=c.getPropIDForSelection(o,a)+1),e.UBO.setValue("PropID",f),t.getMTime()<=n&&e.renderable.getMTime()<=n&&a.getMTime()<=n&&i.getMTime()<=n&&s.getMTime()<=n&&e.WebGPURenderer.getStabilizedTime()<=n){e.UBO.sendIfNeeded(e.device);return}let u=e.WebGPURenderer.getStabilizedCenterByReference();L.transpose(pn,a.getMatrix()),L.translate(pn,pn,[-u[0],-u[1],-u[2]]),e.UBO.setArray("BCSCMatrix",pn);let g=s.getWorldToIndex(),l=s.getDimensions();L.identity(Ci),L.scale(Ci,Ci,[1/Math.max(l[0],1),1/Math.max(l[1],1),1/Math.max(l[2],1)]),L.multiply(pn,Ci,g),e.UBO.setArray("MCTCMatrix",pn);let h=e.renderable.getCenterPoint();e.UBO.setArray("GlobalCenterPoint",[...h??[0,0,0],1]),e.UBO.setValue("UseCenterPoint",h?1:0),e.UBO.setArray("BackgroundColor",e.renderable.getBackgroundColor()),e.UBO.setArray("TangentDirection",[...e.renderable.getTangentDirection(),0]),e.UBO.setArray("BitangentDirection",[...e.renderable.getBitangentDirection(),0]),e.UBO.setArray("UniformOrientation",e.renderable.getUniformOrientation()),e.UBO.setValue("UseUniformOrientation",e.renderable.getUseUniformOrientation()?1:0),e.UBO.setValue("Width",e.renderable.getWidth()),e.UBO.setValue("Opacity",i.getOpacity());let y=Math.min(e.renderable.getNumberOfClippingPlanes(),6);e.UBO.setValue("NumClipPlanes",y);let p=[0,0,0,0];for(let V=0;V<6;++V)p.fill(0),V<y&&e.renderable.getClippingPlaneInDataCoords(a.getMatrix(),V,p),e.UBO.setArray(`ClipPlane${V}`,p);let m=t.getCoincidentParameters();e.UBO.setValue("CoincidentFactor",m?.factor??0),e.UBO.setValue("CoincidentOffset",16e-6*(m?.offset??0));let d=e.renderable.getProjectionSlabNumberOfSamples(),x=e.renderable.getProjectionSlabThickness(),T=d>1?x/(d-1):0;e.UBO.setValue("ProjectionSamples",d),e.UBO.setValue("ProjectionMode",e.renderable.getProjectionMode()),e.UBO.setArray("ProjectionParams",[x,-.5*x,T,0]);let v=s.getPointData().getScalars().getNumberOfComponents(),C=i.getIndependentComponents(),O=[0,0,0,0],M=[1,1,1,1],S=[0,0,0,0],E=[1,1,1,1],R=[0,0,0,0],D=e.textureViews[0].getTexture().getScale();for(let V=0;V<Math.min(v,4);++V){let U=C?V:0;O[V]=i.getComponentWeight?.(V)??1;let B=i.getColorWindow(),_=i.getColorLevel(),N=i.getRGBTransferFunction(U);if(N&&i.getUseLookupTableScalarRange()){let G=N.getRange();B=G[1]-G[0],_=.5*(G[1]+G[0])}let k=Math.abs(B)>0?B:1;M[V]=D/k,S[V]=-_/k+.5;let F=i.getPiecewiseFunction(U);if(F){let G=F.getRange(),b=G[1]-G[0],z=.5*(G[1]+G[0]),I=Math.abs(b)>0?b:1;E[V]=D/I,R[V]=-z/I+.5}}e.UBO.setValue("NumComponents",v),e.UBO.setValue("IndependentComponents",C?1:0),e.UBO.setArray("ComponentMix",O),e.UBO.setArray("CScale",M),e.UBO.setArray("CShift",S),e.UBO.setArray("PWFScale",E),e.UBO.setArray("PWFShift",R),e.UBO.sendIfNeeded(e.device)};let r=t.updateBuffers;t.updateBuffers=()=>{r(),t.updateGeometry(),t.updateVolumeTexture(),t.updateColorTexture(),t.updateOpacityTexture(),t.updateUBO();let n=e.WebGPUImageSlice.getRenderable().getProperty().getInterpolationType()===Qe.NEAREST?"nearest":"linear";(!e.cprSampler||e.cprSampler.getOptions().minFilter!==n)&&(e.cprSampler=mr.newInstance({label:"cprSampler"}),e.cprSampler.create(e.device,{minFilter:n,magFilter:n}),e.additionalBindables=[e.cprSampler])},t.replaceShaderImageCPR=(n,a)=>{let i=a.getShaderDescription("vertex");i.addBuiltinOutput("vec4<f32>","@builtin(position) Position"),i.addOutput("vec2<f32>","quadOffsetVS"),i.addOutput("vec3<f32>","centerlinePosVS"),i.addOutput("vec4<f32>","centerlineTopOrientationVS"),i.addOutput("vec4<f32>","centerlineBottomOrientationVS");let s=i.getCode();s=K.substitute(s,"//VTK::ImageCPR::Impl",["let isLeft = quadIndex == 0u || quadIndex == 2u;","let isTop = quadIndex == 0u || quadIndex == 1u;","output.quadOffsetVS = vec2<f32>(","  mapperUBO.Width * select(0.5, -0.5, isLeft),","  select(0.0, 1.0, isTop)",");","output.centerlinePosVS = centerlinePosition;","output.centerlineTopOrientationVS = centerlineTopOrientation;","output.centerlineBottomOrientationVS = centerlineBottomOrientation;","let posSC = mapperUBO.BCSCMatrix * vec4<f32>(vertexMC, 1.0);","output.Position = rendererUBO.SCPCMatrix * posSC;"]).result,i.setCode(s)},e.shaderReplacements.set("replaceShaderImageCPR",t.replaceShaderImageCPR),t.replaceShaderClip=(n,a)=>{let i=a.getShaderDescription("fragment"),s=i.getCode();if(!e.renderable.getNumberOfClippingPlanes()){s=K.substitute(s,"//VTK::Clip::Impl",[]).result,i.setCode(s);return}let o=vi({countName:"mapperUBO.NumClipPlanes",planePrefix:"mapperUBO.ClipPlane",positionName:"vec4<f32>(volumePosMC, 1.0)"});s=K.substitute(s,"//VTK::Clip::Impl",[...o]).result,i.setCode(s)},e.shaderReplacements.set("replaceShaderClip",t.replaceShaderClip),t.replaceShaderCoincident=(n,a)=>{let i=a.getShaderDescription("fragment"),s=i.getCode(),o=t.getCoincidentParameters();if(!o||o.factor===0&&o.offset===0){s=K.substitute(s,"//VTK::Coincident::Dec",[]).result,s=K.substitute(s,"//VTK::Coincident::Impl",[]).result,i.setCode(s);return}i.addBuiltinInput("vec4<f32>","@builtin(position) fragPos"),i.addBuiltinOutput("f32","@builtin(frag_depth) fragDepth"),s=K.substitute(s,"//VTK::Coincident::Dec",[]).result,s=K.substitute(s,"var output : fragmentOutput;",["var output : fragmentOutput;","var coincidentDepth = input.fragPos.z + mapperUBO.CoincidentOffset;","if (mapperUBO.CoincidentFactor != 0.0) {","  let cscale = length(vec2<f32>(dpdx(input.fragPos.z), dpdy(input.fragPos.z)));","  coincidentDepth = coincidentDepth + mapperUBO.CoincidentFactor * cscale;","}","output.fragDepth = clamp(coincidentDepth, 0.0, 1.0);"]).result,s=K.substitute(s,"//VTK::Coincident::Impl",[""]).result,i.setCode(s)},e.shaderReplacements.set("replaceShaderCoincident",t.replaceShaderCoincident),t.replaceShaderRenderEncoder=(n,a)=>{if(e.selectionPass){let i=a.getShaderDescription("fragment");i.addOutput("vec4<u32>","outColor");let s=i.getCode();s=K.substitute(s,"//VTK::RenderEncoder::Impl",["output.outColor = vec4<u32>(mapperUBO.PropID, 0u, 0u, 0u);"]).result,i.setCode(s);return}e.renderEncoder.replaceShaderCode(a)},e.shaderReplacements.set("replaceShaderRenderEncoder",t.replaceShaderRenderEncoder)}var cO={rowLength:1024,currentImageDataInput:null,currentCenterlineInput:null,colorTextureString:null,pwfTextureString:null,cprSampler:null};function fO(t,e,r={}){Object.assign(e,cO,r),on.extend(t,e,r),t.setVertexShaderTemplate(nO),t.setFragmentShaderTemplate(aO),e.UBO=Ot.newInstance({label:"mapperUBO"}),e.UBO.addEntry("BCSCMatrix","mat4x4<f32>"),e.UBO.addEntry("MCTCMatrix","mat4x4<f32>"),e.UBO.addEntry("BackgroundColor","vec4<f32>"),e.UBO.addEntry("GlobalCenterPoint","vec4<f32>"),e.UBO.addEntry("UniformOrientation","vec4<f32>"),e.UBO.addEntry("TangentDirection","vec4<f32>"),e.UBO.addEntry("BitangentDirection","vec4<f32>"),e.UBO.addEntry("ComponentMix","vec4<f32>"),e.UBO.addEntry("CScale","vec4<f32>"),e.UBO.addEntry("CShift","vec4<f32>"),e.UBO.addEntry("PWFScale","vec4<f32>"),e.UBO.addEntry("PWFShift","vec4<f32>"),e.UBO.addEntry("ProjectionParams","vec4<f32>"),fn(e.UBO,"ClipPlane"),e.UBO.addEntry("Width","f32"),e.UBO.addEntry("Opacity","f32"),e.UBO.addEntry("CoincidentFactor","f32"),e.UBO.addEntry("CoincidentOffset","f32"),e.UBO.addEntry("PropID","u32"),e.UBO.addEntry("NumClipPlanes","u32"),e.UBO.addEntry("ProjectionSamples","u32"),e.UBO.addEntry("ProjectionMode","u32"),e.UBO.addEntry("NumComponents","u32"),e.UBO.addEntry("IndependentComponents","u32"),e.UBO.addEntry("UseUniformOrientation","u32"),e.UBO.addEntry("UseCenterPoint","u32"),oO(t,e),e.volumeTextureOwner={};let n=t.releaseGraphicsResources;t.releaseGraphicsResources=()=>{e.device?.getTextureManager().releaseTexture(e.volumeTextureOwner),n()},t.delete=w.chain(()=>{e.device?.getTextureManager().releaseTexture(e.volumeTextureOwner)},t.delete)}var uO=w.newInstance(fO,"vtkWebGPUImageCPRMapper");Ke("vtkImageCPRMapper",uO);var{vtkErrorMacro:Yp}=w,qe=new Float64Array(16),Co=new Float32Array(4),Oo=new Float32Array(4),wo=new Float32Array(4),Ro=new Float32Array(4),Eo=new Float32Array(4),lO=[0,0,1],pO=[0,0,0],Mo=new Float32Array(4),tg=new Float32Array(4),Do=new Float32Array(4),gO=["r","g","b","a"],Vo=4;function Oi(t){return`OutlineTangent1_${t}`}function wi(t){return`OutlineTangent2_${t}`}function Kn(t){return`OutlineTexelSize_${t}`}function hO(t,e){let r=[],n=[],a=e.getNumberOfInputPorts();for(let i=0;i<a;++i){let s=e.getInputData(i);if(s&&!s.isDeleted()){let o=r.length;r.push({imageData:s,inputIndex:i});let c=St(t,i);c?.getUseLabelOutline()&&n.push({property:c,arrayIndex:o})}}return{currentValidInputs:r,labelOutlineProperties:n}}function Lo(t){return t===0?"imgTexture":`imgTexture${t+1}`}function Xn(t){return t===0?"SCTCMatrix":`WCTCMatrix${t}`}function rg(t){return t.multiTexturePerVolumeEnabled?t.currentValidInputs.length:rt.COLOR_LUT}function _o(t){return rg(t)+1}function ng(t){return _o(t)+1}function qp(t){return ng(t)+1}function vO(t,e){return e.map(({inputIndex:r})=>St(t,r)?.getUseLabelOutline()?"1":"0").join("")}function An(t,e,r,n,a=0){return t[0]=e,t[1]=r,t[2]=n,t[3]=a,t}function Zp(t,e){e.vertexInput.setIndexBuffer(null),e.vertexInput.removeBufferIfPresent("vertexBC"),e.vertexInput.removeBufferIfPresent("vertexNormal"),t.setNumberOfVertices(0)}function dO(t,e){return t.scalarTextureOwners[e]||(t.scalarTextureOwners[e]={}),t.scalarTextureOwners[e]}function ag(t,e){let r=t.scalarTextureOwners[e];r&&t.device?.getTextureManager().releaseTexture(r)}function TO(t,e,r,n){let a=e.getPointData().getScalars().getMTime(),i=t.scalarTextures[r],s=n?.getUpdatedExtents?.()??[];if(i&&i.mtime===a&&!s.length)return i.texture;let o=i?.texture,c=!!t.renderable.getPreferSizeOverAccuracy?.(),f=t.device.getTextureManager().getTextureForImageData(e,{updatedExtents:s,existingTexture:o,preferSizeOverAccuracy:c,owner:dO(t,r)});return s.length&&n.setUpdatedExtents([]),t.scalarTextures[r]={texture:f,mtime:a},f}function mO(t){return t?.getInterpolationType()===Qe.NEAREST?"nearest":"linear"}function Qp(t,e,r,n,a,i){let s=i,o=Lo(i),c=St(r,a),f=TO(e,n,i,c);(!e.textureViews[s]||e.textureViews[s].getTexture()!==f)&&(e.textureViews[s]=f.createView(o));let u=mO(c);t.ensureTextureSampler(e.textureViews[s],{minFilter:u,magFilter:u})}function Jp(t,e){let r=t.renderable.getLabelOutlineTextureWidth();return Math.max(1,e,r>0?r:0)}function eg(){return GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST}function Bo(t){return t===2?"xy":"xyz"}function yO(t){return t===2?{sampleCoordType:"vec2<f32>",coordFromWorldNeg:"(mapperUBO.SCTCMatrix * vec4<f32>(worldNeg, 1.0)).xy",coordFromWorldPos:"(mapperUBO.SCTCMatrix * vec4<f32>(worldPos, 1.0)).xy",coordBounds:"all(sampleCoord >= vec2<f32>(0.0)) && all(sampleCoord <= vec2<f32>(1.0))",negBounds:"all(coordNeg >= vec2<f32>(0.0)) && all(coordNeg <= vec2<f32>(1.0))",posBounds:"all(coordPos >= vec2<f32>(0.0)) && all(coordPos <= vec2<f32>(1.0))"}:{sampleCoordType:"vec3<f32>",coordFromWorldNeg:"(mapperUBO.SCTCMatrix * vec4<f32>(worldNeg, 1.0)).xyz",coordFromWorldPos:"(mapperUBO.SCTCMatrix * vec4<f32>(worldPos, 1.0)).xyz",coordBounds:"all(sampleCoord >= vec3<f32>(0.0)) && all(sampleCoord <= vec3<f32>(1.0))",negBounds:"all(coordNeg >= vec3<f32>(0.0)) && all(coordNeg <= vec3<f32>(1.0))",posBounds:"all(coordPos >= vec3<f32>(0.0)) && all(coordPos <= vec3<f32>(1.0))"}}function SO(t,e,r){let n=[],a=Bo(t.dimensions);for(let i=0;i<Vo;i++)if(i<e){let s=Lo(i),o=`(mapperUBO.${Xn(i)} * vec4<f32>(${r}, 1.0)).${a}`;n.push(`textureSampleLevel(${s}, ${s}Sampler, ${o}, 0.0).r`)}else n.push("0.0");return`vec4<f32>(${n.join(", ")})`}function xO(){return["fn vtkCompositeSlab(currVal: vec4<f32>, valToComp: vec4<f32>, slabType: i32, trapezoid: i32) -> vec4<f32> {","  if (slabType == 0) { return min(currVal, valToComp); }","  if (slabType == 1) { return max(currVal, valToComp); }","  if (trapezoid > 0) { return currVal + 0.5 * valToComp; }","  return currVal + valToComp;","}"]}function ig(t){return t.renderable.getSlabThickness()>0&&t.dimensions===3}function CO(){return["fn labelSlabMask(startTC: vec3<f32>, stepTC: vec3<f32>, halfSlab: f32, stepLen: f32) -> u32 {","  var mask: u32 = 0u;","  var tc: vec3<f32> = startTC;","  var dist: f32 = 0.0;","  for (var i: i32 = 0; i < 4096; i = i + 1) {","    if (dist > halfSlab) { break; }","    if (any(tc > vec3<f32>(1.0)) || any(tc < vec3<f32>(0.0))) { break; }","    let label: i32 = i32(textureSampleLevel(imgTexture, imgTextureSampler, tc, 0.0).r * 255.0 + 0.5);","    if (label > 0 && label < 32) { mask = mask | (1u << u32(label)); }","    tc = tc + stepTC;","    dist = dist + stepLen;","  }","  tc = startTC - stepTC;","  dist = stepLen;","  for (var i: i32 = 0; i < 4096; i = i + 1) {","    if (dist > halfSlab) { break; }","    if (any(tc > vec3<f32>(1.0)) || any(tc < vec3<f32>(0.0))) { break; }","    let label: i32 = i32(textureSampleLevel(imgTexture, imgTextureSampler, tc, 0.0).r * 255.0 + 0.5);","    if (label > 0 && label < 32) { mask = mask | (1u << u32(label)); }","    tc = tc - stepTC;","    dist = dist + stepLen;","  }","  return mask;","}","","fn labelSlabBoxSteps(p: vec3<f32>, stepTC: vec3<f32>) -> f32 {","  var limit: vec3<f32> = vec3<f32>(65536.0);","  if (stepTC.x > 1e-8) { limit.x = (1.0 - p.x) / stepTC.x; }","  else if (stepTC.x < -1e-8) { limit.x = -p.x / stepTC.x; }","  if (stepTC.y > 1e-8) { limit.y = (1.0 - p.y) / stepTC.y; }","  else if (stepTC.y < -1e-8) { limit.y = -p.y / stepTC.y; }","  if (stepTC.z > 1e-8) { limit.z = (1.0 - p.z) / stepTC.z; }","  else if (stepTC.z < -1e-8) { limit.z = -p.z / stepTC.z; }","  return min(limit.x, min(limit.y, limit.z));","}","","fn labelSlabFrontLabel(startTC: vec3<f32>, towardCameraTC: vec3<f32>, halfSlab: f32, stepLen: f32, labelMask: u32) -> i32 {","  let slabSteps: f32 = halfSlab / stepLen;","  let nFront: f32 = min(slabSteps, labelSlabBoxSteps(startTC, towardCameraTC));","  let nBack: f32 = min(slabSteps, labelSlabBoxSteps(startTC, -towardCameraTC));","  var tc: vec3<f32> = startTC + towardCameraTC * nFront;","  let totalSteps: i32 = i32(nFront + nBack) + 1;","  for (var i: i32 = 0; i < 8192; i = i + 1) {","    if (i >= totalSteps) { break; }","    let label: i32 = i32(textureSampleLevel(imgTexture, imgTextureSampler, tc, 0.0).r * 255.0 + 0.5);","    if (label > 0 && label < 32 && (labelMask & (1u << u32(label))) != 0u) { return label; }","    tc = tc - towardCameraTC;","  }","  return 0;","}"]}function OO(){return["      var slabOutline: vec4<f32> = vec4<f32>(0.0);","      if (i32(mapperUBO.SlabType) != 1 || computedColor.r >= 0.5 / 255.0) {","        let slabNormal: vec3<f32> = normalize(input.normalWC);","        let outlineStepTC: vec3<f32> = (mapperUBO.SCTCMatrix * vec4<f32>(slabNormal * mapperUBO.SlabSampleStep, 0.0)).xyz;","        let halfSlab: f32 = mapperUBO.SlabThickness * 0.5;","        let centerMask: u32 = labelSlabMask(sampleCoord, outlineStepTC, halfSlab, mapperUBO.SlabSampleStep);","        if (centerMask != 0u) {","          let outlineDims: vec2<i32> = vec2<i32>(textureDimensions(labelOutlineThickness, 0));","          let labelmapRow: f32 = 0.5 / f32(outlineDims.y);","          var edgeLabels: u32 = 0u;","          var prevThickness: i32 = -1;","          var neighborMask: u32 = 0u;","          for (var s: i32 = 1; s < 32; s = s + 1) {","            if ((centerMask & (1u << u32(s))) == 0u) { continue; }","            let thicknessCoord: vec2<f32> = vec2<f32>((f32(s) - 0.5) / f32(outlineDims.x), labelmapRow);","            let segmentThickness: i32 = max(1, i32(textureSampleLevel(labelOutlineThickness, labelOutlineThicknessSampler, thicknessCoord, 0.0).r * 255.0));","            if (segmentThickness != prevThickness) {","              let outlineOffset1: vec3<f32> = mapperUBO.OutlineTangent1_0.xyz * mapperUBO.OutlineTexelSize_0.xyz * f32(segmentThickness);","              let outlineOffset2: vec3<f32> = mapperUBO.OutlineTangent2_0.xyz * mapperUBO.OutlineTexelSize_0.xyz * f32(segmentThickness);","              neighborMask =","                labelSlabMask(sampleCoord + outlineOffset1, outlineStepTC, halfSlab, mapperUBO.SlabSampleStep) &","                labelSlabMask(sampleCoord - outlineOffset1, outlineStepTC, halfSlab, mapperUBO.SlabSampleStep) &","                labelSlabMask(sampleCoord + outlineOffset2, outlineStepTC, halfSlab, mapperUBO.SlabSampleStep) &","                labelSlabMask(sampleCoord - outlineOffset2, outlineStepTC, halfSlab, mapperUBO.SlabSampleStep);","              prevThickness = segmentThickness;","            }","            if ((neighborMask & (1u << u32(s))) == 0u) { edgeLabels = edgeLabels | (1u << u32(s)); }","          }","          let slabNormalTowardCamera: f32 = (rendererUBO.SCVCMatrix * vec4<f32>(slabNormal, 0.0)).z;","          let towardCameraTC: vec3<f32> = select(-outlineStepTC, outlineStepTC, slabNormalTowardCamera > 0.0);","          if (edgeLabels != 0u) {","            var edgeLabel: i32 = labelSlabFrontLabel(sampleCoord, towardCameraTC, halfSlab, mapperUBO.SlabSampleStep, edgeLabels);","            if (edgeLabel == 0) {","              for (var s: i32 = 1; s < 32; s = s + 1) {","                if ((edgeLabels & (1u << u32(s))) != 0u) { edgeLabel = s; break; }","              }","            }","            let labelValue: f32 = f32(edgeLabel) / 255.0;","            let edgeColor: vec3<f32> = textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(labelValue * mapperUBO.cScale.r + mapperUBO.cShift.r, 0.5), 0.0).rgb;","            let opacityCoord: vec2<f32> = vec2<f32>((f32(edgeLabel) - 0.5) / f32(outlineDims.x), labelmapRow);","            let edgeOpacity: f32 = textureSampleLevel(labelOutlineOpacity, labelOutlineOpacitySampler, opacityCoord, 0.0).r;","            slabOutline = vec4<f32>(edgeColor, edgeOpacity);","          } else {","            let fillLabel: i32 = labelSlabFrontLabel(sampleCoord, towardCameraTC, halfSlab, mapperUBO.SlabSampleStep, centerMask);","            let fillValue: f32 = select(computedColor.r, f32(fillLabel) / 255.0, fillLabel != 0);","            let fillColor: vec3<f32> = textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(fillValue * mapperUBO.cScale.r + mapperUBO.cShift.r, 0.5), 0.0).rgb;","            let fillOpacity: f32 = textureSampleLevel(ofunTexture, ofunTextureSampler, vec2<f32>(fillValue * mapperUBO.oScale.r + mapperUBO.oShift.r, 0.5), 0.0).r;","            slabOutline = vec4<f32>(fillColor, fillOpacity * mapperUBO.Opacity);","          }","        }","      }","      computedColor = slabOutline;"]}function wO(t,e,r){let n=t.renderable.getSlabThickness()>0,a=t.multiTexturePerVolumeEnabled?`      var rawValue: vec4<f32> = ${r("input.worldPosVS")};`:"      var rawValue: vec4<f32> = textureSampleLevel(imgTexture, imgTextureSampler, sampleCoord, 0.0);",i=[`    let sampleCoord: ${e.sampleCoordType} = input.tcoordVS;`,"    var computedColor: vec4<f32>;",`    if (!(${e.coordBounds})) {`,"      computedColor = mapperUBO.BackgroundColor;","    } else {",a];if(n){let s="textureSampleLevel(imgTexture, imgTextureSampler, coordNeg, 0.0)",o="textureSampleLevel(imgTexture, imgTextureSampler, coordPos, 0.0)";t.multiTexturePerVolumeEnabled&&(s=r("worldNeg"),o=r("worldPos")),i.push("      if (mapperUBO.SlabThickness > 0.0) {","        var numSlices: i32 = 1;","        var distTraveled: f32 = mapperUBO.SlabSampleStep;","        var trapezoid: i32 = 0;","        let slabNormal: vec3<f32> = normalize(input.normalWC);","        while (distTraveled < mapperUBO.SlabThickness * 0.5) {","          distTraveled = distTraveled + mapperUBO.SlabSampleStep;","          let fnumSlices: f32 = f32(numSlices);","          var localStep: f32 = fnumSlices * mapperUBO.SlabSampleStep;","          if (distTraveled > mapperUBO.SlabThickness * 0.5) {","            localStep = mapperUBO.SlabThickness * 0.5;","            trapezoid = i32(mapperUBO.SlabTrapezoid);","          }","          let worldNeg: vec3<f32> = input.worldPosVS - localStep * slabNormal;",`          let coordNeg: ${e.sampleCoordType} = ${e.coordFromWorldNeg};`,`          if (${e.negBounds}) {`,`            rawValue = vtkCompositeSlab(rawValue, ${s}, i32(mapperUBO.SlabType), trapezoid);`,"            numSlices += 1;","          }","          let worldPos: vec3<f32> = input.worldPosVS + localStep * slabNormal;",`          let coordPos: ${e.sampleCoordType} = ${e.coordFromWorldPos};`,`          if (${e.posBounds}) {`,`            rawValue = vtkCompositeSlab(rawValue, ${o}, i32(mapperUBO.SlabType), trapezoid);`,"            numSlices += 1;","          }","        }","        if (i32(mapperUBO.SlabType) == 2) {","          rawValue = rawValue / f32(numSlices);","        }","      }")}return i.push("      computedColor = rawValue;","      //VTK::Image::Sample","    }"),i}function RO(t,e){let r=[];for(let n=0;n<t;n++)e.has(n)||r.push(n);for(let n=0;n<t;n++)e.has(n)&&r.push(n);return r}function EO(t){return new Map(t.map(({arrayIndex:e},r)=>[e,r]))}function MO(t,e,r){let n=Bo(t.dimensions);return r?ig(t)?OO():["      let centerValue: f32 = computedColor.r;","      let segmentIndex: u32 = u32(centerValue * 255.0);","      if (segmentIndex == 0u) {","        computedColor = vec4<f32>(0.0, 0.0, 0.0, 0.0);","      } else {","        let outlineDims: vec2<i32> = vec2<i32>(textureDimensions(labelOutlineThickness, 0));","        let textureCoordinate: f32 = (f32(segmentIndex) - 0.5) / f32(outlineDims.x);","        let labelmapRow: f32 = 0.5 / f32(outlineDims.y);","        let thicknessValue: f32 = textureSampleLevel(labelOutlineThickness, labelOutlineThicknessSampler, vec2<f32>(textureCoordinate, labelmapRow), 0.0).r;","        let outlineOpacity: f32 = textureSampleLevel(labelOutlineOpacity, labelOutlineOpacitySampler, vec2<f32>(textureCoordinate, labelmapRow), 0.0).r;","        let actualThickness: i32 = i32(thicknessValue * 255.0);","        let scalar: f32 = centerValue;","        let colorCoord: vec2<f32> = vec2<f32>(scalar * mapperUBO.cScale.r + mapperUBO.cShift.r, 0.5);","        let tColor: vec4<f32> = textureSampleLevel(tfunTexture, tfunTextureSampler, colorCoord, 0.0);","        let opacityCoord: vec2<f32> = vec2<f32>(scalar * mapperUBO.oScale.r + mapperUBO.oShift.r, 0.5);","        let scalarOpacity: f32 = textureSampleLevel(ofunTexture, ofunTextureSampler, opacityCoord, 0.0).r;","        var pixelOnBorder: bool = false;","        for (var i: i32 = -actualThickness; i <= actualThickness; i++) {","          for (var j: i32 = -actualThickness; j <= actualThickness; j++) {","            if (i == 0 && j == 0) { continue; }",`            let neighborCoord: ${e.sampleCoordType} = sampleCoord + f32(i) * mapperUBO.OutlineTangent1_0.${n} * mapperUBO.OutlineTexelSize_0.${n} + f32(j) * mapperUBO.OutlineTangent2_0.${n} * mapperUBO.OutlineTexelSize_0.${n};`,`            if (!(${e.coordBounds.replace(/sampleCoord/g,"neighborCoord")})) {`,"              pixelOnBorder = true;","              break;","            }","            let neighborValue: f32 = textureSampleLevel(imgTexture, imgTextureSampler, neighborCoord, 0.0).r;","            if (neighborValue != centerValue) {","              pixelOnBorder = true;","              break;","            }","          }","          if (pixelOnBorder) { break; }","        }","        if (pixelOnBorder) {","          computedColor = vec4<f32>(tColor.rgb, outlineOpacity);","        } else {","          computedColor = vec4<f32>(tColor.rgb, scalarOpacity * mapperUBO.Opacity);","        }","      }"]:["      let scalar: f32 = computedColor.r;","      let colorCoord: vec2<f32> = vec2<f32>(scalar * mapperUBO.cScale.r + mapperUBO.cShift.r, 0.5);","      let tColor: vec4<f32> = textureSampleLevel(tfunTexture, tfunTextureSampler, colorCoord, 0.0);","      let opacityCoord: vec2<f32> = vec2<f32>(scalar * mapperUBO.oScale.r + mapperUBO.oShift.r, 0.5);","      let scalarOpacity: f32 = textureSampleLevel(ofunTexture, ofunTextureSampler, opacityCoord, 0.0).r;","      computedColor = vec4<f32>(tColor.rgb, scalarOpacity * mapperUBO.Opacity);"]}function DO(t,e){let r=EO(t.labelOutlineProperties),n=RO(t.numberOfComponents,r),a=Bo(t.dimensions),i=["      var convergentColor: vec4<f32> = vec4<f32>(0.0);"];for(let s=0;s<t.numberOfComponents;s++){let o=`${2*s}.0 / f32(textureDimensions(tfunTexture, 0).y) + 0.5 / f32(textureDimensions(tfunTexture, 0).y)`;i.push(`      let scalar${s}: f32 = computedColor.${gO[s]};`,`      let colorCoord${s}: vec2<f32> = vec2<f32>(scalar${s} * mapperUBO.cScale[${s}] + mapperUBO.cShift[${s}], ${o});`,`      let tColor${s}: vec4<f32> = textureSampleLevel(tfunTexture, tfunTextureSampler, colorCoord${s}, 0.0);`,`      let opacityCoord${s}: vec2<f32> = vec2<f32>(scalar${s} * mapperUBO.oScale[${s}] + mapperUBO.oShift[${s}], ${o});`,`      let alpha${s}: f32 = textureSampleLevel(ofunTexture, ofunTextureSampler, opacityCoord${s}, 0.0).r * mapperUBO.componentWeight[${s}] * mapperUBO.Opacity;`)}for(let s=0;s<n.length;s++){let o=n[s];if(r.has(o)){let c=Lo(o),f=r.get(o);i.push(`      let segmentIndex${o}: u32 = u32(scalar${o} * 255.0);`,`      if (segmentIndex${o} > 0u) {`,`        let sampleCoord${o}: ${e.sampleCoordType} = (mapperUBO.${Xn(o)} * vec4<f32>(input.worldPosVS, 1.0)).${a};`,`        let outlineDims${o}: vec2<i32> = vec2<i32>(textureDimensions(labelOutlineThickness, 0));`,`        let textureCoordinate${o}: f32 = (f32(segmentIndex${o}) - 0.5) / f32(outlineDims${o}.x);`,`        let labelmapRow${o}: f32 = (${f}.0 + 0.5) / f32(outlineDims${o}.y);`,`        let thickness${o}: i32 = i32(textureSampleLevel(labelOutlineThickness, labelOutlineThicknessSampler, vec2<f32>(textureCoordinate${o}, labelmapRow${o}), 0.0).r * 255.0);`,`        let outlineOpacity${o}: f32 = textureSampleLevel(labelOutlineOpacity, labelOutlineOpacitySampler, vec2<f32>(textureCoordinate${o}, labelmapRow${o}), 0.0).r;`,`        var pixelOnBorder${o}: bool = false;`,`        for (var ii${o}: i32 = -thickness${o}; ii${o} <= thickness${o}; ii${o}++) {`,`          for (var jj${o}: i32 = -thickness${o}; jj${o} <= thickness${o}; jj${o}++) {`,`            if (ii${o} == 0 && jj${o} == 0) { continue; }`,`            let neighborCoord${o}: ${e.sampleCoordType} = sampleCoord${o} + f32(ii${o}) * mapperUBO.${Oi(o)}.${a} * mapperUBO.${Kn(o)}.${a} + f32(jj${o}) * mapperUBO.${wi(o)}.${a} * mapperUBO.${Kn(o)}.${a};`,`            if (!(${e.coordBounds.replace(/sampleCoord/g,`neighborCoord${o}`)})) { pixelOnBorder${o} = true; break; }`,`            let neighborValue${o}: f32 = textureSampleLevel(${c}, ${c}Sampler, neighborCoord${o}, 0.0).r;`,`            if (neighborValue${o} != scalar${o}) { pixelOnBorder${o} = true; break; }`,"          }",`          if (pixelOnBorder${o}) { break; }`,"        }",`        let finalAlpha${o}: f32 = select(alpha${o}, outlineOpacity${o}, pixelOnBorder${o});`,`        convergentColor = vec4<f32>(mix(convergentColor.rgb, tColor${o}.rgb, finalAlpha${o}), max(convergentColor.a, finalAlpha${o}));`,"      }")}else i.push(`      convergentColor = vec4<f32>(mix(convergentColor.rgb, tColor${o}.rgb, alpha${o}), max(convergentColor.a, alpha${o}));`)}return i.push("      computedColor = convergentColor;"),i}function VO(t){switch(t){case xe.DEPENDENT_LA:return["      let rawColor: vec4<f32> = computedColor;","      let intensity: f32 = rawColor.r * mapperUBO.cScale.r + mapperUBO.cShift.r;","      let tColor: vec4<f32> =","        textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(intensity, 0.5), 0.0);","      computedColor = vec4<f32>(","        tColor.rgb,","        rawColor.g * mapperUBO.oScale.r + mapperUBO.oShift.r);"];case xe.DEPENDENT_RGB:return["      let rawColor: vec4<f32> =","        computedColor * vec4<f32>(mapperUBO.cScale.x) + vec4<f32>(mapperUBO.cShift.x);","      computedColor = vec4<f32>(","        textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.r, 0.5), 0.0).r,","        textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.g, 0.5), 0.0).r,","        textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.b, 0.5), 0.0).r,","        mapperUBO.Opacity);"];case xe.DEPENDENT_RGBA:return["      let rawColor: vec4<f32> =","        computedColor * vec4<f32>(mapperUBO.cScale.x) + vec4<f32>(mapperUBO.cShift.x);","      computedColor = vec4<f32>(","        textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.r, 0.5), 0.0).r,","        textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.g, 0.5), 0.0).r,","        textureSampleLevel(tfunTexture, tfunTextureSampler, vec2<f32>(rawColor.b, 0.5), 0.0).r,","        rawColor.a);"];default:return["      let scalar: f32 = computedColor.r;","      let colorCoord: vec2<f32> = vec2<f32>(scalar * mapperUBO.cScale.r + mapperUBO.cShift.r, 0.5);","      computedColor = textureSampleLevel(tfunTexture, tfunTextureSampler, colorCoord, 0.0);"]}}function LO(t){let e=t.currentInput;L.copy(qe,e.getIndexToWorld()),L.translate(qe,qe,[-.5,-.5,-.5]),L.scale(qe,qe,e.getDimensions()),L.invert(qe,qe),t.UBO.setArray("SCTCMatrix",qe);for(let r=1;r<Vo;r++){let n=t.currentValidInputs[r]?.imageData;n?(L.copy(qe,n.getIndexToWorld()),L.translate(qe,qe,[-.5,-.5,-.5]),L.scale(qe,qe,n.getDimensions()),L.invert(qe,qe),t.UBO.setArray(Xn(r),qe)):t.UBO.setArray(Xn(r),L.identity(qe))}}function _O(t,e){let{planeNormal:r,tangent1:n,tangent2:a}=ci(e,lO);t.UBO.setArray("PlaneNormalWC",An(tg,r[0],r[1],r[2]));for(let i=0;i<Vo;i++){let s=t.currentValidInputs[i]?.imageData;if(s){let{tangent1:o,tangent2:c,texelSize:f}=In(s,n,a,pO);t.UBO.setArray(Oi(i),An(Mo,o[0],o[1],o[2])),t.UBO.setArray(wi(i),An(Mo,c[0],c[1],c[2])),t.UBO.setArray(Kn(i),An(Mo,f[0],f[1],f[2]))}else t.UBO.setArray(Oi(i),Do),t.UBO.setArray(wi(i),Do),t.UBO.setArray(Kn(i),Do)}}function BO(t,e,r,n){Co.fill(1),Oo.fill(0),wo.fill(1),Ro.fill(0),Eo.fill(1);let{numberOfComponents:a,independentComponents:i}=n;for(let s=0;s<a;s++){let o=t.multiTexturePerVolumeEnabled?s:rt.IMAGE,c=t.textureViews[o].getTexture().getScale(),f=r;t.multiTexturePerVolumeEnabled&&t.currentValidInputs[s]&&(f=St(e,t.currentValidInputs[s].inputIndex));let u=f.getColorWindow(),g=f.getColorLevel(),l=0;!t.multiTexturePerVolumeEnabled&&i&&(l=s);let h=f.getRGBTransferFunction(l),y=si({colorWindow:u,colorLevel:g,useLookupTableScalarRange:f.getUseLookupTableScalarRange(),colorRange:h?.getRange?.(),volumeScale:c,volumeOffset:0}),p=f.getPiecewiseFunction(l),m=oi({pwfRange:p?.getRange?.(),volumeScale:c,volumeOffset:0});Co[s]=y.colorScale,Oo[s]=y.colorShift,wo[s]=m.opacityScale,Ro[s]=m.opacityShift,Eo[s]=f.getComponentWeight(l)}t.UBO.setArray("cScale",Co),t.UBO.setArray("cShift",Oo),t.UBO.setArray("oScale",wo),t.UBO.setArray("oShift",Ro),t.UBO.setArray("componentWeight",Eo),t.UBO.setValue("Opacity",r.getOpacity())}function FO(t,e){e.classHierarchy.push("vtkWebGPUImageResliceMapper"),t.buildPass=r=>{if(!r)return;let{parent:n,renderer:a,renderWindow:i,device:s}=wt(t,"vtkWebGPUImageSlice");e.WebGPUImageSlice=n,e.WebGPURenderer=a,e.WebGPURenderWindow=i,e.device=s},t.render=()=>{e.renderable.update();let{currentValidInputs:r,labelOutlineProperties:n}=hO(e.WebGPUImageSlice.getRenderable(),e.renderable);if(e.currentValidInputs=r,!e.currentValidInputs.length){Yp("No input!");return}e.labelOutlineProperties=n;let a=e.currentValidInputs.length,i=e.currentValidInputs[0].imageData,s=i.getPointData().getScalars();e.multiTexturePerVolumeEnabled=a>1,e.numberOfComponents=e.multiTexturePerVolumeEnabled?a:s.getNumberOfComponents(),e.currentInput=i,t.updateResliceGeometry(),t.prepareToDraw(e.WebGPURenderer.getRenderEncoder()),e.numberOfVertices&&e.renderEncoder.registerDrawCallback(e.pipeline,t.draw)},t.computePipelineHash=()=>{let r=e.currentInput.getExtent(),n=t.getImageState(),a=e.WebGPUImageSlice.getRenderable();r[0]===r[1]||r[2]===r[3]||r[4]===r[5]?(e.dimensions=2,e.pipelineHash="reslice2"):(e.dimensions=3,e.pipelineHash="reslice3"),e.pipelineHash+=n.textureChannelMode,n.useLabelOutline&&(e.pipelineHash+="outline"),e.pipelineHash+=`ind${n.independentComponents?1:0}`,e.pipelineHash+=`slab${e.renderable.getSlabThickness()>0?1:0}`,e.pipelineHash+=`norm${e.vertexInput.hasAttribute("vertexNormal")?1:0}`,e.multiTexturePerVolumeEnabled&&(e.pipelineHash+=`multi${e.numberOfComponents}`),e.pipelineHash+=`in${e.currentValidInputs.length}`,e.pipelineHash+=`lbl${vO(a,e.currentValidInputs)}`,e.pipelineHash+=`comp${e.numberOfComponents}`,e.pipelineHash+=e.renderEncoder.getPipelineHash()},t.updateResliceGeometry=()=>{let r=e.currentInput,{resGeomString:n,slicePD:a,slicePlane:i,orthoSlicing:s,orthoAxis:o}=fi(e.renderable,r);if(!(e.resliceGeom&&e.resliceGeomUpdateString===n)){if(a)e.resliceGeom||(e.resliceGeom=tt.newInstance()),e.resliceGeom.getPoints().setData(a.getPoints().getData(),3),e.resliceGeom.getPolys().setData(a.getPolys().getData(),1),e.resliceGeom.getPointData().setNormals(a.getPointData().getNormals());else if(i&&r)if(e.resliceGeom||(e.resliceGeom=tt.newInstance()),s){let{points:c,polys:f,normalsData:u}=li(r,i,o,e.transform);e.resliceGeom.getPoints().setData(c,3),e.resliceGeom.getPolys().setData(f,1),e.resliceGeom.getPointData().setNormals(Z.newInstance({numberOfComponents:3,values:u,name:"Normals"}))}else{let{points:c,polys:f,normalsData:u}=ui(r,i,e.outlineFilter,e.cutter,e.lineToSurfaceFilter);e.resliceGeom.getPoints().setData(c,3),e.resliceGeom.getPolys().setData(f,1);let g=Z.newInstance({numberOfComponents:3,values:u,name:"Normals"});e.resliceGeom.getPointData().setNormals(g)}else{Yp("Unable to build reslice geometry.");return}e.resliceGeomUpdateString=n,e.resliceGeom.modified()}},t.updateGeometryBuffers=()=>{let r=e.resliceGeom,n=r?.getPoints(),a=r?.getPolys();if(!n||!a||!a.getNumberOfValues()){Zp(t,e);return}let i=e.device,s=i.getBufferManager().getBuffer({hash:`ResliceIdx${a.getMTime()}${n.getNumberOfPoints()}`,usage:Pn.Index,cells:a,numberOfPoints:n.getNumberOfPoints(),primitiveType:mo.Triangles,representation:Pe.SURFACE});if(!s||!s.getFlatSize()||!s.getIndexCount()){Zp(t,e);return}e.vertexInput.setIndexBuffer(s),e.vertexInput.addBuffer(i.getBufferManager().getBuffer({hash:`ReslicePts${n.getMTime()}I${s.getMTime()}float32x4`,usage:Pn.PointArray,format:"float32x4",dataArray:n,indexBuffer:s,shift:0,packExtra:!0}),["vertexBC"]);let o=e.renderable.getSlabThickness()>0,c=o?r.getPointData().getNormals():null;o&&c?e.vertexInput.addBuffer(i.getBufferManager().getBuffer({hash:`ResliceNorm${c.getMTime()}I${s.getMTime()}float32x3`,usage:Pn.PointArray,format:"float32x3",dataArray:c,indexBuffer:s}),["vertexNormal"]):e.vertexInput.removeBufferIfPresent("vertexNormal"),t.setTopology("triangle-list"),t.setNumberOfVertices(s.getIndexCount())},t.updateUBO=()=>{let r=e.WebGPUImageSlice.getRenderable(),n=St(r,e.currentValidInputs[0].inputIndex),a=r.getMapper(),i=a.getSlicePlane(),s=e.WebGPURenderer.getStabilizedCenterByReference(),o=t.getImageState();LO(e),e.UBO.setArray("StabilizedCenter",An(tg,s[0],s[1],s[2])),e.UBO.setArray("BackgroundColor",e.renderable.getBackgroundColorByReference());let c=e.currentInput.getSpacing(),f=.5*Math.min(c[0],c[1],c[2]);e.UBO.setValue("SlabThickness",a.getSlabThickness()),e.UBO.setValue("SlabType",a.getSlabType()),e.UBO.setValue("SlabTrapezoid",a.getSlabTrapezoidIntegration()),e.UBO.setValue("SlabSampleStep",f),_O(e,i),BO(e,r,n,o);let u=e.WebGPUImageSlice.getPropID(),g=e.WebGPURenderer.getSelector(),l=u;g?.getPropIDForSelection&&(l=g.getPropIDForSelection(u,r)+1),e.UBO.setValue("PropID",l);let h=t.getCoincidentParameters();e.UBO.setValue("CoincidentFactor",h.factor),e.UBO.setValue("CoincidentOffset",h.offset),e.UBO.sendIfNeeded(e.device)},t.updateBuffers=()=>{if(t.updateGeometryBuffers(),!e.currentInput||!e.numberOfVertices)return;let r=e.WebGPUImageSlice.getRenderable(),n=e.currentValidInputs.length;if(e.multiTexturePerVolumeEnabled)for(let i=0;i<n;i++){let{imageData:s,inputIndex:o}=e.currentValidInputs[i];Qp(t,e,r,s,o,i)}else{let{imageData:i,inputIndex:s}=e.currentValidInputs[0];Qp(t,e,r,i,s,0)}for(let i=n;i<e.scalarTextures.length;i++)e.scalarTextures[i]=null,ag(e,i);e.imageState=t.computeImageState(),t.updateLUTImage(),t.updateOpacityLUTImage(),e.imageState.useLabelOutline?(t.updateLabelOutlineThicknessTexture(),t.updateLabelOutlineOpacityTexture()):(e._labelOutlineThicknessHash=null,e._labelOutlineOpacityHash=null);let a=e.imageState.useLabelOutline?qp(e):_o(e);e.textureViews.length=Math.min(e.textureViews.length,a+1),t.updateUBO()},t.replaceShaderPosition=(r,n,a)=>{let i=n.getShaderDescription("vertex");i.addBuiltinOutput("vec4<f32>","@builtin(position) Position"),i.addOutput("vec4<f32>","vertexSC");let s=e.renderable.getSlabThickness()>0,o=i.getCode(),c=["var vertexWC: vec4<f32> = vec4<f32>(vertexBC.xyz, 1.0);","var vertexSC: vec4<f32> = vertexWC - mapperUBO.StabilizedCenter;","vertexSC.w = 1.0;"];e.dimensions===2?c.push("output.tcoordVS = (mapperUBO.SCTCMatrix * vertexWC).xy;"):c.push("output.tcoordVS = (mapperUBO.SCTCMatrix * vertexWC).xyz;"),c.push("output.worldPosVS = vertexWC.xyz;"),s&&c.push(a.hasAttribute("vertexNormal")?"output.normalWC = normalize(vertexNormal);":"output.normalWC = mapperUBO.PlaneNormalWC.xyz;"),c.push("output.vertexSC = vertexSC;","var pos: vec4<f32> = rendererUBO.SCPCMatrix * vertexSC;","pos.z = clamp(pos.z - 0.000016 * mapperUBO.CoincidentOffset * pos.w, 0.0, pos.w);","output.Position = pos;"),o=K.substitute(o,"//VTK::Position::Impl",c).result,i.setCode(o)},t.getShaderReplacements().set("replaceShaderPosition",t.replaceShaderPosition),t.replaceShaderTCoord=(r,n,a)=>{let i=n.getShaderDescription("vertex");e.dimensions===2?i.addOutput("vec2<f32>","tcoordVS"):i.addOutput("vec3<f32>","tcoordVS"),i.addOutput("vec3<f32>","worldPosVS"),e.renderable.getSlabThickness()>0&&i.addOutput("vec3<f32>","normalWC")},t.getShaderReplacements().set("replaceShaderTCoord",t.replaceShaderTCoord),t.replaceShaderImage=(r,n,a)=>{let i=n.getShaderDescription("fragment"),s=i.getCode(),o=t.getImageState(),c=e.currentValidInputs.length,f=yO(e.dimensions),u=l=>SO(e,c,l),g=xO();switch(o.useLabelOutline&&ig(e)&&g.push(...CO()),s=K.substitute(s,"//VTK::Image::Dec",g).result,s=K.substitute(s,"//VTK::Image::Sample",wO(e,f,u)).result,o.textureChannelMode){case xe.SINGLE:case xe.INDEPENDENT_1:s=K.substitute(s,"//VTK::Image::Sample",MO(e,f,o.useLabelOutline)).result;break;case xe.INDEPENDENT_2:case xe.INDEPENDENT_3:case xe.INDEPENDENT_4:s=K.substitute(s,"//VTK::Image::Sample",DO(e,f)).result;break;default:s=K.substitute(s,"//VTK::Image::Sample",VO(o.textureChannelMode)).result}i.setCode(s)},t.getShaderReplacements().set("replaceShaderImage",t.replaceShaderImage),t.updateLabelOutlineThicknessTexture=()=>{if(!e.labelOutlineProperties.length)return;let{dataArrays:r,hash:n,width:a,height:i}=sn(e.labelOutlineProperties,u=>u.getLabelOutlineThicknessByReference()),s=Jp(e,a),o=`${n}-${s}`;if(o===e._labelOutlineThicknessHash)return;e._labelOutlineThicknessHash=o;let c=new Uint8Array(s*i);Gr(c,r,s);let f=e.device.getTextureManager().getTexture({hash:`irm-outline-thickness-${o}`,nativeArray:c,width:s,height:i,depth:1,format:"r8unorm",usage:eg()}).createView("labelOutlineThickness");t.ensureTextureSampler(f,{minFilter:"nearest",magFilter:"nearest"}),e.textureViews[ng(e)]=f},t.updateLabelOutlineOpacityTexture=()=>{if(!e.labelOutlineProperties.length)return;let{dataArrays:r,hash:n,width:a,height:i}=sn(e.labelOutlineProperties,u=>{let g=u.getLabelOutlineOpacity();return typeof g=="number"?[g]:g}),s=Jp(e,a),o=`${n}-${s}`;if(o===e._labelOutlineOpacityHash)return;e._labelOutlineOpacityHash=o;let c=new Float32Array(s*i);Gr(c,r,s);let f=e.device.getTextureManager().getTexture({hash:`irm-outline-opacity-${o}`,nativeArray:c,width:s,height:i,depth:1,format:"r16float",usage:eg()}).createView("labelOutlineOpacity");t.ensureTextureSampler(f,{minFilter:"nearest",magFilter:"nearest"}),e.textureViews[qp(e)]=f}}var UO={currentValidInputs:null,resliceGeom:null,resliceGeomUpdateString:null,multiTexturePerVolumeEnabled:!1,numberOfComponents:0,labelOutlineProperties:[],_labelOutlineThicknessHash:null,_labelOutlineOpacityHash:null,scalarTextures:[]};function NO(t,e,r={}){Object.assign(e,UO,r),jp.extend(t,e,r),w.get(t,e,["scalarTextures"]),e.scalarTextures=[...r.scalarTextures??[]],e.scalarTextureOwners=[];let n=t.computeImageState;t.computeImageState=()=>{if(e.multiTexturePerVolumeEnabled&&e.currentValidInputs?.length){let o=e.WebGPUImageSlice.getRenderable(),c=St(o,e.currentValidInputs[0].inputIndex),f=!0;return{actorProperty:c,numberOfComponents:e.numberOfComponents,independentComponents:f,numberOfIComponents:e.numberOfComponents,useLabelOutline:e.labelOutlineProperties.length>0,textureChannelMode:Ti(f,e.numberOfComponents)}}let s=n();return s.useLabelOutline=e.labelOutlineProperties.length>0,s};let a=t.updateLUTImage;t.updateLUTImage=()=>{if(!e.multiTexturePerVolumeEnabled){a();return}let s=t.getImageState(),o=e.WebGPUImageSlice.getRenderable(),c=s.numberOfIComponents,f=co({currentValidInputs:e.currentValidInputs,independentComponents:!0,numberOfRows:c,kind:"color",getInputProperty:p=>St(o,p)});if(e.colorTextureString===f)return;e.numRows=c;let u=e.numRows*2*e.rowLength*4;(!e.colorLUTArray||e.colorLUTArray.length!==u)&&(e.colorLUTArray=new Uint8ClampedArray(u));let g=e.colorLUTArray,l=e.colorTmpTable,h=e.rowLength*4;g.fill(0);for(let p=0;p<c;p++){let m=St(o,e.currentValidInputs[p].inputIndex)?.getRGBTransferFunction(0);if(m){let d=m.getRange();m.getTable(d[0],d[1],e.rowLength,l,1);let x=p*h*2;for(let T=0;T<e.rowLength;T++){let v=x+T*4,C=v+h;g[v]=255*l[T*3],g[v+1]=255*l[T*3+1],g[v+2]=255*l[T*3+2],g[v+3]=255,g[C]=g[v],g[C+1]=g[v+1],g[C+2]=g[v+2],g[C+3]=g[v+3]}}}let y=e.device.getTextureManager().getTexture({hash:`irm-color-${e.rowLength}-${f}`,nativeArray:g,width:e.rowLength,height:e.numRows*2,depth:1,format:"rgba8unorm"}).createView("tfunTexture");t.ensureTextureSampler(y,{minFilter:"linear",magFilter:"linear"}),e.textureViews[rg(e)]=y,e.colorTextureString=f};let i=t.updateOpacityLUTImage;t.updateOpacityLUTImage=()=>{if(!e.multiTexturePerVolumeEnabled){i();return}let s=t.getImageState(),o=e.WebGPUImageSlice.getRenderable(),c=s.numberOfIComponents,f=co({currentValidInputs:e.currentValidInputs,independentComponents:!0,numberOfRows:c,kind:"opacity",getInputProperty:y=>St(o,y)});if(e.opacityTextureString===f)return;e.numRows=c;let u=e.numRows*2*e.rowLength;(!e.opacityLUTArray||e.opacityLUTArray.length!==u)&&(e.opacityLUTArray=new Float32Array(u));let g=e.opacityLUTArray,l=e.opacityTmpTable;g.fill(1);for(let y=0;y<c;y++){let p=St(o,e.currentValidInputs[y].inputIndex)?.getPiecewiseFunction(0);if(p){let m=p.getRange();p.getTable(m[0],m[1],e.rowLength,l,1);let d=y*e.rowLength*2,x=d+e.rowLength;for(let T=0;T<e.rowLength;T++)g[d+T]=l[T],g[x+T]=l[T]}}let h=e.device.getTextureManager().getTexture({hash:`irm-opacity-${e.rowLength}-${f}`,nativeArray:g,width:e.rowLength,height:e.numRows*2,depth:1,format:"r16float"}).createView("ofunTexture");t.ensureTextureSampler(h,{minFilter:"linear",magFilter:"linear"}),e.textureViews[_o(e)]=h,e.opacityTextureString=f},t.setScalarTextures=(s=[])=>{e.scalarTextures=[...s],t.modified()},t.releaseGraphicsResources=()=>{for(let s=0;s<e.scalarTextureOwners.length;s++)ag(e,s);e.scalarTextures=[],e.vertexInput.releaseGraphicsResources(),e.textureViews.length=0,e.imageState=null,e.pipelineHash=null,e._labelOutlineThicknessHash=null,e._labelOutlineOpacityHash=null,e.colorTextureString=null,e.opacityTextureString=null},e.UBO.addEntry("StabilizedCenter","vec4<f32>"),e.UBO.addEntry("BackgroundColor","vec4<f32>"),e.UBO.addEntry("PlaneNormalWC","vec4<f32>");for(let s=0;s<4;s++)s>0&&e.UBO.addEntry(Xn(s),"mat4x4<f32>"),e.UBO.addEntry(Oi(s),"vec4<f32>"),e.UBO.addEntry(wi(s),"vec4<f32>"),e.UBO.addEntry(Kn(s),"vec4<f32>");e.UBO.addEntry("SlabThickness","f32"),e.UBO.addEntry("SlabType","f32"),e.UBO.addEntry("SlabTrapezoid","f32"),e.UBO.addEntry("SlabSampleStep","f32"),e.UBO.addEntry("PropID","u32"),e.outlineFilter=ii.newInstance(),e.cutter=ni.newInstance(),e.lineToSurfaceFilter=ai.newInstance(),e.transform=ri.newInstance(),FO(t,e),t.delete=w.chain(()=>{t.releaseGraphicsResources(),e.outlineFilter?.delete?.(),e.cutter?.delete?.(),e.lineToSurfaceFilter?.delete?.(),e.transform?.delete?.()},t.delete)}var GO=w.newInstance(NO,"vtkWebGPUImageResliceMapper");Ke("vtkImageResliceMapper",GO);var vt={UNCHANGED:0,SINGLE_POINT:1,X_LINE:2,Y_LINE:3,Z_LINE:4,XY_PLANE:5,YZ_PLANE:6,XZ_PLANE:7,XYZ_GRID:8,EMPTY:9},Fo={StructuredType:vt};var{StructuredType:nr}=Fo;function kO(t){let e=0;for(let r=0;r<3;++r)t[r*2]<t[r*2+1]&&e++;return t[0]>t[1]||t[2]>t[3]||t[4]>t[5]?nr.EMPTY:e===3?nr.XYZ_GRID:e===2?t[0]===t[1]?nr.YZ_PLANE:t[2]===t[3]?nr.XZ_PLANE:nr.XY_PLANE:e===1?t[0]<t[1]?nr.X_LINE:t[2]<t[3]?nr.Y_LINE:nr.Z_LINE:nr.SINGLE_POINT}var sg={getDataDescriptionFromExtent:kO,...Fo};var{vtkErrorMacro:Wr}=w;function bO(t,e){e.classHierarchy.push("vtkImageData"),t.setExtent=(...n)=>{if(e.deleted)return Wr("instance deleted - cannot call any method"),!1;let a=n.length===1?n[0]:n;if(a.length!==6)return!1;let i=e.extent.some((s,o)=>s!==a[o]);return i&&(e.extent=a.slice(),e.dataDescription=sg.getDataDescriptionFromExtent(e.extent),t.modified()),i},t.setDimensions=(...n)=>{let a,i,s;if(e.deleted){Wr("instance deleted - cannot call any method");return}if(n.length===1){let o=n[0];a=o[0],i=o[1],s=o[2]}else if(n.length===3)a=n[0],i=n[1],s=n[2];else{Wr("Bad dimension specification");return}t.setExtent(0,a-1,0,i-1,0,s-1)},t.getDimensions=()=>[e.extent[1]-e.extent[0]+1,e.extent[3]-e.extent[2]+1,e.extent[5]-e.extent[4]+1],t.getNumberOfCells=()=>{let n=t.getDimensions(),a=1;for(let i=0;i<3;i++){if(n[i]===0)return 0;n[i]>1&&(a*=n[i]-1)}return a},t.getNumberOfPoints=()=>{let n=t.getDimensions();return n[0]*n[1]*n[2]},t.getPoint=n=>{let a=t.getDimensions();if(a[0]===0||a[1]===0||a[2]===0)return Wr("Requesting a point from an empty image."),null;let i=new Float64Array(3);switch(e.dataDescription){case vt.EMPTY:return null;case vt.SINGLE_POINT:break;case vt.X_LINE:i[0]=n;break;case vt.Y_LINE:i[1]=n;break;case vt.Z_LINE:i[2]=n;break;case vt.XY_PLANE:i[0]=n%a[0],i[1]=n/a[0];break;case vt.YZ_PLANE:i[1]=n%a[1],i[2]=n/a[1];break;case vt.XZ_PLANE:i[0]=n%a[0],i[2]=n/a[0];break;case vt.XYZ_GRID:i[0]=n%a[0],i[1]=n/a[0]%a[1],i[2]=n/(a[0]*a[1]);break;default:Wr("Invalid dataDescription")}let s=[0,0,0];return t.indexToWorld(i,s),s},t.getBounds=()=>t.extentToBounds(t.getSpatialExtent()),t.extentToBounds=n=>q.transformBounds(n,e.indexToWorld),t.getSpatialExtent=()=>q.inflate([...e.extent],.5),t.computeTransforms=()=>{L.fromTranslation(e.indexToWorld,e.origin),e.indexToWorld[0]=e.direction[0],e.indexToWorld[1]=e.direction[1],e.indexToWorld[2]=e.direction[2],e.indexToWorld[4]=e.direction[3],e.indexToWorld[5]=e.direction[4],e.indexToWorld[6]=e.direction[5],e.indexToWorld[8]=e.direction[6],e.indexToWorld[9]=e.direction[7],e.indexToWorld[10]=e.direction[8],L.scale(e.indexToWorld,e.indexToWorld,e.spacing),L.invert(e.worldToIndex,e.indexToWorld)},t.indexToWorld=(n,a=[])=>(W.transformMat4(a,n,e.indexToWorld),a),t.indexToWorldVec3=t.indexToWorld,t.worldToIndex=(n,a=[])=>(W.transformMat4(a,n,e.worldToIndex),a),t.worldToIndexVec3=t.worldToIndex,t.indexToWorldBounds=(n,a=[])=>q.transformBounds(n,e.indexToWorld,a),t.worldToIndexBounds=(n,a=[])=>q.transformBounds(n,e.worldToIndex,a),e._onOriginChanged=t.computeTransforms,e._onDirectionChanged=t.computeTransforms,e._onSpacingChanged=t.computeTransforms,t.computeTransforms(),t.getCenter=()=>q.getCenter(t.getBounds()),t.computeHistogram=(n,a=null)=>{let i=[0,0,0,0,0,0];t.worldToIndexBounds(n,i);let s=[0,0,0],o=[0,0,0];q.computeCornerPoints(i,s,o),Ua(s,s),Ua(o,o);let c=t.getDimensions();Ga(s,[0,0,0],[c[0]-1,c[1]-1,c[2]-1],s),Ga(o,[0,0,0],[c[0]-1,c[1]-1,c[2]-1],o);let f=c[0],u=c[0]*c[1],g=t.getPointData().getScalars().getData(),l=-1/0,h=1/0,y=0,p=0,m=0;for(let T=s[2];T<=o[2];T++)for(let v=s[1];v<=o[1];v++){let C=s[0]+v*f+T*u;for(let O=s[0];O<=o[0];O++){if(!a||a([O,v,T],i)){let M=g[C];M>l&&(l=M),M<h&&(h=M),y+=M*M,p+=M,m+=1}++C}}let d=m>0?p/m:0,x=m?Math.abs(y/m-d*d):0;return{minimum:h,maximum:l,average:d,variance:x,sigma:Math.sqrt(x),count:m}},t.computeIncrements=(n,a=1)=>{let i=[],s=a;for(let o=0;o<3;++o)i[o]=s,s*=n[o*2+1]-n[o*2]+1;return i},t.computeOffsetIndex=([n,a,i])=>{let s=t.getExtent(),o=t.getPointData().getScalars().getNumberOfComponents(),c=t.computeIncrements(s,o);return Math.floor((Math.round(n)-s[0])*c[0]+(Math.round(a)-s[2])*c[1]+(Math.round(i)-s[4])*c[2])},t.getOffsetIndexFromWorld=n=>{let a=t.getExtent(),i=t.worldToIndex(n);for(let s=0;s<3;++s)if(i[s]<a[s*2]||i[s]>a[s*2+1])return Wr(`GetScalarPointer: Pixel ${i} is not in memory. Current extent = ${a}`),NaN;return t.computeOffsetIndex(i)},t.getScalarValueFromWorld=(n,a=0)=>{let i=t.getPointData().getScalars().getNumberOfComponents();if(a<0||a>=i)return Wr(`GetScalarPointer: Scalar Component ${a} is not within bounds. Current Scalar numberOfComponents: ${i}`),NaN;let s=t.getOffsetIndexFromWorld(n);return Number.isNaN(s)?s:t.getPointData().getScalars().getComponent(s,a)};let r=t.initialize;t.initialize=()=>(t.set({direction:ne.identity(e.direction),spacing:[1,1,1],origin:[0,0,0],extent:[0,-1,0,-1,0,-1],dataDescription:vt.EMPTY}),r())}var zO={direction:null,indexToWorld:null,worldToIndex:null,spacing:[1,1,1],origin:[0,0,0],extent:[0,-1,0,-1,0,-1],dataDescription:vt.EMPTY};function og(t,e,r={}){Object.assign(e,zO,r),yt.extend(t,e,r),e.direction?Array.isArray(e.direction)&&(e.direction=new Float64Array(e.direction.slice(0,9))):e.direction=ne.identity(new Float64Array(9)),e.indexToWorld=new Float64Array(16),e.worldToIndex=new Float64Array(16),w.get(t,e,["indexToWorld","worldToIndex"]),w.setGetArray(t,e,["origin","spacing"],3),w.setGetArray(t,e,["direction"],9),w.getArray(t,e,["extent"],6),bO(t,e)}var WO=w.newInstance(og,"vtkImageData"),Uo={newInstance:WO,extend:og};function IO(t){return t}function No(t){if(t===null||t==="null")return null;if(t==="true")return!0;if(t==="false")return!1;if(!(t===void 0||t==="undefined"))return t[0]==="["&&t[t.length-1]==="]"?t.substring(1,t.length-1).split(",").map(e=>No(e.trim())):t===""||Number.isNaN(Number(t))?t:Number(t)}function HO(t=!0,e=window.location.search){let r={},n=t?No:IO;return new URLSearchParams(e).forEach((a,i)=>{i&&(r[i]=a?n(a):!0)}),r}var cg={toNativeType:No,extractURLParameters:HO};var Ri={Unknown:0,LeftController:1,RightController:2},gn={Unknown:0,Trigger:1,TrackPad:2,Grip:3,Thumbstick:4,A:5,B:6,ApplicationMenu:7},jO={Unknown:0,TouchpadX:1,TouchpadY:2,ThumbstickX:3,ThumbstickY:4},PO={LeftButton:1,MiddleButton:2,RightButton:3},Go={Device:Ri,Input:gn,Axis:jO,MouseButton:PO};var{Device:Ei,Input:Ir}=Go,{vtkWarningMacro:Yn,vtkErrorMacro:Mi,normalizeWheel:$O,vtkOnceErrorMacro:AO}=w,KO=1,yr={ctrlKey:!1,altKey:!1,shiftKey:!1},hn={NONE:0,LEFT:1,RIGHT:2,MIDDLE:4},ko={"xr-standard":[Ir.Trigger,Ir.Grip,Ir.TrackPad,Ir.Thumbstick,Ir.A,Ir.B]},zo=["StartAnimation","Animation","EndAnimation","PointerEnter","PointerLeave","MouseEnter","MouseLeave","StartMouseMove","MouseMove","EndMouseMove","LeftButtonPress","LeftButtonRelease","MiddleButtonPress","MiddleButtonRelease","RightButtonPress","RightButtonRelease","KeyPress","KeyDown","KeyUp","StartMouseWheel","MouseWheel","EndMouseWheel","StartPinch","Pinch","EndPinch","StartPan","Pan","EndPan","Tap","LongTap","StartRotate","Rotate","EndRotate","Button3D","Move3D","StartPointerLock","EndPointerLock","StartInteraction","Interaction","EndInteraction","AnimationFrameRateUpdate"];function vn(t){t.cancelable&&t.preventDefault()}function Di(t){let e=Object.create(null);return t.forEach(({pointerId:r,position:n})=>{e[r]=n}),e}function bo(t,e){return(t.x-e.x)*(t.x-e.x)+(t.y-e.y)*(t.y-e.y)}function XO(t,e){e.classHierarchy.push("vtkRenderWindowInteractor");let r={...t},n=new Set,a=new Map,i=1,s=0,o=0,c=0,f=0,u={timer:null,pointerId:null};function g(){u.timer!=null&&clearTimeout(u.timer),u.timer=null}function l(S){g(),u.pointerId=S,u.timer=setTimeout(()=>{let E={...d(yr),position:e.startingEventPositions[S],deviceType:"touch"};t.longTapEvent(E),g()},e.longTapDuration)}function h(S){if(u.timer!=null){let E={...d(yr),position:e.startingEventPositions[u.pointerId],deviceType:T(S)};t.tapEvent(E),g()}}t.start=()=>{!e.initialized&&(t.initialize(),!e.initialized)||t.startEventLoop()},t.setRenderWindow=S=>{Mi("you want to call setView(view) instead of setRenderWindow on a vtk.js interactor")},t.setInteractorStyle=S=>{e.interactorStyle!==S&&(e.interactorStyle!=null&&e.interactorStyle.setInteractor(null),e.interactorStyle=S,e.interactorStyle!=null&&e.interactorStyle.getInteractor()!==t&&e.interactorStyle.setInteractor(t))},t.initialize=()=>{e.initialized=!0,t.enable(),t.render()},t.enable=()=>t.setEnabled(!0),t.disable=()=>t.setEnabled(!1),t.startEventLoop=()=>Yn("empty event loop");function y(S,E){e._forcedRenderer||(e.currentRenderer=t.findPokedRenderer(S,E))}t.getCurrentRenderer=()=>(e.currentRenderer||y(0,0),e.currentRenderer);function p(S){let E=e._view.getCanvas(),R=E.getBoundingClientRect(),D=E.width/R.width,V=E.height/R.height,U={x:D*(S.clientX-R.left),y:V*(R.height-S.clientY+R.top),z:0,movementX:D*S.movementX,movementY:V*S.movementY};return(a.size<=1||!e.currentRenderer)&&y(U.x,U.y),U}let m=e._getScreenEventPositionFor||p;function d(S){return{controlKey:S.ctrlKey,altKey:S.altKey,shiftKey:S.shiftKey}}function x(S){let E=d(S);return{key:S.key,keyCode:S.charCode,...E}}function T(S){return S.pointerType||""}let v=()=>{if(e.container===null)return;let{container:S}=e;S.addEventListener("contextmenu",vn),S.addEventListener("wheel",t.handleWheel),S.addEventListener("DOMMouseScroll",t.handleWheel),S.addEventListener("pointerenter",t.handlePointerEnter),S.addEventListener("pointerleave",t.handlePointerLeave),S.addEventListener("pointermove",t.handlePointerMove,{passive:!1}),S.addEventListener("pointerdown",t.handlePointerDown,{passive:!1}),S.addEventListener("pointerup",t.handlePointerUp),S.addEventListener("pointercancel",t.handlePointerCancel),S.addEventListener("keypress",t.handleKeyPress),S.addEventListener("keydown",t.handleKeyDown),document.addEventListener("keyup",t.handleKeyUp),document.addEventListener("pointerlockchange",t.handlePointerLockChange),S.tabIndex=0,S.style.touchAction="none",S.style.userSelect="none",S.style.webkitTapHighlightColor="rgba(0,0,0,0)"};t.bindEvents=S=>{S!==null&&r.setContainer(S)&&v()};let C=()=>{clearTimeout(e.moveTimeoutID),clearTimeout(o),e.moveTimeoutID=0,o=0,s=0,i=1;let{container:S}=e;S&&(S.removeEventListener("contextmenu",vn),S.removeEventListener("wheel",t.handleWheel),S.removeEventListener("DOMMouseScroll",t.handleWheel),S.removeEventListener("pointerenter",t.handlePointerEnter),S.removeEventListener("pointerleave",t.handlePointerLeave),S.removeEventListener("pointermove",t.handlePointerMove,{passive:!1}),S.removeEventListener("pointerdown",t.handlePointerDown,{passive:!1}),S.removeEventListener("pointerup",t.handlePointerUp),S.removeEventListener("pointercancel",t.handlePointerCancel),S.removeEventListener("keypress",t.handleKeyPress),S.removeEventListener("keydown",t.handleKeyDown)),document.removeEventListener("keyup",t.handleKeyUp),document.removeEventListener("pointerlockchange",t.handlePointerLockChange),a.clear(),c=0,g()};t.unbindEvents=()=>{C(),r.setContainer(null)},t.handleKeyPress=S=>{let E=x(S);t.keyPressEvent(E)},t.handleKeyDown=S=>{let E=x(S);t.keyDownEvent(E)},t.handleKeyUp=S=>{let E=x(S);t.keyUpEvent(E)},t.handlePointerEnter=S=>{let E={...d(S),position:m(S),deviceType:T(S)};t.pointerEnterEvent(E),E.deviceType==="mouse"&&t.mouseEnterEvent(E)},t.handlePointerLeave=S=>{let E={...d(S),position:m(S),deviceType:T(S)};t.pointerLeaveEvent(E),E.deviceType==="mouse"&&t.mouseLeaveEvent(E)},t.handlePointerDown=S=>{if(!(S.button>2||t.isPointerLocked()))switch(e.preventDefaultOnPointerDown&&vn(S),S.target.hasPointerCapture(S.pointerId)&&S.target.releasePointerCapture(S.pointerId),e.container.setPointerCapture(S.pointerId),a.has(S.pointerId)&&Yn("[RenderWindowInteractor] duplicate pointerId detected"),a.set(S.pointerId,{pointerId:S.pointerId,position:m(S)}),S.pointerType){case"pen":case"touch":t.handleTouchStart(S);break;default:t.handleMouseDown(S),c=S.buttons}};function O(S,E,R,D=0){let{LEFT:V,MIDDLE:U,RIGHT:B}=hn;(E&~R&V&~D)!==0&&t.leftButtonReleaseEvent(S),(E&~R&U&~D)!==0&&t.middleButtonReleaseEvent(S),(E&~R&B&~D)!==0&&t.rightButtonReleaseEvent(S),(~E&R&V&~D)!==0&&t.leftButtonPressEvent(S),(~E&R&U&~D)!==0&&t.middleButtonPressEvent(S),(~E&R&B&~D)!==0&&t.rightButtonPressEvent(S)}t.handlePointerUp=S=>{let E=[hn.LEFT,hn.MIDDLE,hn.RIGHT][S.button]??hn.NONE;if(a.has(S.pointerId)||f&E)switch(e.preventDefaultOnPointerUp&&vn(S),a.delete(S.pointerId),e.container.releasePointerCapture(S.pointerId),S.pointerType){case"pen":case"touch":t.handleTouchEnd(S);break;default:O({...d(S),position:m(S),deviceType:T(S)},c,S.buttons,E),t.handleMouseUp(S),c=S.buttons,f&=~E}},t.handlePointerCancel=S=>{if(a.has(S.pointerId))switch(a.delete(S.pointerId),S.pointerType){case"pen":case"touch":g(),t.handleTouchEnd(S);break;default:O({...d(S),position:m(S),deviceType:T(S)},c,0),c=0}},t.handlePointerMove=S=>{if(a.has(S.pointerId)){let E=a.get(S.pointerId);E.position=m(S)}switch(S.pointerType){case"pen":case"touch":t.handleTouchMove(S);break;default:{let E=S.buttons;if(E!==c){let R={...d(S),position:m(S),deviceType:T(S)};c===hn.NONE&&(f=E),O(R,c,E,f),c=E,f&=E}t.handleMouseMove(S);break}}},t.handleMouseDown=S=>{let E={...d(S),position:m(S),deviceType:T(S)};switch(S.button){case 0:t.leftButtonPressEvent(E);break;case 1:t.middleButtonPressEvent(E);break;case 2:t.rightButtonPressEvent(E);break;default:Mi(`Unknown mouse button pressed: ${S.button}`)}},t.requestPointerLock=()=>{if(e.container)return e.container.requestPointerLock()},t.exitPointerLock=()=>document.exitPointerLock?.(),t.isPointerLocked=()=>!!e.container&&document.pointerLockElement===e.container,t.handlePointerLockChange=()=>{t.isPointerLocked()?t.startPointerLockEvent():t.endPointerLockEvent()};function M(){e._view&&e.enabled&&e.enableRender&&(e.inRender=!0,e._view.traverseAllPasses(),e.inRender=!1),t.invokeRenderEvent()}t.requestAnimation=S=>{if(S===void 0){Mi("undefined requester, can not start animating");return}if(n.has(S)){Yn("requester is already registered for animating");return}n.add(S),!e.animationRequest&&n.size===1&&!e.xrAnimation&&(e._animationStartTime=Date.now(),e._animationFrameCount=0,e.animationRequest=requestAnimationFrame(t.handleAnimation),t.startAnimationEvent())},t.extendAnimation=S=>{let E=Date.now()+S;e._animationExtendedEnd=Math.max(e._animationExtendedEnd,E),!e.animationRequest&&n.size===0&&!e.xrAnimation&&(e._animationStartTime=Date.now(),e._animationFrameCount=0,e.animationRequest=requestAnimationFrame(t.handleAnimation),t.startAnimationEvent())},t.isAnimating=()=>e.xrAnimation||e.animationRequest!==null,t.cancelAnimation=(S,E=!1)=>{if(!n.has(S)){E||Yn(`${S&&S.getClassName?S.getClassName():S} did not request an animation`);return}n.delete(S),e.animationRequest&&n.size===0&&Date.now()>e._animationExtendedEnd&&(cancelAnimationFrame(e.animationRequest),e.animationRequest=null,t.endAnimationEvent(),t.render())},t.switchToXRAnimation=()=>{e.animationRequest&&(cancelAnimationFrame(e.animationRequest),e.animationRequest=null),e.xrAnimation=!0},t.returnFromXRAnimation=()=>{e.xrAnimation=!1,n.size!==0&&(e.recentAnimationFrameRate=10,e.animationRequest=requestAnimationFrame(t.handleAnimation))},t.updateXRGamepads=(S,E,R)=>{S.inputSources.forEach(D=>{let V=D.gripSpace==null?null:E.getPose(D.gripSpace,R),U=D.gripSpace==null?null:E.getPose(D.targetRaySpace,R),B=D.gamepad,_=D.handedness;if(B){B.index in e.lastGamepadValues||(e.lastGamepadValues[B.index]={left:{buttons:{}},right:{buttons:{}},none:{buttons:{}}});for(let N=0;N<B.buttons.length;++N)N in e.lastGamepadValues[B.index][_].buttons||(e.lastGamepadValues[B.index][_].buttons[N]=!1),e.lastGamepadValues[B.index][_].buttons[N]!==B.buttons[N].pressed&&V!=null&&(t.button3DEvent({gamepad:B,position:V.transform.position,orientation:V.transform.orientation,targetPosition:U.transform.position,targetOrientation:U.transform.orientation,pressed:B.buttons[N].pressed,device:D.handedness==="left"?Ei.LeftController:Ei.RightController,input:ko[B.mapping]&&ko[B.mapping][N]?ko[B.mapping][N]:Ir.Trigger}),e.lastGamepadValues[B.index][_].buttons[N]=B.buttons[N].pressed),e.lastGamepadValues[B.index][_].buttons[N]&&V!=null&&t.move3DEvent({gamepad:B,position:V.transform.position,orientation:V.transform.orientation,targetPosition:U.transform.position,targetOrientation:U.transform.orientation,device:D.handedness==="left"?Ei.LeftController:Ei.RightController})}})},t.handleMouseMove=S=>{let E={...d(S),position:m(S),deviceType:T(S)};e.moveTimeoutID===0?t.startMouseMoveEvent(E):clearTimeout(e.moveTimeoutID),t.mouseMoveEvent(E),e.moveTimeoutID=setTimeout(()=>{t.endMouseMoveEvent(),e.moveTimeoutID=0},200)},t.handleAnimation=()=>{let S=Date.now();e._animationFrameCount++,S-e._animationStartTime>1e3&&e._animationFrameCount>1&&(e.recentAnimationFrameRate=1e3*(e._animationFrameCount-1)/(S-e._animationStartTime),e.lastFrameTime=1/e.recentAnimationFrameRate,t.animationFrameRateUpdateEvent(),e._animationStartTime=S,e._animationFrameCount=1),t.animationEvent(),M(),n.size>0||Date.now()<e._animationExtendedEnd?e.animationRequest=requestAnimationFrame(t.handleAnimation):(cancelAnimationFrame(e.animationRequest),e.animationRequest=null,t.endAnimationEvent(),t.render())},t.handleWheel=S=>{vn(S);let E={...$O(S),...d(S),position:m(S),deviceType:T(S)};o===0&&(Math.abs(E.spinY)>=.3?i=Math.abs(E.spinY):i=1),E.spinY/=i,o===0?t.startMouseWheelEvent(E):clearTimeout(o);let R=!0;e.mouseWheelSpinYBuffering&&(R=!1,s!==0&&Math.sign(E.spinY)!==Math.sign(s)&&(s=0),s+=E.spinY,Math.abs(s)>=KO&&(E.spinY=Math.trunc(s),s-=E.spinY,R=!0)),R&&t.mouseWheelEvent(E),e.wheelEndDebounceDelay===0?(t.extendAnimation(600),t.endMouseWheelEvent(),o=0,s=0):o=setTimeout(()=>{t.extendAnimation(600),t.endMouseWheelEvent(),o=0,s=0},e.wheelEndDebounceDelay)},t.handleMouseUp=S=>{let E={...d(S),position:m(S),deviceType:T(S)};switch(S.button){case 0:t.leftButtonReleaseEvent(E);break;case 1:t.middleButtonReleaseEvent(E);break;case 2:t.rightButtonReleaseEvent(E);break;default:Mi(`Unknown mouse button released: ${S.button}`)}},t.handleTouchStart=S=>{let E=[...a.values()];if(e.recognizeGestures){let R=Di(a);if(e.startingEventPositions||(e.startingEventPositions={}),Object.keys(R).forEach(D=>{e.startingEventPositions[D]=R[D]}),E.length>1){if(g(),E.length===2){let D={...d(yr),position:E[0].position,deviceType:T(S)};t.leftButtonReleaseEvent(D)}t.recognizeGesture("TouchStart",R)}else E.length===1&&(vn(S),l(S.pointerId))}if(E.length===1){let R={...d(yr),position:m(S),deviceType:T(S)};t.leftButtonPressEvent(R)}},t.handleTouchMove=S=>{let E=[...a.values()];if(e.recognizeGestures&&E.length>1){let R=Di(a);t.recognizeGesture("TouchMove",R)}else if(E.length===1){u.timer!==null&&bo(E[0].position,e.startingEventPositions[E[0].pointerId])>e.longTapMaximumDistance*e.longTapMaximumDistance&&g();let R={...d(yr),position:E[0].position,deviceType:T(S)};t.mouseMoveEvent(R)}},t.handleTouchEnd=S=>{let E=[...a.values()];if(e.recognizeGestures)if(E.length===0){h(S);let R={...d(yr),position:m(S),deviceType:T(S)};t.leftButtonReleaseEvent(R)}else if(E.length===1){let R=Di(a);t.recognizeGesture("TouchEnd",R);let D={...d(yr),position:E[0].position,deviceType:T(S)};t.leftButtonPressEvent(D)}else{let R=Di(a);t.recognizeGesture("TouchMove",R)}else if(E.length===1){let R={...d(yr),position:E[0].position,deviceType:T(S)};t.leftButtonReleaseEvent(R)}},t.setView=S=>{e._view!==S&&(e._view=S,e._view.getRenderable().setInteractor(t),t.modified())},t.getFirstRenderer=()=>e._view?.getRenderable()?.getRenderersByReference()?.[0],t.findPokedRenderer=(S=0,E=0)=>{if(!e._view)return null;let R=e._view?.getRenderable()?.getRenderers();if(!R||R.length===0)return null;R.sort((_,N)=>_.getLayer()-N.getLayer());let D=null,V=null,U=null,B=R.length;for(;B--;){let _=R[B];if(e._view.isInViewport(S,E,_)&&_.getInteractive()){U=_;break}D===null&&_.getInteractive()&&(D=_),V===null&&e._view.isInViewport(S,E,_)&&(V=_)}return U===null&&(U=D),U===null&&(U=V),U==null&&(U=R[0]),U},t.render=()=>{!t.isAnimating()&&!e.inRender&&M()},zo.forEach(S=>{let E=S.charAt(0).toLowerCase()+S.slice(1);t[`${E}Event`]=R=>{if(!e.enabled)return;if(!t.getCurrentRenderer()){AO(`
          Can not forward events without a current renderer on the interactor.
        `);return}let D={type:S,pokedRenderer:e.currentRenderer,firstRenderer:t.getFirstRenderer(),...R};t[`invoke${S}`](D)}}),t.recognizeGesture=(S,E)=>{if(Object.keys(E).length>2)return;if(S==="TouchStart"){e.currentGesture="Start";return}if(S==="TouchEnd"){e.currentGesture==="Pinch"&&(t.render(),t.endPinchEvent()),e.currentGesture==="Rotate"&&(t.render(),t.endRotateEvent()),e.currentGesture==="Pan"&&(t.render(),t.endPanEvent()),e.currentGesture="Start",e.startingEventPositions={};return}let R=0,D=[],V=[];Object.keys(E).forEach(G=>{D[R]=E[G],V[R]=e.startingEventPositions[G],R++});let U=Math.sqrt(bo(V[0],V[1])),B=Math.sqrt(bo(D[0],D[1])),_=qt(Math.atan2(V[1].y-V[0].y,V[1].x-V[0].x)),N=qt(Math.atan2(D[1].y-D[0].y,D[1].x-D[0].x)),k=N-_;N=N+180>=360?N-180:N+180,_=_+180>=360?_-180:_+180,Math.abs(N-_)<Math.abs(k)&&(k=N-_);let F=[];if(F[0]=(D[0].x-V[0].x+D[1].x-V[1].x)/2,F[1]=(D[0].y-V[0].y+D[1].y-V[1].y)/2,S==="TouchMove")if(e.currentGesture==="Start"){let G=1e-4*(e.container.clientWidth*e.container.clientWidth+e.container.clientHeight*e.container.clientHeight);G<225&&(G=225);let b=Math.abs(B-U),z=b*b,I=B*3.1415926*Math.abs(k)/360,P=I*I,Q=F[0]*F[0]+F[1]*F[1];if(z>G&&b>I&&z>Q){e.currentGesture="Pinch";let $={scale:1,touches:E};t.startPinchEvent($)}else if(P>G&&P>Q){e.currentGesture="Rotate";let $={rotation:0,touches:E};t.startRotateEvent($)}else if(Q>G){e.currentGesture="Pan";let $={translation:[0,0],touches:E};t.startPanEvent($)}}else{if(e.currentGesture==="Rotate"){let G={rotation:k,touches:E};t.rotateEvent(G)}if(e.currentGesture==="Pinch"){let G={scale:B/U,touches:E};t.pinchEvent(G)}if(e.currentGesture==="Pan"){let G={translation:F,touches:E};t.panEvent(G)}}},t.handleVisibilityChange=()=>{e._animationStartTime=Date.now(),e._animationFrameCount=0},t.setCurrentRenderer=S=>{e._forcedRenderer=!!S,e.currentRenderer=S},t.setContainer=S=>{C();let E=r.setContainer(S??null);return E&&v(),E},t.delete=()=>{for(;n.size;)t.cancelAnimation(n.values().next().value);typeof document.hidden<"u"&&document.removeEventListener("visibilitychange",t.handleVisibilityChange),e.container&&t.setContainer(null),r.delete()},t.getMouseScrollDebounceByPass=()=>e.wheelEndDebounceDelay===0,t.setMouseScrollDebounceByPass=S=>(Yn("mouseScrollDebounceByPass is deprecated. Use wheelEndDebounceDelay instead."),t.setWheelEndDebounceDelay(S?0:fg.wheelEndDebounceDelay)),typeof document.hidden<"u"&&document.addEventListener("visibilitychange",t.handleVisibilityChange,!1)}var fg={renderWindow:null,interactorStyle:null,picker:null,pickingManager:null,initialized:!1,enabled:!1,enableRender:!0,currentRenderer:null,lightFollowCamera:!0,desiredUpdateRate:30,stillUpdateRate:2,container:null,recognizeGestures:!0,currentGesture:"Start",animationRequest:null,lastFrameTime:.1,recentAnimationFrameRate:10,moveTimeoutID:0,lastGamepadValues:{},preventDefaultOnPointerDown:!1,preventDefaultOnPointerUp:!1,wheelEndDebounceDelay:200,mouseWheelSpinYBuffering:!1,longTapDuration:500,longTapMaximumDistance:30};function ug(t,e,r={}){Object.assign(e,fg,r),w.obj(t,e),e._animationExtendedEnd=0,w.event(t,e,"RenderEvent"),zo.forEach(n=>w.event(t,e,n)),w.get(t,e,["initialized","interactorStyle","lastFrameTime","recentAnimationFrameRate","_view"]),w.setGet(t,e,["container","lightFollowCamera","enabled","enableRender","recognizeGestures","desiredUpdateRate","stillUpdateRate","picker","preventDefaultOnPointerDown","preventDefaultOnPointerUp","wheelEndDebounceDelay","mouseWheelSpinYBuffering","longTapDuration","longTapMaximumDistance"]),w.moveToProtected(t,e,["view"]),XO(t,e)}var YO=w.newInstance(ug,"vtkRenderWindowInteractor"),Vi={newInstance:YO,extend:ug,handledEvents:zo,...Go};var qO={DISPLAY:0,WORLD:1},Wo={CoordinateSystem:qO};var{CoordinateSystem:Io}=Wo;function lg(t){return()=>w.vtkErrorMacro(`vtkProp::${t} - NOT IMPLEMENTED`)}function ZO(t,e){e.classHierarchy.push("vtkProp"),t.getMTime=()=>{let r=e.mtime;for(let n=0;n<e.textures.length;++n){let a=e.textures[n].getMTime();a>r&&(r=a)}return r},t.processSelectorPixelBuffers=(r,n)=>{},t.getNestedProps=()=>null,t.getActors=()=>[],t.getActors2D=()=>[],t.getVolumes=()=>[],t.pick=lg("pick"),t.hasKey=lg("hasKey"),t.getNestedVisibility=()=>e.visibility&&(!e._parentProp||e._parentProp.getNestedVisibility()),t.getNestedPickable=()=>e.pickable&&(!e._parentProp||e._parentProp.getNestedPickable()),t.getNestedDragable=()=>e.dragable&&(!e._parentProp||e._parentProp.getNestedDragable()),t.getRedrawMTime=()=>e.mtime,t.setEstimatedRenderTime=r=>{e.estimatedRenderTime=r,e.savedEstimatedRenderTime=r},t.restoreEstimatedRenderTime=()=>{e.estimatedRenderTime=e.savedEstimatedRenderTime},t.addEstimatedRenderTime=r=>{e.estimatedRenderTime+=r},t.setAllocatedRenderTime=r=>{e.allocatedRenderTime=r,e.savedEstimatedRenderTime=e.estimatedRenderTime,e.estimatedRenderTime=0},t.getSupportsSelection=()=>!1,t.getTextures=()=>e.textures,t.hasTexture=r=>e.textures.indexOf(r)!==-1,t.addTexture=r=>{r&&!t.hasTexture(r)&&(e.textures=e.textures.concat(r),t.modified())},t.removeTexture=r=>{let n=e.textures.filter(a=>a!==r);e.textures.length!==n.length&&(e.textures=n,t.modified())},t.removeAllTextures=()=>{e.textures=[],t.modified()},t.setCoordinateSystemToWorld=()=>t.setCoordinateSystem(Io.WORLD),t.setCoordinateSystemToDisplay=()=>t.setCoordinateSystem(Io.DISPLAY)}var QO={allocatedRenderTime:10,coordinateSystem:Io.WORLD,dragable:!0,estimatedRenderTime:0,paths:null,pickable:!0,renderTimeMultiplier:1,savedEstimatedRenderTime:0,textures:[],useBounds:!0,visibility:!0};function pg(t,e,r={}){Object.assign(e,QO,r),w.obj(t,e),w.get(t,e,["estimatedRenderTime","allocatedRenderTime"]),w.setGet(t,e,["_parentProp","coordinateSystem","dragable","pickable","renderTimeMultiplier","useBounds","visibility"]),w.moveToProtected(t,e,["parentProp"]),ZO(t,e)}var JO=w.newInstance(pg,"vtkProp"),gg={newInstance:JO,extend:pg,...Wo};function ew(t,e){e.classHierarchy.push("vtkProp3D"),t.transformsModified=()=>{e.transformsMTime.modified(),t.modified()},e._onOriginChanged=()=>e.transformsMTime.modified(),e._onPositionChanged=()=>e.transformsMTime.modified(),e._onScaleChanged=()=>e.transformsMTime.modified(),t.addPosition=i=>{e.position=e.position.map((s,o)=>s+i[o]),t.transformsModified()},t.getOrientationWXYZ=()=>{let i=Me.create();L.getRotation(i,e.rotation);let s=new Float64Array(3),o=Me.getAxisAngle(s,i);return[qt(o),s[0],s[1],s[2]]},t.getOrientationQuaternion=(i=[])=>L.getRotation(i,e.rotation),t.rotateX=i=>{i!==0&&(L.rotateX(e.rotation,e.rotation,ye(i)),t.transformsModified())},t.rotateY=i=>{i!==0&&(L.rotateY(e.rotation,e.rotation,ye(i)),t.transformsModified())},t.rotateZ=i=>{i!==0&&(L.rotateZ(e.rotation,e.rotation,ye(i)),t.transformsModified())},t.rotateWXYZ=(i,s,o,c)=>{if(i===0||s===0&&o===0&&c===0)return;let f=ye(i),u=Me.create();Me.setAxisAngle(u,[s,o,c],f);let g=new Float64Array(16);L.fromQuat(g,u),L.multiply(e.rotation,e.rotation,g),t.transformsModified()},t.rotateQuaternion=i=>{if(Math.abs(i[3])>=.999999)return;let s=L.fromQuat(new Float64Array(16),i);L.multiply(e.rotation,e.rotation,s),t.transformsModified()},t.setOrientation=(i,s,o)=>i===e.orientation[0]&&s===e.orientation[1]&&o===e.orientation[2]?!1:(e.orientation=[i,s,o],L.identity(e.rotation),t.rotateZ(o),t.rotateX(i),t.rotateY(s),t.transformsModified(),!0),t.setOrientationFromQuaternion=i=>{let s=L.create();return L.fromQuat(s,i),cr(s,e.rotation)?!1:(e.rotation=s,t.transformsModified(),!0)},t.setUserMatrix=i=>cr(e.userMatrix,i)?!1:(L.copy(e.userMatrix,i),t.transformsModified(),!0),t.getMatrix=()=>(t.computeMatrix(),e.matrix),t.computeMatrix=()=>{if(e.transformsMTime.getMTime()>e.matrixMTime.getMTime()){L.identity(e.matrix),e.userMatrix&&L.multiply(e.matrix,e.matrix,e.userMatrix),L.translate(e.matrix,e.matrix,e.origin),L.translate(e.matrix,e.matrix,e.position),L.multiply(e.matrix,e.matrix,e.rotation),L.scale(e.matrix,e.matrix,e.scale),L.translate(e.matrix,e.matrix,[-e.origin[0],-e.origin[1],-e.origin[2]]),L.transpose(e.matrix,e.matrix),e.isIdentity=!0;for(let i=0;i<4;++i)for(let s=0;s<4;++s)(i===s?1:0)!==e.matrix[i+s*4]&&(e.isIdentity=!1);e.matrixMTime.modified()}},t.computeBounds=()=>{if(e.mapper===null){q.reset(e.bounds);return}let i=e.mapper.getBounds();if(!i||i.length!==6||!q.isValid(i)){e.mapperBounds=i,q.reset(e.bounds),e.boundsMTime.modified();return}if(!e.mapperBounds||!i.every((s,o)=>i[o]===e.mapperBounds[o])||t.getMTime()>e.boundsMTime.getMTime()){w.vtkDebugMacro("Recomputing bounds..."),e.mapperBounds=i,t.computeMatrix();let s=new Float64Array(16);L.transpose(s,e.matrix),q.transformBounds(i,s,e.bounds),e.boundsMTime.modified()}};let r=t.getBounds;t.getBounds=()=>(t.computeBounds(),r());let n=t.getBoundsByReference;t.getBoundsByReference=()=>(t.computeBounds(),n()),t.getCenter=()=>q.getCenter(t.getBoundsByReference()),t.getLength=()=>q.getLength(t.getBoundsByReference()),t.getXRange=()=>q.getXRange(t.getBoundsByReference()),t.getYRange=()=>q.getYRange(t.getBoundsByReference()),t.getZRange=()=>q.getZRange(t.getBoundsByReference()),t.getUserMatrix=()=>e.userMatrix;function a(){t.computeMatrix()}t.onModified(a),t.getProperty=(i=0)=>(e.properties[i]==null&&(e.properties[i]=t.makeProperty?.()),e.properties[i]),t.getProperties=()=>(e.properties.length===0&&(e.properties[0]=t.makeProperty?.()),e.properties),t.setProperty=(i,s)=>{let[o,c]=Number.isInteger(i)?[i,s]:[0,i];return e.properties[o]===c?!1:(e.properties[o]=c,!0)},t.getMTime=()=>{let i=e.mtime;return e.properties.forEach(s=>{if(s!==null){let o=s.getMTime();i=o>i?o:i}}),i}}var tw={bounds:[...q.INIT_BOUNDS],origin:[0,0,0],position:[0,0,0],orientation:[0,0,0],rotation:null,scale:[1,1,1],properties:[],userMatrix:null,cachedProp3D:null,isIdentity:!0,matrixMTime:null,transformsMTime:null};function hg(t,e,r={}){Object.assign(e,tw,r),gg.extend(t,e,r),e.matrixMTime={},w.obj(e.matrixMTime),e.transformsMTime={},w.obj(e.transformsMTime),w.get(t,e,["isIdentity"]),w.getArray(t,e,["orientation"]),w.setGetArray(t,e,["origin","position","scale"],3),w.setGet(t,e,["properties"]),w.getArray(t,e,["bounds"],6),e.matrix=L.identity(new Float64Array(16)),e.rotation=L.identity(new Float64Array(16)),e.userMatrix=L.identity(new Float64Array(16)),e.transform=null,ew(t,e)}var rw=w.newInstance(hg,"vtkProp3D"),Li={newInstance:rw,extend:hg};function nw(t,e){e.classHierarchy.push("vtkActor");let r={...t};t.getActors=()=>[t],t.getIsOpaque=()=>{if(e.forceOpaque)return!0;if(e.forceTranslucent)return!1;e.properties[0]||t.getProperty();let n=e.properties[0].getOpacity()>=1;return n=n&&(!e.texture||!e.texture.isTranslucent()),n=n&&(!e.mapper||e.mapper.getIsOpaque()),n},t.hasTranslucentPolygonalGeometry=()=>e.mapper===null?!1:(e.properties[0]||t.getProperty(),!t.getIsOpaque()),t.makeProperty=vr.newInstance,t.getMTime=()=>{let n=r.getMTime();if(e.backfaceProperty!==null){let a=e.backfaceProperty.getMTime();n=a>n?a:n}return n},t.getRedrawMTime=()=>{let n=e.mtime;if(e.mapper!==null){let a=e.mapper.getMTime();n=a>n?a:n,e.mapper.getInput()!==null&&(e.mapper.getInputAlgorithm().update(),a=e.mapper.getInput().getMTime(),n=a>n?a:n)}return n},t.getSupportsSelection=()=>e.mapper?e.mapper.getSupportsSelection():!1,t.processSelectorPixelBuffers=(n,a)=>{e.mapper&&e.mapper.processSelectorPixelBuffers&&e.mapper.processSelectorPixelBuffers(n,a)}}var aw={mapper:null,backfaceProperty:null,forceOpaque:!1,forceTranslucent:!1};function iw(t,e,r={}){Object.assign(e,aw,r),Li.extend(t,e,r),e.boundsMTime={},w.obj(e.boundsMTime),w.setGet(t,e,["backfaceProperty","forceOpaque","forceTranslucent","mapper"]),nw(t,e)}var Gk=w.newInstance(iw,"vtkActor");var sw={DEFAULT:0,MAP_SCALARS:1,DIRECT_SCALARS:2},ow={DEFAULT:0,USE_POINT_DATA:1,USE_CELL_DATA:2,USE_POINT_FIELD_DATA:3,USE_CELL_FIELD_DATA:4,USE_FIELD_DATA:5},cw={BY_ID:0,BY_NAME:1},fw={NONE:0,BASE_COLOR:1,ALPHA:2,NORMAL:3,GEOMETRY_NORMAL:4,TEXTURE_COORDINATES_0:5,OCCLUSION:6,EMISSIVE:7,METALLIC:10,ROUGHNESS:11,CLEARCOAT_FACTOR:20,CLEARCOAT_ROUGHNESS:21,CLEARCOAT_NORMAL:22,SHEEN_COLOR:30,SHEEN_ROUGHNESS:31,SPECULAR_FACTOR:40,SPECULAR_COLOR:41,TRANSMISSION_FACTOR:50,VOLUME_THICKNESS:51,IRIDESCENCE_FACTOR:60,IRIDESCENCE_THICKNESS:61,ANISOTROPIC_STRENGTH:70,ANISOTROPIC_DIRECTION:71,DIFFUSE_TRANSMISSION_FACTOR:80,DIFFUSE_TRANSMISSION_COLOR:81,F0:90},dn={ColorMode:sw,GetArray:cw,ScalarMode:ow,DebugChannel:fw};var{vtkErrorMacro:vg}=w,_i=new Float64Array(16),Bi=new Float64Array(4);function dg(t,e){let r=t.getNormalByReference(),n=t.getOriginByReference();return e[0]=r[0],e[1]=r[1],e[2]=r[2],e[3]=-(r[0]*n[0]+r[1]*n[1]+r[2]*n[2]),e}function uw(t,e){e.classHierarchy.push("vtkAbstractMapper"),t.update=()=>{t.getInputData()},t.addClippingPlane=r=>r.isA("vtkPlane")?e.clippingPlanes.includes(r)?!1:(e.clippingPlanes.push(r),t.modified(),!0):!1,t.getNumberOfClippingPlanes=()=>e.clippingPlanes.length,t.removeAllClippingPlanes=()=>e.clippingPlanes.length===0?!1:(e.clippingPlanes.length=0,t.modified(),!0),t.removeClippingPlane=r=>{let n=e.clippingPlanes.indexOf(r);return n===-1?!1:(e.clippingPlanes.splice(n,1),t.modified(),!0)},t.getClippingPlanes=()=>e.clippingPlanes,t.getClippingPlanesMTime=()=>{let r=0;for(let n=0;n<e.clippingPlanes.length;n++)r=Math.max(r,e.clippingPlanes[n].getMTime());return r},t.setClippingPlanes=r=>{if(r)if(!Array.isArray(r))t.addClippingPlane(r);else{let n=r.length;for(let a=0;a<n&&a<6;a++)t.addClippingPlane(r[a])}},t.getClippingPlaneInCoords=(r,n,a)=>{if(n<0||n>=e.clippingPlanes?.length){vg(`Clipping plane index ${n} is out of range.`);return}let i=a||new Float64Array(4);return dg(e.clippingPlanes[n],Bi),L.invert(_i,r),L.transpose(_i,_i),He.transformMat4(i,Bi,_i),i},t.getClippingPlaneInDataCoords=(r,n,a)=>{let i=e.clippingPlanes;if(i){let s=i.length;if(n>=0&&n<s){dg(i[n],Bi),He.transformMat4(a,Bi,r);return}}vg(`Clipping plane index ${n} is out of range.`)}}var lw={clippingPlanes:[]};function pw(t,e,r={}){Object.assign(e,lw,r),w.obj(t,e),w.algo(t,e,1,0),e.clippingPlanes||(e.clippingPlanes=[]),uw(t,e)}var Tg={extend:pw};function gw(t,e){t.computeBounds=()=>{w.vtkErrorMacro("vtkAbstractMapper3D.computeBounds - NOT IMPLEMENTED")};let r=t.getBounds;t.getBounds=()=>(t.computeBounds(),r());let n=t.getBoundsByReference;t.getBoundsByReference=()=>(t.computeBounds(),n()),t.getCenter=()=>{let a=t.getBoundsByReference();return e.center=q.isValid(a)?q.getCenter(a):null,e.center?.slice()},t.getLength=()=>{let a=t.getBoundsByReference();return q.getDiagonalLength(a)}}var hw=t=>({bounds:[...q.INIT_BOUNDS],center:[0,0,0],viewSpecificProperties:{},...t});function vw(t,e,r={}){Object.assign(e,hw(r)),Tg.extend(t,e,r),w.setGet(t,e,["viewSpecificProperties"]),w.getArray(t,e,["bounds"],6),gw(t,e)}var Fi={extend:vw};var dw={MAGNITUDE:0,COMPONENT:1,RGBCOLORS:2},Ui={LUMINANCE:1,LUMINANCE_ALPHA:2,RGB:3,RGBA:4},Tw={LINEAR:0,LOG10:1},qn={VectorMode:dw,ScalarMappingTarget:Ui,Scale:Tw};var{ScalarMappingTarget:mg,Scale:mw,VectorMode:It}=qn,{VtkDataTypes:Sr}=Z,{ColorMode:Ni}=dn,{vtkErrorMacro:yg}=w;function yw(t){return t}function Sg(t){return Math.floor(t*255+.5)}function Sw(t,e){e.classHierarchy.push("vtkScalarsToColors"),t.setVectorModeToMagnitude=()=>t.setVectorMode(It.MAGNITUDE),t.setVectorModeToComponent=()=>t.setVectorMode(It.COMPONENT),t.setVectorModeToRGBColors=()=>t.setVectorMode(It.RGBCOLORS),t.build=()=>{},t.isOpaque=()=>!0,t.setAnnotations=(r,n)=>{if(!(r&&!n||!r&&n)){if(r&&n&&r.length!==n.length){yg("Values and annotations do not have the same number of tuples so ignoring");return}if(e.annotationArray=[],n&&r){let a=n.length;for(let i=0;i<a;i++)e.annotationArray.push({value:r[i],annotation:String(n[i])})}t.updateAnnotatedValueMap(),t.modified()}},t.setAnnotation=(r,n)=>{let a=t.checkForAnnotatedValue(r),i=!1;return a>=0?e.annotationArray[a].annotation!==n&&(e.annotationArray[a].annotation=n,i=!0):(e.annotationArray.push({value:r,annotation:n}),a=e.annotationArray.length-1,i=!0),i&&(t.updateAnnotatedValueMap(),t.modified()),a},t.getNumberOfAnnotatedValues=()=>e.annotationArray.length,t.getAnnotatedValue=r=>r<0||r>=e.annotationArray.length?null:e.annotationArray[r].value,t.getAnnotation=r=>e.annotationArray[r]===void 0?null:e.annotationArray[r].annotation,t.getAnnotatedValueIndex=r=>e.annotationArray.length?t.checkForAnnotatedValue(r):-1,t.removeAnnotation=r=>{let n=t.checkForAnnotatedValue(r),a=n>=0;return a&&(e.annotationArray.splice(n,1),t.updateAnnotatedValueMap(),t.modified()),a},t.resetAnnotations=()=>{e.annotationArray=[],e.annotatedValueMap=[],t.modified()},t.getAnnotationColor=(r,n)=>{if(e.indexedLookup){let a=t.getAnnotatedValueIndex(r);t.getIndexedColor(a,n)}else t.getColor(parseFloat(r),n),n[3]=1},t.checkForAnnotatedValue=r=>t.getAnnotatedValueIndexInternal(r),t.getAnnotatedValueIndexInternal=r=>{if(e.annotatedValueMap[r]!==void 0){let n=e.annotationArray.length;return e.annotatedValueMap[r]%n}return-1},t.getIndexedColor=(r,n)=>{n[0]=0,n[1]=0,n[2]=0,n[3]=0},t.updateAnnotatedValueMap=()=>{e.annotatedValueMap=[];let r=e.annotationArray.length;for(let n=0;n<r;n++)e.annotatedValueMap[e.annotationArray[n].value]=n},t.mapScalars=(r,n,a)=>{let i=r.getNumberOfComponents(),s=null;if(n===Ni.DEFAULT&&(r.getDataType()===Sr.UNSIGNED_CHAR||r.getDataType()===Sr.UNSIGNED_CHAR_CLAMPED)||n===Ni.DIRECT_SCALARS&&r)s=t.convertToRGBA(r,i,r.getNumberOfTuples());else{let o={type:"vtkDataArray",name:"temp",numberOfComponents:4,dataType:Sr.UNSIGNED_CHAR},c=w.newTypedArray(o.dataType,4*r.getNumberOfTuples());o.values=c,o.size=c.length,s=Z.newInstance(o);let f=a;f<0&&i>1?t.mapVectorsThroughTable(r,s,mg.RGBA,-1,-1):(f<0&&(f=0),f>=i&&(f=i-1),t.mapScalarsThroughTable(r,s,mg.RGBA,f))}return s},t.mapVectorsToMagnitude=(r,n,a)=>{let i=r.getNumberOfTuples(),s=r.getNumberOfComponents(),o=n.getData(),c=r.getData();for(let f=0;f<i;f++){let u=0;for(let g=0;g<a;g++)u+=c[f*s+g]*c[f*s+g];o[f]=Math.sqrt(u)}},t.mapVectorsThroughTable=(r,n,a,i,s)=>{let o=t.getVectorMode(),c=s,f=i,u=r.getNumberOfComponents();o===It.COMPONENT?(f===-1&&(f=t.getVectorComponent()),f<0&&(f=0),f>=u&&(f=u-1)):(c===-1&&(c=t.getVectorSize()),c<=0?(f=0,c=u):(f<0&&(f=0),f>=u&&(f=u-1),f+c>u&&(c=u-f)),o===It.MAGNITUDE&&(u===1||c===1)&&(o=It.COMPONENT));let g=0;switch(f>0&&(g=f),o){case It.COMPONENT:t.mapScalarsThroughTable(r,n,a,g);break;case It.RGBCOLORS:break;case It.MAGNITUDE:default:{let l=Z.newInstance({numberOfComponents:1,values:new Float32Array(r.getNumberOfTuples())});t.mapVectorsToMagnitude(r,l,c),t.mapScalarsThroughTable(l,n,a,0);break}}},t.luminanceToRGBA=(r,n,a,i)=>{let s=i(a),o=n.getData(),c=r.getData(),f=o.length,u=0,g=1,l=0;for(let h=u;h<f;h+=g){let y=i(o[h]);c[l*4]=y,c[l*4+1]=y,c[l*4+2]=y,c[l*4+3]=s,l++}},t.luminanceAlphaToRGBA=(r,n,a,i)=>{let s=n.getData(),o=r.getData(),c=s.length,f=0,u=2,g=0;for(let l=f;l<c;l+=u){let h=i(s[l]);o[g]=h,o[g+1]=h,o[g+2]=h,o[g+3]=i(s[l+1])*a,g+=4}},t.rGBToRGBA=(r,n,a,i)=>{let s=Sg(a),o=n.getData(),c=r.getData(),f=o.length,u=0,g=3,l=0;for(let h=u;h<f;h+=g)c[l*4]=i(o[h]),c[l*4+1]=i(o[h+1]),c[l*4+2]=i(o[h+2]),c[l*4+3]=s,l++},t.rGBAToRGBA=(r,n,a,i)=>{let s=n.getData(),o=r.getData(),c=s.length,f=0,u=4,g=0;for(let l=f;l<c;l+=u)o[g*4]=i(s[l]),o[g*4+1]=i(s[l+1]),o[g*4+2]=i(s[l+2]),o[g*4+3]=i(s[l+3])*a,g++},t.convertToRGBA=(r,n,a)=>{let{alpha:i}=e;if(n===4&&i>=1&&r.getDataType()===Sr.UNSIGNED_CHAR)return r;let s=Z.newInstance({numberOfComponents:4,empty:!0,size:4*a,dataType:Sr.UNSIGNED_CHAR});if(a<=0)return s;i=i>0?i:0,i=i<1?i:1;let o=yw;switch((r.getDataType()===Sr.FLOAT||r.getDataType()===Sr.DOUBLE)&&(o=Sg),n){case 1:t.luminanceToRGBA(s,r,i,o);break;case 2:t.luminanceAlphaToRGBA(s,r,o);break;case 3:t.rGBToRGBA(s,r,i,o);break;case 4:t.rGBAToRGBA(s,r,i,o);break;default:return yg("Cannot convert colors"),null}return s},t.usingLogScale=()=>!1,t.getNumberOfAvailableColors=()=>16777216,t.setRange=(r,n)=>t.setMappingRange(r,n),t.getRange=()=>t.getMappingRange(),t.areScalarsOpaque=(r,n,a)=>{if(!r)return t.isOpaque();let i=r.getNumberOfComponents();return n===Ni.DEFAULT&&r.getDataType()===Sr.UNSIGNED_CHAR||n===Ni.DIRECT_SCALARS?i===3||i===1?e.alpha>=1:r.getRange(i-1)[0]===255:!0}}var xw={alpha:1,vectorComponent:0,vectorSize:-1,vectorMode:It.COMPONENT,mappingRange:null,annotationArray:null,annotatedValueMap:null,indexedLookup:!1,scale:mw.LINEAR};function xg(t,e,r={}){Object.assign(e,xw,r),w.obj(t,e),e.mappingRange=[0,255],e.annotationArray=[],e.annotatedValueMap=[],w.setGet(t,e,["vectorSize","vectorComponent","vectorMode","alpha","indexedLookup"]),w.setArray(t,e,["mappingRange"],2),w.getArray(t,e,["mappingRange"]),Sw(t,e)}var Cw=w.newInstance(xg,"vtkScalarsToColors"),Zn={newInstance:Cw,extend:xg,...qn};var{vtkErrorMacro:Cg}=w,Og=0,wg=1,Ho=2;function Ow(t,e){e.classHierarchy.push("vtkLookupTable"),t.isOpaque=()=>{if(e.opaqueFlagBuildTime.getMTime()<t.getMTime()){let r=!0;e.nanColor[3]<1&&(r=0),e.useBelowRangeColor&&e.belowRangeColor[3]<1&&(r=0),e.useAboveRangeColor&&e.aboveRangeColor[3]<1&&(r=0);for(let n=3;n<e.table.length&&r;n+=4)e.table[n]<255&&(r=!1);e.opaqueFlag=r,e.opaqueFlagBuildTime.modified()}return e.opaqueFlag},t.usingLogScale=()=>!1,t.getNumberOfAvailableColors=()=>e.table.length/4-3,t.linearIndexLookup=(r,n)=>{let a=0,i=Number(r);return i<n.range[0]?a=n.maxIndex+Og+1.5:i>n.range[1]?a=n.maxIndex+wg+1.5:(a=(i+n.shift)*n.scale,a=a<n.maxIndex?a:n.maxIndex),Math.floor(a)},t.linearLookup=(r,n,a)=>{let i=0;Lr(r)?i=Math.floor(a.maxIndex+1.5+Ho):i=t.linearIndexLookup(r,a);let s=4*i;return n.slice(s,s+4)},t.indexedLookupFunction=(r,n,a)=>{let i=t.getAnnotatedValueIndexInternal(r);i===-1&&(i=e.numberOfColors+Ho);let s=4*i;return[n[s],n[s+1],n[s+2],n[s+3]]},t.lookupShiftAndScale=(r,n)=>{n.shift=-r[0],n.scale=Number.MAX_VALUE,r[1]>r[0]&&(n.scale=(n.maxIndex+1)/(r[1]-r[0]))},t.mapScalarsThroughTable=(r,n,a,i)=>{let s=t.linearLookup;e.indexedLookup&&(s=t.indexedLookupFunction);let o=t.getMappingRange(),c={maxIndex:t.getNumberOfColors()-1,range:o,shift:0,scale:0};t.lookupShiftAndScale(o,c);let f=t.getAlpha(),u=r.getNumberOfTuples(),g=r.getNumberOfComponents(),l=n.getData(),h=r.getData();if(f>=1){if(a===Ui.RGBA)for(let y=0;y<u;y++){let p=s(h[y*g+i],e.table,c);l[y*4]=p[0],l[y*4+1]=p[1],l[y*4+2]=p[2],l[y*4+3]=p[3]}}else if(a===Ui.RGBA)for(let y=0;y<u;y++){let p=s(h[y*g+i],e.table,c);l[y*4]=p[0],l[y*4+1]=p[1],l[y*4+2]=p[2],l[y*4+3]=Math.floor(p[3]*f+.5)}},t.forceBuild=()=>{let r=0,n=0,a=0,i=0,s=e.numberOfColors-1;s&&(r=(e.hueRange[1]-e.hueRange[0])/s,n=(e.saturationRange[1]-e.saturationRange[0])/s,a=(e.valueRange[1]-e.valueRange[0])/s,i=(e.alphaRange[1]-e.alphaRange[0])/s),e.table.length=4*s+16;let o=[],c=[];for(let f=0;f<=s;f++)o[0]=e.hueRange[0]+f*r,o[1]=e.saturationRange[0]+f*n,o[2]=e.valueRange[0]+f*a,Qt(o,c),c[3]=e.alphaRange[0]+f*i,e.table[f*4]=c[0]*255+.5,e.table[f*4+1]=c[1]*255+.5,e.table[f*4+2]=c[2]*255+.5,e.table[f*4+3]=c[3]*255+.5;t.buildSpecialColors(),e.buildTime.modified()},t.setTable=r=>{if(Array.isArray(r)){let a=r[0].length;e.numberOfColors=r.length;let i=4-a,s=0;for(let o=0;o<e.numberOfColors;o++)e.table[o*4]=255,e.table[o*4+1]=255,e.table[o*4+2]=255,e.table[o*4+3]=255;for(let o=0;o<r.length;o++){let c=r[o];for(let f=0;f<a;f++)e.table[s++]=c[f];s+=i}return t.buildSpecialColors(),e.insertTime.modified(),t.modified(),!0}if(r.getNumberOfComponents()!==4)return Cg("Expected 4 components for RGBA colors"),!1;if(r.getDataType()!==re.UNSIGNED_CHAR)return Cg("Expected unsigned char values for RGBA colors"),!1;e.numberOfColors=r.getNumberOfTuples();let n=r.getData();e.table.length=n.length;for(let a=0;a<n.length;a++)e.table[a]=n[a];return t.buildSpecialColors(),e.insertTime.modified(),t.modified(),!0},t.buildSpecialColors=()=>{let{numberOfColors:r}=e,n=e.table,a=(r+Og)*4;e.useBelowRangeColor||r===0?(n[a]=e.belowRangeColor[0]*255+.5,n[a+1]=e.belowRangeColor[1]*255+.5,n[a+2]=e.belowRangeColor[2]*255+.5,n[a+3]=e.belowRangeColor[3]*255+.5):(n[a]=n[0],n[a+1]=n[1],n[a+2]=n[2],n[a+3]=n[3]),a=(r+wg)*4,e.useAboveRangeColor||r===0?(n[a]=e.aboveRangeColor[0]*255+.5,n[a+1]=e.aboveRangeColor[1]*255+.5,n[a+2]=e.aboveRangeColor[2]*255+.5,n[a+3]=e.aboveRangeColor[3]*255+.5):(n[a]=n[4*(r-1)+0],n[a+1]=n[4*(r-1)+1],n[a+2]=n[4*(r-1)+2],n[a+3]=n[4*(r-1)+3]),a=(r+Ho)*4,n[a]=e.nanColor[0]*255+.5,n[a+1]=e.nanColor[1]*255+.5,n[a+2]=e.nanColor[2]*255+.5,n[a+3]=e.nanColor[3]*255+.5},t.build=()=>{(e.table.length<1||t.getMTime()>e.buildTime.getMTime()&&e.insertTime.getMTime()<=e.buildTime.getMTime())&&t.forceBuild()},e.table.length>0&&(t.buildSpecialColors(),e.insertTime.modified())}var ww={numberOfColors:256,hueRange:[0,.66667],saturationRange:[1,1],valueRange:[1,1],alphaRange:[1,1],nanColor:[.5,0,0,1],belowRangeColor:[0,0,0,1],aboveRangeColor:[1,1,1,1],useAboveRangeColor:!1,useBelowRangeColor:!1,alpha:1};function Rg(t,e,r={}){Object.assign(e,ww,r),Zn.extend(t,e,r),e.table||(e.table=[]),e.buildTime={},w.obj(e.buildTime),e.opaqueFlagBuildTime={},w.obj(e.opaqueFlagBuildTime,{mtime:0}),e.insertTime={},w.obj(e.insertTime,{mtime:0}),w.get(t,e,["buildTime"]),w.setGet(t,e,["numberOfColors","useAboveRangeColor","useBelowRangeColor"]),w.setArray(t,e,["alphaRange","hueRange","saturationRange","valueRange"],2),w.setArray(t,e,["nanColor","belowRangeColor","aboveRangeColor"],4),w.getArray(t,e,["hueRange","saturationRange","valueRange","alphaRange","nanColor","belowRangeColor","aboveRangeColor"]),Ow(t,e)}var Rw=w.newInstance(Rg,"vtkLookupTable"),Eg={newInstance:Rw,extend:Rg};var{ColorMode:Gi,ScalarMode:Hr,GetArray:Qn}=dn,{VectorMode:Ew}=qn,{VtkDataTypes:Mw}=Z;function Dw(t,e){let r=t[1]%2===0?1:-1;if(t[0]+=r,t[0]>=e[0]||t[0]<0){let n=t[2]%2===0?1:-1;t[0]-=r,t[1]+=n,(t[1]>=e[1]||t[1]<0)&&(t[1]-=n,t[2]++)}}function Vw(t,e){return t[0]+e[0]*(t[1]+e[1]*t[2])}function Mg(t,e,r){let n=Math.floor(e),a=n%(2*r[0]),i,s;a<r[0]?(t[0]=a,i=1,s=t[0]===r[0]-1):(t[0]=2*r[0]-1-a,i=-1,s=t[0]===0);let o=Math.floor(n/r[0]),c=o%(2*r[1]),f,u;c<r[1]?(t[1]=c,f=1,u=t[1]===r[1]-1):(t[1]=2*r[1]-1-c,f=-1,u=t[1]===0),t[2]=Math.floor(o/r[1]);let g=e-n;s?u?t[2]+=g:t[1]+=f*g:t[0]+=i*g,t[0]=(t[0]+.5)/r[0],t[1]=(t[1]+.5)/r[1],t[2]=(t[2]+.5)/r[2]}var Dg=new WeakMap;function Vg(t,e,r,n,a,i,s){let o=new Array(arguments.length);for(let V=0;V<arguments.length;++V){let U=arguments[V];o[V]=U.getMTime?.()??U}let c=o.join("/"),f=Dg.get(t);if(f&&f.stringHash===c)return f.textureCoordinates;let u=(r[1]-r[0])/(a-1),[g,l]=[r[0]-u,r[1]+u],h=g-.5*u,y=1/(l-g+u),p=g,m=(a+1)/(l-g),d=t.getData(),x=t.getNumberOfTuples(),T=t.getNumberOfComponents(),v=e<0||e>=T,C=i[2]<=1?2:3,O=Z.newInstance({numberOfComponents:C,values:new Float32Array(x*C)}),M=O.getData(),S=[0,0,0];Mg(S,a+2,i);let E=0,R=0,D=[.5,.5,.5];for(let V=0;V<x;++V){let U;if(v){let B=0;for(let _=0;_<T;++_){let N=Number(d[E+_]);B+=N*N}U=Math.sqrt(B)}else U=Number(d[E+e]);if(n&&(U=Math.log10(U)),E+=T,Lr(U))D[0]=S[0],D[1]=S[1],D[2]=S[2];else if(s){let B=(U-p)*m;B<1?B=0:B>a&&(B=a+1),Mg(D,B,i)}else{D[1]=.49;let B=(U-h)*y;B>1e3?D[0]=1e3:B<-1e3?D[0]=-1e3:D[0]=B}for(let B=0;B<C;++B)M[R++]=D[B]}return Dg.set(t,{stringHash:c,textureCoordinates:O}),O}function Lw(t,e){t.createDefaultLookupTable=()=>{e.lookupTable=Eg.newInstance()},t.getColorModeAsString=()=>w.enumToString(Gi,e.colorMode),t.setColorModeToDefault=()=>t.setColorMode(0),t.setColorModeToMapScalars=()=>t.setColorMode(1),t.setColorModeToDirectScalars=()=>t.setColorMode(2),t.getScalarModeAsString=()=>w.enumToString(Hr,e.scalarMode),t.setScalarModeToDefault=()=>t.setScalarMode(0),t.setScalarModeToUsePointData=()=>t.setScalarMode(1),t.setScalarModeToUseCellData=()=>t.setScalarMode(2),t.setScalarModeToUsePointFieldData=()=>t.setScalarMode(3),t.setScalarModeToUseCellFieldData=()=>t.setScalarMode(4),t.setScalarModeToUseFieldData=()=>t.setScalarMode(5),t.getAbstractScalars=(r,n,a,i,s)=>{if(!r||!e.scalarVisibility)return{scalars:null,cellFlag:!1};let o=null,c=!1;if(n===Hr.DEFAULT)o=r.getPointData().getScalars(),o||(o=r.getCellData().getScalars(),c=!0);else if(n===Hr.USE_POINT_DATA){let f=r.getPointData();a===Qn.BY_ID?o=f.getArrayByIndex(i):s&&(o=f.getArrayByName(s)),o||(o=f.getScalars())}else if(n===Hr.USE_CELL_DATA){let f=r.getCellData();c=!0,a===Qn.BY_ID?o=f.getArrayByIndex(i):s&&(o=f.getArrayByName(s)),o||(o=f.getScalars())}else if(n===Hr.USE_POINT_FIELD_DATA){let f=r.getPointData();a===Qn.BY_ID?o=f.getArrayByIndex(i):o=f.getArrayByName(s)}else if(n===Hr.USE_CELL_FIELD_DATA){let f=r.getCellData();c=!0,a===Qn.BY_ID?o=f.getArrayByIndex(i):o=f.getArrayByName(s)}else if(n===Hr.USE_FIELD_DATA){let f=r.getFieldData();a===Qn.BY_ID?o=f.getArrayByIndex(i):o=f.getArrayByName(s)}return{scalars:o,cellFlag:c}},t.mapScalars=(r,n)=>{let{scalars:a,cellFlag:i}=t.getAbstractScalars(r,e.scalarMode,e.arrayAccessMode,e.arrayId,e.colorByArrayName);if(e.areScalarsMappedFromCells=i,!a){e.colorCoordinates=null,e.colorTextureMap=null,e.colorMapColors=null;return}let s=`${t.getMTime()}${a.getMTime()}${n}`;if(e.colorBuildString!==s){if(e.useLookupTableScalarRange||t.getLookupTable().setRange(e.scalarRange[0],e.scalarRange[1]),t.canUseTextureMapForColoring(a,i))e.mapScalarsToTexture(a,i,n);else{e.colorCoordinates=null,e.colorTextureMap=null;let o=t.getLookupTable();o&&(o.build(),e.colorMapColors=o.mapScalars(a,e.colorMode,e.fieldDataTupleId))}e.colorBuildString=`${t.getMTime()}${a.getMTime()}${n}`}},e.mapScalarsToTexture=(r,n,a)=>{let i=e.lookupTable.getRange(),s=e.lookupTable.usingLogScale(),o=e.lookupTable.getAlpha(),c=s?[Math.log10(i[0]),Math.log10(i[1])]:i;if(e.colorMapColors=null,e.colorTextureMap==null||t.getMTime()>e.colorTextureMap.getMTime()||e.lookupTable.getMTime()>e.colorTextureMap.getMTime()||e.lookupTable.getAlpha()!==a){e.lookupTable.setAlpha(a),e.colorTextureMap=null,e.lookupTable.build();let f=e.lookupTable.getNumberOfAvailableColors(),u=2048;e.numberOfColorsInRange=Math.min(Math.max(f,2),n?u**3-3:4094);let g=e.numberOfColorsInRange+3,l=e.numberOfColorsInRange+2,h=n?[Math.min(Math.ceil(g/1),u),Math.min(Math.ceil(g/u**1),u),Math.min(Math.ceil(g/u**2),u)]:[l,2,1],y=h[0]*h[1]*h[2],p=new Float64Array(y);p.fill(NaN);let m=e.numberOfColorsInRange,d=m+2,x=[0,0,0],T=c[0],v=c[1]-c[0];for(let M=0;M<d;++M){let S=Vw(x,h),E=T+v*(M-1)/(m-1);p[S]=s?10**E:E,Dw(x,h)}let C=Z.newInstance({numberOfComponents:1,values:p}),O=e.lookupTable.mapScalars(C,e.colorMode,0);e.colorTextureMap=Uo.newInstance(),e.colorTextureMap.setDimensions(h),e.colorTextureMap.getPointData().setScalars(O),e.lookupTable.setAlpha(o)}e.colorCoordinates=Vg(r,e.lookupTable.getVectorMode()===Ew.MAGNITUDE&&r.getNumberOfComponents()>1?-1:e.lookupTable.getVectorComponent(),c,s,e.numberOfColorsInRange,e.colorTextureMap.getDimensions(),n)},t.canUseTextureMapForColoring=(r,n)=>n&&e.colorMode!==Gi.DIRECT_SCALARS?!0:!(e.lookupTable&&e.lookupTable.getIndexedLookup()||!e.interpolateScalarsBeforeMapping||!r||e.colorMode===Gi.DEFAULT&&r.getDataType()===Mw.UNSIGNED_CHAR||e.colorMode===Gi.DIRECT_SCALARS),t.clearColorArrays=()=>{e.colorMapColors=null,e.colorCoordinates=null,e.colorTextureMap=null},t.getLookupTable=()=>(e.lookupTable||t.createDefaultLookupTable(),e.lookupTable),t.getMTime=()=>{let r=e.mtime;if(e.lookupTable!==null){let n=e.lookupTable.getMTime();r=n>r?n:r}return r}}var jo={colorMapColors:null,areScalarsMappedFromCells:!1,lookupTable:null,scalarVisibility:!0,scalarRange:[0,1],useLookupTableScalarRange:!1,colorMode:0,scalarMode:0,arrayAccessMode:1,colorByArrayName:null,fieldDataTupleId:-1,interpolateScalarsBeforeMapping:!1,colorCoordinates:null,colorTextureMap:null,numberOfColorsInRange:0};function _w(t,e){Object.keys(jo).forEach(r=>{if(e[r]===void 0){let n=jo[r];e[r]=Array.isArray(n)?n.slice():n}}),w.get(t,e,["areScalarsMappedFromCells","colorCoordinates","colorMapColors","colorTextureMap","numberOfColorsInRange"]),w.setGet(t,e,["colorByArrayName","arrayAccessMode","colorMode","fieldDataTupleId","interpolateScalarsBeforeMapping","lookupTable","scalarMode","scalarVisibility","useLookupTableScalarRange"]),w.setGetArray(t,e,["scalarRange"],2),Lw(t,e)}var Lg={implementScalarColoringMethods:_w,DEFAULT_VALUES:jo,getOrCreateColorTextureCoordinates:Vg};var xr={MIN_KNOWN_PASS:0,ACTOR_PASS:0,COMPOSITE_INDEX_PASS:1,ID_LOW24:2,ID_HIGH24:3,MAX_KNOWN_PASS:3},Po={PassTypes:xr};var{FieldAssociations:_g}=yt,{staticOffsetAPI:Bw,otherStaticMethods:Fw}=zs;function Jn(t){return()=>w.vtkErrorMacro(`vtkMapper::${t} - NOT IMPLEMENTED`)}function Uw(t,e){e.classHierarchy.push("vtkMapper"),t.computeBounds=()=>{let r=t.getInputData();r?(e.static||t.update(),q.setBounds(e.bounds,r.getBounds())):q.reset(e.bounds)},t.setForceCompileOnly=r=>{e.forceCompileOnly=r},t.setSelectionWebGLIdsToVTKIds=r=>{e.selectionWebGLIdsToVTKIds=r},t.getIsOpaque=()=>{let r=t.getInputData(),n=t.getAbstractScalars(r,e.scalarMode,e.arrayAccessMode,e.arrayId,e.colorByArrayName).scalars;if(!e.scalarVisibility||n==null)return!0;let a=t.getLookupTable();return a?(a.build(),a.areScalarsOpaque(n,e.colorMode,-1)):!0},t.getPrimitiveCount=()=>{let r=t.getInputData();return{points:r.getPoints().getNumberOfValues()/3,verts:r.getVerts().getNumberOfValues()-r.getVerts().getNumberOfCells(),lines:r.getLines().getNumberOfValues()-2*r.getLines().getNumberOfCells(),triangles:r.getPolys().getNumberOfValues()-3*r.getPolys().getNumberOfCells()}},t.acquireInvertibleLookupTable=Jn("AcquireInvertibleLookupTable"),t.valueToColor=Jn("ValueToColor"),t.colorToValue=Jn("ColorToValue"),t.useInvertibleColorFor=Jn("UseInvertibleColorFor"),t.clearInvertibleColor=Jn("ClearInvertibleColor"),t.processSelectorPixelBuffers=(r,n)=>{if(!r||!e.selectionWebGLIdsToVTKIds||!e.populateSelectionSettings)return;let a=r.getRawPixelBuffer(xr.ID_LOW24),i=r.getRawPixelBuffer(xr.ID_HIGH24),s=r.getCurrentPass(),o=r.getFieldAssociation(),c=null;o===_g.FIELD_ASSOCIATION_POINTS?c=e.selectionWebGLIdsToVTKIds.points:o===_g.FIELD_ASSOCIATION_CELLS&&(c=e.selectionWebGLIdsToVTKIds.cells),c&&n.forEach(f=>{if(s===xr.ID_LOW24){let u=0;i&&(u+=i[f],u*=256),u+=a[f+2],u*=256,u+=a[f+1],u*=256,u+=a[f];let g=c[u],l=r.getPixelBuffer(xr.ID_LOW24);l[f]=g&255,l[f+1]=(g&65280)>>8,l[f+2]=(g&16711680)>>16}else if(s===xr.ID_HIGH24&&i){let u=0;u+=i[f],u*=256,u+=a[f+2],u*=256,u+=a[f+1],u*=256,u+=a[f];let g=c[u],l=r.getPixelBuffer(xr.ID_HIGH24);l[f]=(g&4278190080)>>24}})}}var Nw={static:!1,renderTime:0,populateSelectionSettings:!0,selectionWebGLIdsToVTKIds:null,forceCompileOnly:0,useInvertibleColors:!1,invertibleScalars:null,customShaderAttributes:[],debugChannel:0};function Bg(t,e,r={}){Object.assign(e,Nw,r),Fi.extend(t,e,r),Lg.implementScalarColoringMethods(t,e),w.get(t,e,["selectionWebGLIdsToVTKIds"]),w.setGet(t,e,["populateSelectionSettings","renderTime","static","customShaderAttributes","debugChannel"]),zs.implementCoincidentTopologyMethods(t,e),Uw(t,e)}var Gw=w.newInstance(Bg,"vtkMapper"),x4={newInstance:Gw,extend:Bg,...Bw,...Fw,...dn};var kw={IS_START:0,IS_NONE:0,IS_ROTATE:1,IS_PAN:2,IS_SPIN:3,IS_DOLLY:4,IS_CAMERA_POSE:11,IS_WINDOW_LEVEL:1024,IS_SLICE:1025},ea={States:kw};var{vtkErrorMacro:bw,VOID:zw}=w;function Ww(t,e,r,n){return t.getRenderWindow().getViews()[0].worldToDisplay(e,r,n,t)}function Iw(t,e,r,n){return t.getRenderWindow().getViews()[0].displayToWorld(e,r,n,t)}var Hw={computeWorldToDisplay:Ww,computeDisplayToWorld:Iw};function jw(t,e){e.classHierarchy.push("vtkInteractorObserver");let r={...t};function n(){for(;e.subscribedEvents.length;)e.subscribedEvents.pop().unsubscribe()}function a(){Vi.handledEvents.forEach(i=>{t[`handle${i}`]&&e.subscribedEvents.push(e._interactor[`on${i}`](s=>e.processEvents?t[`handle${i}`](s):zw,e.priority))})}t.setInteractor=i=>{i!==e._interactor&&(n(),e._interactor=i,i&&e.enabled&&a(),t.modified())},t.setEnabled=i=>{i!==e.enabled&&(n(),i&&(e._interactor?a():bw(`
          The interactor must be set before subscribing to events
        `)),e.enabled=i,t.modified())},t.computeDisplayToWorld=(i,s,o,c)=>i?e._interactor.getView().displayToWorld(s,o,c,i):null,t.computeWorldToDisplay=(i,s,o,c)=>i?e._interactor.getView().worldToDisplay(s,o,c,i):null,t.setPriority=i=>{r.setPriority(i)&&e._interactor&&(n(),a())}}var Pw={enabled:!0,priority:0,processEvents:!0,subscribedEvents:[]};function Fg(t,e,r={}){Object.assign(e,Pw,r),w.obj(t,e),w.event(t,e,"InteractionEvent"),w.event(t,e,"StartInteractionEvent"),w.event(t,e,"EndInteractionEvent"),w.get(t,e,["_interactor","enabled"]),w.setGet(t,e,["priority","processEvents"]),w.moveToProtected(t,e,["interactor"]),jw(t,e)}var $w=w.newInstance(Fg,"vtkInteractorObserver"),Ug={newInstance:$w,extend:Fg,...Hw};var{States:Ht}=ea,$o={Rotate:Ht.IS_ROTATE,Pan:Ht.IS_PAN,Spin:Ht.IS_SPIN,Dolly:Ht.IS_DOLLY,CameraPose:Ht.IS_CAMERA_POSE,WindowLevel:Ht.IS_WINDOW_LEVEL,Slice:Ht.IS_SLICE};function Aw(t,e){e.classHierarchy.push("vtkInteractorStyle"),Object.keys($o).forEach(r=>{w.event(t,e,`Start${r}Event`),t[`start${r}`]=()=>{e.state===Ht.IS_NONE&&(e.state=$o[r],e._interactor.requestAnimation(t),t.invokeStartInteractionEvent({type:"StartInteractionEvent"}),t[`invokeStart${r}Event`]({type:`Start${r}Event`}))},w.event(t,e,`End${r}Event`),t[`end${r}`]=()=>{e.state===$o[r]&&(e.state=Ht.IS_NONE,e._interactor.cancelAnimation(t),t.invokeEndInteractionEvent({type:"EndInteractionEvent"}),t[`invokeEnd${r}Event`]({type:`End${r}Event`}),e._interactor.render())}}),e.getRenderer=r=>e.focusedRenderer||r.pokedRenderer,t.handleKeyPress=r=>{let n=e._interactor,a=null;switch(r.key){case"r":case"R":e.getRenderer(r).resetCamera(),n.render();break;case"w":case"W":a=e.getRenderer(r).getActors(),a.forEach(i=>{let s=i.getProperty();s.setRepresentationToWireframe&&s.setRepresentationToWireframe()}),n.render();break;case"s":case"S":a=e.getRenderer(r).getActors(),a.forEach(i=>{let s=i.getProperty();s.setRepresentationToSurface&&s.setRepresentationToSurface()}),n.render();break;case"v":case"V":a=e.getRenderer(r).getActors(),a.forEach(i=>{let s=i.getProperty();s.setRepresentationToPoints&&s.setRepresentationToPoints()}),n.render()}}}var Kw={state:Ht.IS_NONE,handleObservers:1,autoAdjustCameraClippingRange:1};function Ng(t,e,r={}){Object.assign(e,Kw,r),Ug.extend(t,e,r),w.setGet(t,e,["focusedRenderer"]),Aw(t,e)}var Xw=w.newInstance(Ng,"vtkInteractorStyle"),Gg={newInstance:Xw,extend:Ng,...ea};var{States:jt}=ea;function Yw(t,e){e.classHierarchy.push("vtkInteractorStyleTrackballCamera"),t.handleMouseMove=r=>{let n=r.position,a=e.getRenderer(r);switch(e.state){case jt.IS_ROTATE:t.handleMouseRotate(a,n),t.invokeInteractionEvent({type:"InteractionEvent"});break;case jt.IS_PAN:t.handleMousePan(a,n),t.invokeInteractionEvent({type:"InteractionEvent"});break;case jt.IS_DOLLY:e.wheelDolly||(t.handleMouseDolly(a,n),t.invokeInteractionEvent({type:"InteractionEvent"}));break;case jt.IS_SPIN:t.handleMouseSpin(a,n),t.invokeInteractionEvent({type:"InteractionEvent"})}e.previousPosition=n},t.handleButton3D=r=>{if(r&&r.pressed&&r.device===Ri.RightController&&(r.input===gn.Trigger||r.input===gn.TrackPad)){t.startCameraPose();return}r&&!r.pressed&&r.device===Ri.RightController&&(r.input===gn.Trigger||r.input===gn.TrackPad)&&e.state===jt.IS_CAMERA_POSE&&t.endCameraPose()},t.handleMove3D=r=>{switch(e.state){case jt.IS_CAMERA_POSE:t.updateCameraPose(r)}},t.updateCameraPose=r=>{let n=e.getRenderer(r).getActiveCamera(),a=n.getPhysicalTranslation(),i=.025*n.getPhysicalScale(),s=n.physicalOrientationToWorldDirection([r.orientation.x,r.orientation.y,r.orientation.z,r.orientation.w]);n.setPhysicalTranslation(a[0]+s[0]*i,a[1]+s[1]*i,a[2]+s[2]*i)},t.handleLeftButtonPress=r=>{e.previousPosition=r.position,r.shiftKey?r.controlKey||r.altKey?t.startDolly():t.startPan():r.controlKey||r.altKey?t.startSpin():t.startRotate()},t.handleLeftButtonRelease=()=>{switch(e.state){case jt.IS_DOLLY:t.endDolly();break;case jt.IS_PAN:t.endPan();break;case jt.IS_SPIN:t.endSpin();break;case jt.IS_ROTATE:t.endRotate()}},t.handleStartMouseWheel=()=>{e.wheelDolly=!0,t.startDolly()},t.handleEndMouseWheel=()=>{t.endDolly(),e.wheelDolly=!1},t.handleStartPinch=r=>{e.previousScale=r.scale,t.startDolly()},t.handleEndPinch=()=>{t.endDolly()},t.handleStartRotate=r=>{e.previousRotation=r.rotation,t.startRotate()},t.handleEndRotate=()=>{t.endRotate()},t.handleStartPan=r=>{e.previousTranslation=r.translation,t.startPan()},t.handleEndPan=()=>{t.endPan()},t.handlePinch=r=>{t.dollyByFactor(e.getRenderer(r),r.scale/e.previousScale),e.previousScale=r.scale},t.handlePan=r=>{let n=e.getRenderer(r).getActiveCamera(),a=n.getFocalPoint();a=t.computeWorldToDisplay(e.getRenderer(r),a[0],a[1],a[2]);let i=a[2],s=r.translation,o=e.previousTranslation,c=t.computeDisplayToWorld(e.getRenderer(r),a[0]+s[0]-o[0],a[1]+s[1]-o[1],i),f=t.computeDisplayToWorld(e.getRenderer(r),a[0],a[1],i),u=[];u[0]=f[0]-c[0],u[1]=f[1]-c[1],u[2]=f[2]-c[2],a=n.getFocalPoint();let g=n.getPosition();n.setFocalPoint(u[0]+a[0],u[1]+a[1],u[2]+a[2]),n.setPosition(u[0]+g[0],u[1]+g[1],u[2]+g[2]),e._interactor.getLightFollowCamera()&&e.getRenderer(r).updateLightsGeometryToFollowCamera(),n.orthogonalizeViewUp(),e.previousTranslation=r.translation},t.handleRotate=r=>{let n=e.getRenderer(r).getActiveCamera();n.roll(r.rotation-e.previousRotation),n.orthogonalizeViewUp(),e.previousRotation=r.rotation},t.handleMouseRotate=(r,n)=>{if(!e.previousPosition)return;let a=e._interactor,i=n.x-e.previousPosition.x,s=n.y-e.previousPosition.y,o=a.getView().getViewportSize(r),c=-.1,f=-.1;o[0]&&o[1]&&(c=-20/o[1],f=-20/o[0]);let u=i*f*e.motionFactor,g=s*c*e.motionFactor,l=r.getActiveCamera();!Number.isNaN(u)&&!Number.isNaN(g)&&(l.azimuth(u),l.elevation(g),l.orthogonalizeViewUp()),e.autoAdjustCameraClippingRange&&r.resetCameraClippingRange(),a.getLightFollowCamera()&&r.updateLightsGeometryToFollowCamera()},t.handleMouseSpin=(r,n)=>{if(!e.previousPosition)return;let a=e._interactor,i=r.getActiveCamera(),s=a.getView().getViewportCenter(r),o=qt(Math.atan2(e.previousPosition.y-s[1],e.previousPosition.x-s[0])),c=qt(Math.atan2(n.y-s[1],n.x-s[0]))-o;Number.isNaN(c)||(i.roll(c),i.orthogonalizeViewUp())},t.handleMousePan=(r,n)=>{if(!e.previousPosition)return;let a=r.getActiveCamera(),i=a.getFocalPoint();i=t.computeWorldToDisplay(r,i[0],i[1],i[2]);let s=i[2],o=t.computeDisplayToWorld(r,n.x,n.y,s),c=t.computeDisplayToWorld(r,e.previousPosition.x,e.previousPosition.y,s),f=[];f[0]=c[0]-o[0],f[1]=c[1]-o[1],f[2]=c[2]-o[2],i=a.getFocalPoint();let u=a.getPosition();a.setFocalPoint(f[0]+i[0],f[1]+i[1],f[2]+i[2]),a.setPosition(f[0]+u[0],f[1]+u[1],f[2]+u[2]),e._interactor.getLightFollowCamera()&&r.updateLightsGeometryToFollowCamera()},t.handleMouseDolly=(r,n)=>{if(!e.previousPosition)return;let a=n.y-e.previousPosition.y,i=e._interactor.getView().getViewportCenter(r),s=e.motionFactor*a/i[1];t.dollyByFactor(r,1.1**s)},t.handleMouseWheel=r=>{let n=Math.exp(-r.spinY/e.zoomFactor);t.dollyByFactor(e.getRenderer(r),n)},t.dollyByFactor=(r,n)=>{if(Number.isNaN(n))return;let a=r.getActiveCamera();a.getParallelProjection()?a.setParallelScale(a.getParallelScale()/n):(a.dolly(n),e.autoAdjustCameraClippingRange&&r.resetCameraClippingRange()),e._interactor.getLightFollowCamera()&&r.updateLightsGeometryToFollowCamera()}}var qw={motionFactor:10,zoomFactor:10,wheelDolly:!1};function kg(t,e,r={}){Object.assign(e,qw,r),Gg.extend(t,e,r),w.setGet(t,e,["motionFactor","zoomFactor"]),Yw(t,e)}var Zw=w.newInstance(kg,"vtkInteractorStyleTrackballCamera"),bg={newInstance:Zw,extend:kg};var{vtkDebugMacro:ki,vtkWarningMacro:Qw}=w,zg=!1;function Jw(t,e){e.classHierarchy.push("vtkCamera");let r=new Float64Array(3),n=new Float64Array([0,0,-1]),a=new Float64Array([0,1,0]),i=L.identity(new Float64Array(16)),s=L.identity(new Float64Array(16)),o=L.identity(new Float64Array(16)),c=new Float64Array(3),f=new Float64Array(3),u=new Float64Array(3),g=L.identity(new Float64Array(16)),l=L.identity(new Float64Array(16)),h=new Float64Array(3),y=new Float64Array(3);function p(){e.viewPlaneNormal[0]=-e.directionOfProjection[0],e.viewPlaneNormal[1]=-e.directionOfProjection[1],e.viewPlaneNormal[2]=-e.directionOfProjection[2]}t.orthogonalizeViewUp=()=>{t.getViewMatrix(i),e.viewUp[0]=i[4],e.viewUp[1]=i[5],e.viewUp[2]=i[6],t.modified()};let m=(T,v,C)=>T===e.position[0]&&v===e.position[1]&&C===e.position[2]?!1:(e.position[0]=T,e.position[1]=v,e.position[2]=C,!0);t.setPosition=(T,v,C)=>m(T,v,C)?(t.computeDistance(),t.modified(),!0):!1;let d=(T,v,C)=>T===e.focalPoint[0]&&v===e.focalPoint[1]&&C===e.focalPoint[2]?!1:(e.focalPoint[0]=T,e.focalPoint[1]=v,e.focalPoint[2]=C,!0);t.setFocalPoint=(T,v,C)=>d(T,v,C)?(t.computeDistance(),t.modified(),!0):!1,t.setPositionAndFocalPoint=(T,v)=>{let C=m(...T),O=d(...v);return C||O?(t.computeDistance(),t.modified(),!0):!1},t.setDistance=T=>{if(e.distance===T)return;e.distance=T,e.distance<1e-20&&(e.distance=1e-20,ki("Distance is set to minimum."));let v=e.directionOfProjection;e.focalPoint[0]=e.position[0]+v[0]*e.distance,e.focalPoint[1]=e.position[1]+v[1]*e.distance,e.focalPoint[2]=e.position[2]+v[2]*e.distance,t.modified()},t.computeDistance=()=>{let T=e.focalPoint[0]-e.position[0],v=e.focalPoint[1]-e.position[1],C=e.focalPoint[2]-e.position[2];if(e.distance=Math.sqrt(T*T+v*v+C*C),e.distance<1e-20){e.distance=1e-20,ki("Distance is set to minimum.");let O=e.directionOfProjection;e.focalPoint[0]=e.position[0]+O[0]*e.distance,e.focalPoint[1]=e.position[1]+O[1]*e.distance,e.focalPoint[2]=e.position[2]+O[2]*e.distance}e.directionOfProjection[0]=T/e.distance,e.directionOfProjection[1]=v/e.distance,e.directionOfProjection[2]=C/e.distance,p()},t.dolly=T=>{if(T<=0)return;let v=e.distance/T;t.setPosition(e.focalPoint[0]-v*e.directionOfProjection[0],e.focalPoint[1]-v*e.directionOfProjection[1],e.focalPoint[2]-v*e.directionOfProjection[2])},t.roll=T=>{let v=e.position,C=e.focalPoint,O=e.viewUp,M=new Float64Array([O[0],O[1],O[2],0]);L.identity(g);let S=new Float64Array([C[0]-v[0],C[1]-v[1],C[2]-v[2]]);L.rotate(g,g,ye(T),S),He.transformMat4(M,M,g),e.viewUp[0]=M[0],e.viewUp[1]=M[1],e.viewUp[2]=M[2],t.modified()},t.azimuth=T=>{let v=e.focalPoint;L.identity(l),L.translate(l,l,v),L.rotate(l,l,ye(T),e.viewUp),L.translate(l,l,[-v[0],-v[1],-v[2]]),W.transformMat4(h,e.position,l),t.setPosition(h[0],h[1],h[2])},t.yaw=T=>{let v=e.position;L.identity(l),L.translate(l,l,v),L.rotate(l,l,ye(T),e.viewUp),L.translate(l,l,[-v[0],-v[1],-v[2]]),W.transformMat4(y,e.focalPoint,l),t.setFocalPoint(y[0],y[1],y[2])},t.elevation=T=>{let v=e.focalPoint;t.getViewMatrix(i);let C=[-i[0],-i[1],-i[2]];L.identity(l),L.translate(l,l,v),L.rotate(l,l,ye(T),C),L.translate(l,l,[-v[0],-v[1],-v[2]]),W.transformMat4(h,e.position,l),t.setPosition(h[0],h[1],h[2])},t.pitch=T=>{let v=e.position;t.getViewMatrix(i);let C=[i[0],i[1],i[2]];L.identity(l),L.translate(l,l,v),L.rotate(l,l,ye(T),C),L.translate(l,l,[-v[0],-v[1],-v[2]]),W.transformMat4(y,e.focalPoint,l),t.setFocalPoint(...y)},t.zoom=T=>{T<=0||(e.parallelProjection?e.parallelScale/=T:e.viewAngle/=T,t.modified())},t.translate=(T,v,C)=>{let O=[T,v,C];Zt(e.position,O,e.position),Zt(e.focalPoint,O,e.focalPoint),t.computeDistance(),t.modified()},t.applyTransform=T=>{let v=[...e.viewUp,1],C=[],O=[],M=[];v[0]+=e.position[0],v[1]+=e.position[1],v[2]+=e.position[2],He.transformMat4(C,[...e.position,1],T),He.transformMat4(O,[...e.focalPoint,1],T),He.transformMat4(M,v,T),M[0]-=C[0],M[1]-=C[1],M[2]-=C[2],t.setPosition(...C.slice(0,3)),t.setFocalPoint(...O.slice(0,3)),t.setViewUp(...M.slice(0,3))},t.getThickness=()=>e.clippingRange[1]-e.clippingRange[0],t.setThickness=T=>{let v=T;v<1e-20&&(v=1e-20,ki("Thickness is set to minimum.")),t.setClippingRange(e.clippingRange[0],e.clippingRange[0]+v)},t.setThicknessFromFocalPoint=T=>{let v=T;v<1e-20&&(v=1e-20,ki("Thickness is set to minimum.")),t.setClippingRange(e.distance-v/2,e.distance+v/2)},t.setRoll=T=>{},t.getRoll=()=>{},t.setObliqueAngles=(T,v)=>{},t.getOrientation=()=>{},t.getOrientationWXYZ=()=>{},t.getFrustumPlanes=(T=1,v=new Float64Array(24))=>{let C=[[1,0,0,1],[-1,0,0,1],[0,1,0,1],[0,-1,0,1],[0,0,1,1],[0,0,-1,1]],O=t.getCompositeProjectionMatrix(T,-1,1);for(let M=0;M<6;M++)He.transformMat4(C[M],C[M],O),If(C[M]),v[4*M+0]=C[M][0],v[4*M+1]=C[M][1],v[4*M+2]=C[M][2],v[4*M+3]=C[M][3];return v},t.getCameraLightTransformMatrix=T=>(L.copy(T,e.cameraLightTransform),T),t.computeCameraLightTransform=()=>{t.getViewMatrix(i),L.invert(i,i),L.fromScaling(s,[e.distance,e.distance,e.distance]),L.multiply(i,i,s),L.identity(e.cameraLightTransform),L.translate(e.cameraLightTransform,i,[0,0,-1])},t.deepCopy=T=>{},t.physicalOrientationToWorldDirection=T=>{let v=Me.fromValues(T[0],T[1],T[2],T[3]),C=Me.create(),O=Me.fromValues(0,0,1,0);return Me.conjugate(C,v),Me.multiply(O,v,O),Me.multiply(O,O,C),[O[0],O[1],O[2]]},t.getPhysicalToWorldMatrix=T=>{t.getWorldToPhysicalMatrix(T),L.invert(T,T)},t.getWorldToPhysicalMatrix=T=>{L.identity(T);let v=[3];Ge(e.physicalViewNorth,e.physicalViewUp,v),T[0]=v[0],T[1]=v[1],T[2]=v[2],T[4]=e.physicalViewUp[0],T[5]=e.physicalViewUp[1],T[6]=e.physicalViewUp[2],T[8]=-e.physicalViewNorth[0],T[9]=-e.physicalViewNorth[1],T[10]=-e.physicalViewNorth[2],L.transpose(T,T),W.set(c,1/e.physicalScale,1/e.physicalScale,1/e.physicalScale),L.scale(T,T,c),L.translate(T,T,e.physicalTranslation)},t.computeViewParametersFromViewMatrix=T=>{L.invert(i,T),W.transformMat4(c,r,i),t.computeDistance();let v=e.distance;t.setPosition(c[0],c[1],c[2]),W.transformMat4(f,n,i),W.subtract(f,f,c),W.normalize(f,f),t.setDirectionOfProjection(f[0],f[1],f[2]),W.transformMat4(u,a,i),W.subtract(u,u,c),W.normalize(u,u),t.setViewUp(u[0],u[1],u[2]),t.setDistance(v)},t.computeViewParametersFromPhysicalMatrix=T=>{t.getWorldToPhysicalMatrix(i),L.multiply(i,T,i),t.computeViewParametersFromViewMatrix(i)},t.setViewMatrix=T=>{e.viewMatrix=T,e.viewMatrix&&(t.computeViewParametersFromViewMatrix(e.viewMatrix),L.transpose(e.viewMatrix,e.viewMatrix))};let x=T=>(e.modelTransformMatrix&&(L.transpose(o,e.modelTransformMatrix),L.multiply(T,o,T)),T);t.getViewMatrix=(T=new Float64Array(16))=>e.viewMatrix?(L.copy(T,e.viewMatrix),x(T)):(L.lookAt(T,e.position,e.focalPoint,e.viewUp),L.transpose(T,T),x(T)),t.setProjectionMatrix=T=>(zg||(zg=!0,Qw("setProjectionMatrix() is deprecated. Use setExplicitProjectionMatrix() instead.")),t.setExplicitProjectionMatrix(T)),t.getProjectionMatrix=(T,v,C,O=new Float64Array(16))=>{let M=O;if(e.explicitProjectionMatrix){let R=1/e.physicalScale;return W.set(c,R,R,R),L.copy(M,e.explicitProjectionMatrix),L.scale(M,M,c),L.transpose(M,M),M}L.identity(M),L.identity(i);let S=e.clippingRange[1]-e.clippingRange[0],E=[e.clippingRange[0]+(v+1)*S/2,e.clippingRange[0]+(C+1)*S/2];if(e.parallelProjection){let R=e.parallelScale*T,D=e.parallelScale,V=(e.windowCenter[0]-1)*R,U=(e.windowCenter[0]+1)*R,B=(e.windowCenter[1]-1)*D,_=(e.windowCenter[1]+1)*D;L.ortho(i,V,U,B,_,E[0],E[1]),L.transpose(i,i)}else{if(e.useOffAxisProjection)throw new Error("Off-Axis projection is not supported at this time");{let R=Math.tan(ye(e.viewAngle)/2),D,V;e.useHorizontalViewAngle===!0?(D=e.clippingRange[0]*R,V=e.clippingRange[0]*R/T):(D=e.clippingRange[0]*R*T,V=e.clippingRange[0]*R);let U=(e.windowCenter[0]-1)*D,B=(e.windowCenter[0]+1)*D,_=(e.windowCenter[1]-1)*V,N=(e.windowCenter[1]+1)*V,k=E[0],F=E[1];i[0]=2*k/(B-U),i[5]=2*k/(N-_),i[2]=(U+B)/(B-U),i[6]=(_+N)/(N-_),i[10]=-(k+F)/(F-k),i[14]=-1,i[11]=-2*k*F/(F-k),i[15]=0}}return L.copy(M,i),M},t.getCompositeProjectionMatrix=(T,v,C)=>{let O=t.getViewMatrix(),M=t.getProjectionMatrix(T,v,C);return L.multiply(M,O,M),M},t.setDirectionOfProjection=(T,v,C)=>{if(e.directionOfProjection[0]===T&&e.directionOfProjection[1]===v&&e.directionOfProjection[2]===C)return;e.directionOfProjection[0]=T,e.directionOfProjection[1]=v,e.directionOfProjection[2]=C;let O=e.directionOfProjection;e.focalPoint[0]=e.position[0]+O[0]*e.distance,e.focalPoint[1]=e.position[1]+O[1]*e.distance,e.focalPoint[2]=e.position[2]+O[2]*e.distance,p()},t.setDeviceAngles=(T,v,C,O)=>{let M=[3];Ge(e.physicalViewNorth,e.physicalViewUp,M);let S=L.identity(new Float64Array(16));L.rotate(S,S,ye(T),e.physicalViewUp),L.rotate(S,S,ye(v),M),L.rotate(S,S,ye(C),e.physicalViewNorth),L.rotate(S,S,ye(-O),e.physicalViewUp);let E=new Float64Array([-e.physicalViewUp[0],-e.physicalViewUp[1],-e.physicalViewUp[2]]),R=new Float64Array(e.physicalViewNorth);W.transformMat4(E,E,S),W.transformMat4(R,R,S),t.setDirectionOfProjection(E[0],E[1],E[2]),t.setViewUp(R[0],R[1],R[2]),t.modified()},t.setOrientationWXYZ=(T,v,C,O)=>{let M=L.identity(new Float64Array(16));if(T!==0&&(v!==0||C!==0||O!==0)){let R=ye(T),D=Me.create();Me.setAxisAngle(D,[v,C,O],R),L.fromQuat(M,D)}let S=new Float64Array(3);W.transformMat4(S,[0,0,-1],M);let E=new Float64Array(3);W.transformMat4(E,[0,1,0],M),t.setDirectionOfProjection(...S),t.setViewUp(...E),t.modified()},t.computeClippingRange=T=>{let v=null,C=null;v=e.viewPlaneNormal,C=e.position;let O=-v[0],M=-v[1],S=-v[2],E=-(O*C[0]+M*C[1]+S*C[2]),R=[O*T[0]+M*T[2]+S*T[4]+E,1e-18];for(let D=0;D<2;D++)for(let V=0;V<2;V++)for(let U=0;U<2;U++){let B=O*T[U]+M*T[2+V]+S*T[4+D]+E;R[0]=B<R[0]?B:R[0],R[1]=B>R[1]?B:R[1]}return R}}var eR={position:[0,0,1],focalPoint:[0,0,0],viewUp:[0,1,0],directionOfProjection:[0,0,-1],parallelProjection:!1,useHorizontalViewAngle:!1,viewAngle:30,parallelScale:1,clippingRange:[.01,1000.01],windowCenter:[0,0],viewPlaneNormal:[0,0,1],useOffAxisProjection:!1,screenBottomLeft:[-.5,-.5,-.5],screenBottomRight:[.5,-.5,-.5],screenTopRight:[.5,.5,-.5],freezeFocalPoint:!1,explicitProjectionMatrix:null,viewMatrix:null,modelTransformMatrix:null,cameraLightTransform:L.create(),physicalTranslation:[0,0,0],physicalScale:1,physicalViewUp:[0,1,0],physicalViewNorth:[0,0,-1]};function Wg(t,e,r={}){Object.assign(e,eR,r),w.obj(t,e),w.get(t,e,["distance"]),w.setGet(t,e,["parallelProjection","useHorizontalViewAngle","viewAngle","parallelScale","useOffAxisProjection","freezeFocalPoint","physicalScale","modelTransformMatrix","explicitProjectionMatrix"]),w.getArray(t,e,["directionOfProjection","viewPlaneNormal","position","focalPoint"]),w.setGetArray(t,e,["clippingRange","windowCenter"],2),w.setGetArray(t,e,["viewUp","screenBottomLeft","screenBottomRight","screenTopRight","physicalTranslation","physicalViewUp","physicalViewNorth"],3),Jw(t,e)}var tR=w.newInstance(Wg,"vtkCamera"),Ig={newInstance:tR,extend:Wg};var rR=["HeadLight","CameraLight","SceneLight"];function nR(t,e){e.classHierarchy.push("vtkLight");let r=new Float64Array(3);t.getTransformedPosition=()=>(e.transformMatrix?W.transformMat4(r,e.position,e.transformMatrix):W.set(r,e.position[0],e.position[1],e.position[2]),r),t.getTransformedFocalPoint=()=>(e.transformMatrix?W.transformMat4(r,e.focalPoint,e.transformMatrix):W.set(r,e.focalPoint[0],e.focalPoint[1],e.focalPoint[2]),r),t.getDirection=()=>(e.directionMTime<e.mtime&&(W.sub(e.direction,e.focalPoint,e.position),et(e.direction),e.directionMTime=e.mtime),e.direction),t.setDirection=n=>{let a=new Float64Array(3);W.sub(a,e.position,n),e.focalPoint=a},t.setDirectionAngle=(n,a)=>{let i=ye(n),s=ye(a);t.setPosition(Math.cos(i)*Math.sin(s),Math.sin(i),Math.cos(i)*Math.cos(s)),t.setFocalPoint(0,0,0),t.setPositional(0)},t.setLightTypeToHeadLight=()=>{t.setLightType("HeadLight")},t.setLightTypeToCameraLight=()=>{t.setLightType("CameraLight")},t.setLightTypeToSceneLight=()=>{t.setTransformMatrix(null),t.setLightType("SceneLight")},t.lightTypeIsHeadLight=()=>e.lightType==="HeadLight",t.lightTypeIsSceneLight=()=>e.lightType==="SceneLight",t.lightTypeIsCameraLight=()=>e.lightType==="CameraLight"}var aR={switch:!0,intensity:1,color:[1,1,1],position:[0,0,1],focalPoint:[0,0,0],positional:!1,exponent:1,coneAngle:30,coneFalloff:5,attenuationValues:[1,0,0],transformMatrix:null,lightType:"SceneLight",shadowAttenuation:1,direction:[0,0,0],directionMTime:0};function Hg(t,e,r={}){Object.assign(e,aR,r),w.obj(t,e),w.setGet(t,e,["intensity","switch","positional","exponent","coneAngle","coneFalloff","transformMatrix","lightType","shadowAttenuation","attenuationValues"]),w.setGetArray(t,e,["color","position","focalPoint","attenuationValues"],3),nR(t,e)}var iR=w.newInstance(Hg,"vtkLight"),jg={newInstance:iR,extend:Hg,LIGHT_TYPES:rR};var{vtkErrorMacro:bi}=w;function sR(t){return()=>bi(`vtkViewport::${t} - NOT IMPLEMENTED`)}function oR(t,e){e.classHierarchy.push("vtkViewport"),t.getViewProps=()=>e.props,t.hasViewProp=n=>e.props.includes(n),t.addViewProp=n=>{n&&!t.hasViewProp(n)&&e.props.push(n)},t.removeViewProp=n=>{let a=e.props.filter(i=>i!==n);e.props.length!==a.length&&(e.props=a)},t.removeAllViewProps=()=>{e.props=[]};function r(n,a=[]){a.push(n);let i=n.getNestedProps();if(i&&i.length)for(let s=0;s<i.length;s++)r(i[s],a);return a}t.getViewPropsWithNestedProps=()=>{let n=[];e.actors2D=[];for(let a=0;a<e.props.length;a++){let i=e.props[a].getActors2D();i&&(!Array.isArray(i)||i.length>0)?e.actors2D=e.actors2D.concat(i):r(e.props[a],n)}return e.actors2D.sort((a,i)=>a.getLayerNumber()-i.getLayerNumber()),n=n.concat(e.actors2D),n},t.addActor2D=t.addViewProp,t.removeActor2D=n=>{t.removeViewProp(n)},t.getActors2D=()=>(e.actors2D=[],e.props.forEach(n=>{e.actors2D=e.actors2D.concat(n.getActors2D())}),e.actors2D),t.displayToView=()=>bi("call displayToView on your view instead"),t.viewToDisplay=()=>bi("callviewtodisplay on your view instead"),t.getSize=()=>bi("call getSize on your View instead"),t.normalizedDisplayToProjection=(n,a,i)=>{let s=t.normalizedDisplayToNormalizedViewport(n,a,i);return t.normalizedViewportToProjection(s[0],s[1],s[2])},t.normalizedDisplayToNormalizedViewport=(n,a,i)=>{let s=[e.viewport[2]-e.viewport[0],e.viewport[3]-e.viewport[1]];return[(n-e.viewport[0])/s[0],(a-e.viewport[1])/s[1],i]},t.normalizedViewportToProjection=(n,a,i)=>[n*2-1,a*2-1,i*2-1],t.projectionToNormalizedDisplay=(n,a,i)=>{let s=t.projectionToNormalizedViewport(n,a,i);return t.normalizedViewportToNormalizedDisplay(s[0],s[1],s[2])},t.normalizedViewportToNormalizedDisplay=(n,a,i)=>{let s=[e.viewport[2]-e.viewport[0],e.viewport[3]-e.viewport[1]];return[n*s[0]+e.viewport[0],a*s[1]+e.viewport[1],i]},t.projectionToNormalizedViewport=(n,a,i)=>[(n+1)*.5,(a+1)*.5,(i+1)*.5],t.PickPropFrom=sR("PickPropFrom")}var cR={background:[0,0,0],background2:[.2,.2,.2],gradientBackground:!1,viewport:[0,0,1,1],aspect:[1,1],pixelAspect:[1,1],props:[],actors2D:[]};function Pg(t,e,r={}){Object.assign(e,cR,r),w.obj(t,e),w.event(t,e,"event"),w.setGet(t,e,["gradientBackground"]),w.setGetArray(t,e,["viewport"],4),w.setGetArray(t,e,["background","background2"],3),oR(t,e)}var fR=w.newInstance(Pg,"vtkViewport"),$g={newInstance:fR,extend:Pg};var{vtkDebugMacro:ta,vtkErrorMacro:Cr,vtkWarningMacro:uR}=we;function Ag(t){return()=>Cr(`vtkRenderer::${t} - NOT IMPLEMENTED`)}function Kg(t,e){let r=[];for(let n=0;n<t.length;n++){let a=e(t[n]);if(Array.isArray(a))for(let i=0;i<a.length;i++)r.push(a[i]);else r.push(a)}return r}var lR=t=>t.getActors(),pR=t=>t.getVolumes();function gR(t,e){e.classHierarchy.push("vtkRenderer");let r={type:"ComputeVisiblePropBoundsEvent",renderer:t},n={type:"ResetCameraClippingRangeEvent",renderer:t},a={type:"ResetCameraEvent",renderer:t};function i(s,o){return o?q.transformBounds(s,o,[]):s}t.updateCamera=()=>(e.activeCamera||(ta("No cameras are on, creating one."),t.getActiveCameraAndResetIfCreated()),e.activeCamera.render(t),!0),t.updateLightsGeometryToFollowCamera=()=>{let s=t.getActiveCameraAndResetIfCreated();e.lights.forEach(o=>{o.lightTypeIsSceneLight()||(o.lightTypeIsHeadLight()?(o.setPositionFrom(s.getPositionByReference()),o.setFocalPointFrom(s.getFocalPointByReference()),o.modified(s.getMTime())):o.lightTypeIsCameraLight()?o.setTransformMatrix(s.getCameraLightTransformMatrix(L.create())):Cr("light has unknown light type",o.get()))})},t.updateLightGeometry=()=>e.lightFollowCamera?t.updateLightsGeometryToFollowCamera():!0,t.allocateTime=Ag("allocateTime"),t.updateGeometry=Ag("updateGeometry"),t.getVTKWindow=()=>e._renderWindow,t.setLayer=s=>{ta(t.getClassName(),t,"setting Layer to ",s),e.layer!==s&&(e.layer=s,t.modified()),t.setPreserveColorBuffer(!!s)},t.setActiveCamera=s=>e.activeCamera===s?!1:(e.activeCamera=s,t.modified(),t.invokeEvent({type:"ActiveCameraEvent",camera:s}),!0),t.makeCamera=()=>{let s=Ig.newInstance();return t.invokeEvent({type:"CreateCameraEvent",camera:s}),s},t.getActiveCamera=()=>(e.activeCamera||(e.activeCamera=t.makeCamera()),e.activeCamera),t.getActiveCameraAndResetIfCreated=()=>(e.activeCamera||(t.getActiveCamera(),t.resetCamera()),e.activeCamera),t.getActors=()=>(e.actors=Kg(e.props,lR),e.actors),t.addActor=t.addViewProp,t.removeActor=s=>{e.actors=e.actors.filter(o=>o!==s),t.removeViewProp(s),t.modified()},t.removeAllActors=()=>{t.getActors().forEach(s=>{t.removeViewProp(s)}),e.actors=[],t.modified()},t.getVolumes=()=>(e.volumes=Kg(e.props,pR),e.volumes),t.addVolume=t.addViewProp,t.removeVolume=s=>{e.volumes=e.volumes.filter(o=>o!==s),t.removeViewProp(s),t.modified()},t.removeAllVolumes=()=>{t.getVolumes().forEach(s=>{t.removeViewProp(s)}),e.volumes=[],t.modified()},t.hasLight=s=>e.lights.includes(s),t.addLight=s=>{s&&!t.hasLight(s)&&(e.lights.push(s),t.modified())},t.removeLight=s=>{e.lights=e.lights.filter(o=>o!==s),t.modified()},t.removeAllLights=()=>{e.lights=[],t.modified()},t.setLightCollection=s=>{e.lights=s,t.modified()},t.makeLight=jg.newInstance,t.createLight=()=>{e.automaticLightCreation&&(e._createdLight&&(t.removeLight(e._createdLight),e._createdLight.delete(),e._createdLight=null),e._createdLight=t.makeLight(),t.addLight(e._createdLight),e._createdLight.setLightTypeToHeadLight(),e._createdLight.setPosition(t.getActiveCamera().getPosition()),e._createdLight.setFocalPoint(t.getActiveCamera().getFocalPoint()))},t.normalizedDisplayToWorld=(s,o,c,f)=>{let u=t.normalizedDisplayToProjection(s,o,c);return u=t.projectionToView(u[0],u[1],u[2],f),t.viewToWorld(u[0],u[1],u[2])},t.worldToNormalizedDisplay=(s,o,c,f)=>{let u=t.worldToView(s,o,c);return u=t.viewToProjection(u[0],u[1],u[2],f),t.projectionToNormalizedDisplay(u[0],u[1],u[2])},t.viewToWorld=(s,o,c)=>{if(e.activeCamera===null)return Cr("ViewToWorld: no active camera, cannot compute view to world, returning 0,0,0"),[0,0,0];let f=e.activeCamera.getViewMatrix();L.invert(f,f),L.transpose(f,f);let u=new Float64Array([s,o,c]);return W.transformMat4(u,u,f),u},t.projectionToView=(s,o,c,f)=>{if(e.activeCamera===null)return Cr("ProjectionToView: no active camera, cannot compute projection to view, returning 0,0,0"),[0,0,0];let u=e.activeCamera.getProjectionMatrix(f,-1,1);L.invert(u,u),L.transpose(u,u);let g=new Float64Array([s,o,c]);return W.transformMat4(g,g,u),g},t.worldToView=(s,o,c)=>{if(e.activeCamera===null)return Cr("WorldToView: no active camera, cannot compute view to world, returning 0,0,0"),[0,0,0];let f=e.activeCamera.getViewMatrix();L.transpose(f,f);let u=new Float64Array([s,o,c]);return W.transformMat4(u,u,f),u},t.viewToProjection=(s,o,c,f)=>{if(e.activeCamera===null)return Cr("ViewToProjection: no active camera, cannot compute view to projection, returning 0,0,0"),[0,0,0];let u=e.activeCamera.getProjectionMatrix(f,-1,1);L.transpose(u,u);let g=new Float64Array([s,o,c]);return W.transformMat4(g,g,u),g},t.computeVisiblePropBounds=()=>{e.allBounds[0]=q.INIT_BOUNDS[0],e.allBounds[1]=q.INIT_BOUNDS[1],e.allBounds[2]=q.INIT_BOUNDS[2],e.allBounds[3]=q.INIT_BOUNDS[3],e.allBounds[4]=q.INIT_BOUNDS[4],e.allBounds[5]=q.INIT_BOUNDS[5];let s=!0;t.invokeEvent(r);for(let o=0;o<e.props.length;++o){let c=e.props[o];if(c.getVisibility()&&c.getUseBounds()){let f=c.getBounds();f&&Un(f)&&(s=!1,f[0]<e.allBounds[0]&&(e.allBounds[0]=f[0]),f[1]>e.allBounds[1]&&(e.allBounds[1]=f[1]),f[2]<e.allBounds[2]&&(e.allBounds[2]=f[2]),f[3]>e.allBounds[3]&&(e.allBounds[3]=f[3]),f[4]<e.allBounds[4]&&(e.allBounds[4]=f[4]),f[5]>e.allBounds[5]&&(e.allBounds[5]=f[5]))}}return s&&(Fn(e.allBounds),ta("Can't compute bounds, no 3D props are visible")),e.allBounds},t.resetCamera=(s=null)=>{let o=s||t.computeVisiblePropBounds();if(!Un(o))return ta("Cannot reset camera!"),!1;let c=null;if(t.getActiveCamera())c=e.activeCamera.getViewPlaneNormal();else return Cr("Trying to reset non-existent camera"),!1;e.activeCamera.setViewAngle(30);let f=i(o,e.activeCamera.getModelTransformMatrix()),u=q.getCenter(f),g=q.getLength(f,0),l=q.getLength(f,1),h=q.getLength(f,2);g*=g,l*=l,h*=h;let y=g+l+h;y=y===0?1:y,y=Math.sqrt(y)*.5;let p=ye(e.activeCamera.getViewAngle()),m=y,d=y/Math.sin(p*.5),x=e.activeCamera.getViewUp();return Math.abs(ee(x,c))>.999&&(uR("Resetting view-up since view plane normal is parallel"),e.activeCamera.setViewUp(-x[2],x[0],x[1])),e.activeCamera.setFocalPoint(u[0],u[1],u[2]),e.activeCamera.setPosition(u[0]+d*c[0],u[1]+d*c[1],u[2]+d*c[2]),t.resetCameraClippingRange(o),e.activeCamera.setParallelScale(m),e.activeCamera.setPhysicalScale(y),e.activeCamera.setPhysicalTranslation(-u[0],-u[1],-u[2]),t.invokeEvent(a),!0},t.resetCameraClippingRange=(s=null)=>{let o=s||t.computeVisiblePropBounds();if(!Un(o))return ta("Cannot reset camera clipping range!"),!1;if(t.getActiveCameraAndResetIfCreated(),!e.activeCamera)return Cr("Trying to reset clipping range of non-existent camera"),!1;let c=e.activeCamera.computeClippingRange(i(o,e.activeCamera.getModelTransformMatrix())),f=0;if(e.activeCamera.getParallelProjection())f=.2*e.activeCamera.getParallelScale();else{let u=ye(e.activeCamera.getViewAngle());f=.2*Math.tan(u/2)*c[1]}return c[1]-c[0]<f&&(f=f-c[1]+c[0],c[1]+=f/2,c[0]-=f/2),c[0]<0&&(c[0]=0),c[0]=.99*c[0]-(c[1]-c[0])*e.clippingRangeExpansion,c[1]=1.01*c[1]+(c[1]-c[0])*e.clippingRangeExpansion,c[0]=c[0]>=c[1]?.01*c[1]:c[0],e.nearClippingPlaneTolerance||(e.nearClippingPlaneTolerance=.01),c[0]<e.nearClippingPlaneTolerance*c[1]&&(c[0]=e.nearClippingPlaneTolerance*c[1]),e.activeCamera.setClippingRange(c[0],c[1]),t.invokeEvent(n),!1},t.setRenderWindow=s=>{s!==e._renderWindow&&(e._vtkWindow=s,e._renderWindow=s)},t.visibleActorCount=()=>e.props.filter(s=>s.getVisibility()).length,t.visibleVolumeCount=t.visibleActorCount,t.getMTime=()=>{let s=e.mtime,o=e.activeCamera?e.activeCamera.getMTime():0;o>s&&(s=o);let c=e._createdLight?e._createdLight.getMTime():0;return c>s&&(s=c),s},t.getTransparent=()=>!!e.preserveColorBuffer,t.isActiveCameraCreated=()=>!!e.activeCamera}var hR={pickedProp:null,activeCamera:null,allBounds:[],ambient:[1,1,1],allocatedRenderTime:100,timeFactor:1,automaticLightCreation:!0,twoSidedLighting:!0,lastRenderTimeInSeconds:-1,renderWindow:null,lights:[],actors:[],volumes:[],lightFollowCamera:!0,numberOfPropsRendered:0,propArray:null,pathArray:null,layer:0,preserveColorBuffer:!1,preserveDepthBuffer:!1,computeVisiblePropBounds:Fs(),interactive:!0,nearClippingPlaneTolerance:0,clippingRangeExpansion:.05,erase:!0,draw:!0,useShadows:!1,useDepthPeeling:!1,occlusionRatio:0,maximumNumberOfPeels:4,selector:null,delegate:null,texturedBackground:!1,backgroundTexture:null,environmentTexture:null,environmentTextureDiffuseStrength:1,environmentTextureSpecularStrength:1,useEnvironmentTextureAsBackground:!1,pass:0};function Xg(t,e,r={}){for(Object.assign(e,hR,r),$g.extend(t,e,r),e.background||(e.background=[0,0,0,1]);e.background.length<3;)e.background.push(0);e.background.length===3&&e.background.push(1),Ee(t,e,["_renderWindow","allocatedRenderTime","timeFactor","lastRenderTimeInSeconds","numberOfPropsRendered","lastRenderingUsedDepthPeeling","selector"]),de(t,e,["twoSidedLighting","lightFollowCamera","automaticLightCreation","erase","draw","nearClippingPlaneTolerance","clippingRangeExpansion","backingStore","interactive","layer","preserveColorBuffer","preserveDepthBuffer","useDepthPeeling","occlusionRatio","maximumNumberOfPeels","delegate","backgroundTexture","texturedBackground","environmentTexture","environmentTextureDiffuseStrength","environmentTextureSpecularStrength","useEnvironmentTextureAsBackground","useShadows","pass"]),Kt(t,e,["actors","volumes","lights"]),ma(t,e,["background"],4,1),or(t,e,["renderWindow"]),gR(t,e)}var vR=ue(Xg,"vtkRenderer"),Yg={newInstance:vR,extend:Xg};var dR="WebGL",zi=Object.create(null);function ra(t,e){zi[t]=e}function TR(){return Object.keys(zi)}function qg(t,e={}){return zi[t]&&zi[t](e)}function mR(t,e){e.classHierarchy.push("vtkRenderWindow"),t.addRenderer=r=>{t.hasRenderer(r)||(r.setRenderWindow(t),e.renderers.push(r),t.modified())},t.removeRenderer=r=>{e.renderers=e.renderers.filter(n=>n!==r),t.modified()},t.hasRenderer=r=>e.renderers.indexOf(r)!==-1,t.newAPISpecificView=(r,n={})=>qg(r||e.defaultViewAPI,n),t.addView=r=>{t.hasView(r)||(r.setRenderable(t),e._views.push(r),t.modified())},t.removeView=r=>{e._views=e._views.filter(n=>n!==r),t.modified()},t.hasView=r=>e._views.indexOf(r)!==-1,t.preRender=()=>{e.renderers.forEach(r=>{r.isActiveCameraCreated()||r.resetCamera()})},t.render=()=>{t.preRender(),e.interactor?e.interactor.render():e._views.forEach(r=>r.traverseAllPasses())},t.getStatistics=()=>{let r={propCount:0,invisiblePropCount:0,gpuMemoryMB:0};return e._views.forEach(n=>{n.getGraphicsMemoryInfo&&(r.gpuMemoryMB+=n.getGraphicsMemoryInfo()/1e6)}),e.renderers.forEach(n=>{let a=n.getViewProps(),i=e._views[0].getViewNodeFor(n);a.forEach(s=>{if(s.getVisibility()){r.propCount+=1;let o=s.getMapper&&s.getMapper();if(o&&o.getPrimitiveCount){let c=i.getViewNodeFor(o);if(c){c.getAllocatedGPUMemoryInBytes&&(r.gpuMemoryMB+=c.getAllocatedGPUMemoryInBytes()/1e6);let f=o.getPrimitiveCount();Object.keys(f).forEach(u=>{r[u]||(r[u]=0),r[u]+=f[u]})}}}else r.invisiblePropCount+=1})}),r.str=Object.keys(r).map(n=>`${n}: ${r[n]}`).join(`
`),r},t.captureImages=(r="image/png",n={})=>(w.setImmediate(t.render),e._views.map(a=>a.captureNextImage?a.captureNextImage(r,n):void 0).filter(a=>!!a)),t.addRenderWindow=r=>e.childRenderWindows.includes(r)?!1:(e.childRenderWindows.push(r),t.modified(),!0),t.removeRenderWindow=r=>{let n=e.childRenderWindows.findIndex(a=>a===r);return n<0?!1:(e.childRenderWindows.splice(n,1),t.modified(),!0)}}var yR={defaultViewAPI:dR,renderers:[],views:[],interactor:null,neverRendered:!0,numberOfLayers:1,childRenderWindows:[]};function Zg(t,e,r={}){Object.assign(e,yR,r),w.obj(t,e),w.setGet(t,e,["interactor","numberOfLayers","_views","defaultViewAPI"]),w.get(t,e,["neverRendered"]),w.getArray(t,e,["renderers","childRenderWindows"]),w.moveToProtected(t,e,["views"]),w.event(t,e,"completion"),mR(t,e)}var SR=w.newInstance(Zg,"vtkRenderWindow"),Qg={newInstance:SR,extend:Zg,registerViewConstructor:ra,listViewAPIs:TR,newAPISpecificView:qg};function xR(t,e){e.classHierarchy.push("vtkRenderPass"),t.getOperation=()=>e.currentOperation,t.setCurrentOperation=r=>{e.currentOperation=r,e.currentTraverseOperation=`traverse${w.capitalize(e.currentOperation)}`},t.getTraverseOperation=()=>e.currentTraverseOperation,t.getCaptureDelegateOutput=()=>!1,t.traverse=(r,n=null)=>{e.deleted||(e._currentParent=n,e.preDelegateOperations.forEach(a=>{t.setCurrentOperation(a),r.traverse(t)}),e.delegates.forEach(a=>{a.traverse(r,t)}),e.postDelegateOperations.forEach(a=>{t.setCurrentOperation(a),r.traverse(t)}))},t.releaseGraphicsResources=r=>{e.delegates.filter(n=>!n.isDeleted()).forEach(n=>n.releaseGraphicsResources?.(r))}}var CR={delegates:[],currentOperation:null,preDelegateOperations:[],postDelegateOperations:[],currentParent:null};function Jg(t,e,r={}){Object.assign(e,CR,r),w.obj(t,e),w.get(t,e,["currentOperation"]),w.setGet(t,e,["delegates","_currentParent","preDelegateOperations","postDelegateOperations"]),w.moveToProtected(t,e,["currentParent"]),xR(t,e)}var OR=w.newInstance(Jg,"vtkRenderPass"),Xe={newInstance:OR,extend:Jg};var{Representation:wR}=vr,{vtkErrorMacro:eh}=w;function RR(t){t.Fragment=H.substitute(t.Fragment,"//VTK::RenderPassFragmentShader::Impl",`
      float weight = gl_FragData[0].a * pow(max(1.1 - gl_FragCoord.z, 0.0), 2.0);
      gl_FragData[0] = vec4(gl_FragData[0].rgb*weight, gl_FragData[0].a);
      gl_FragData[1].r = weight;
    `,!1).result}var ER=`//VTK::System::Dec

in vec2 tcoord;

uniform sampler2D translucentRTexture;
uniform sampler2D translucentRGBATexture;

// the output of this shader
//VTK::Output::Dec

void main()
{
  vec4 t1Color = texture(translucentRGBATexture, tcoord);
  float t2Color = texture(translucentRTexture, tcoord).r;
  gl_FragData[0] = vec4(t1Color.rgb/max(t2Color,0.01), 1.0 - t1Color.a);
}
`;function MR(t,e){e.classHierarchy.push("vtkOpenGLOrderIndependentTranslucentPass"),t.createVertexBuffer=()=>{let r=new Float32Array([-1,-1,-1,1,-1,-1,-1,1,-1,1,1,-1]),n=new Float32Array([0,0,1,0,0,1,1,1]),a=new Uint16Array([4,0,1,3,2]),i=Z.newInstance({numberOfComponents:3,values:r});i.setName("points");let s=Z.newInstance({numberOfComponents:2,values:n});s.setName("tcoords");let o=je.newInstance({values:a});e.tris.getCABO().createVBO(o,"polys",wR.SURFACE,{points:i,tcoords:s,cellOffset:0,forceFlatten:!0}),e.VBOBuildTime.modified()},t.createFramebuffer=r=>{let n=r.getSize(),a=r.getContext();e.framebuffer=gr.newInstance(),e.framebuffer.setOpenGLRenderWindow(r),e.framebuffer.create(...n),e.framebuffer.saveCurrentBindingsAndBuffers(),e.framebuffer.bind(),e.translucentRGBATexture=Se.newInstance(),e.translucentRGBATexture.setInternalFormat(a.RGBA16F),e.translucentRGBATexture.setFormat(a.RGBA),e.translucentRGBATexture.setOpenGLDataType(a.HALF_FLOAT),e.translucentRGBATexture.setOpenGLRenderWindow(r),e.translucentRGBATexture.create2DFromRaw({width:n[0],height:n[1],numComps:4,dataType:"Float32Array",data:null}),e.translucentRTexture=Se.newInstance(),e.translucentRTexture.setInternalFormat(a.R16F),e.translucentRTexture.setFormat(a.RED),e.translucentRTexture.setOpenGLDataType(a.HALF_FLOAT),e.translucentRTexture.setOpenGLRenderWindow(r),e.translucentRTexture.create2DFromRaw({width:n[0],height:n[1],numComps:1,dataType:"Float32Array",data:null}),e.translucentZTexture=Se.newInstance(),e.translucentZTexture.setOpenGLRenderWindow(r),e.translucentZTexture.createDepthFromRaw({width:n[0],height:n[1],dataType:"Float32Array",data:null}),e.framebuffer.setColorBuffer(e.translucentRGBATexture,0),e.framebuffer.setColorBuffer(e.translucentRTexture,1),e.framebuffer.setDepthBuffer(e.translucentZTexture)},t.createCopyShader=r=>{e.copyShader=r.getShaderCache().readyShaderProgramArray(["//VTK::System::Dec","attribute vec4 vertexDC;","attribute vec2 tcoordTC;","varying vec2 tcoord;","void main() { tcoord = tcoordTC; gl_Position = vertexDC; }"].join(`
`),ER,"")},t.createVBO=r=>{let n=r.getContext();e.tris.setOpenGLRenderWindow(r),t.createVertexBuffer();let a=e.copyShader;e.tris.getCABO().bind(),e.copyVAO.addAttributeArray(a,e.tris.getCABO(),"vertexDC",e.tris.getCABO().getVertexOffset(),e.tris.getCABO().getStride(),n.FLOAT,3,n.FALSE)||eh("Error setting vertexDC in copy shader VAO."),e.copyVAO.addAttributeArray(a,e.tris.getCABO(),"tcoordTC",e.tris.getCABO().getTCoordOffset(),e.tris.getCABO().getStride(),n.FLOAT,2,n.FALSE)||eh("Error setting vertexDC in copy shader VAO.")},t.traverse=(r,n,a)=>{if(e.deleted)return;let i=r.getSize(),s=r.getContext();if(e._supported=!1,n.getSelector()||!s||!s.getExtension("EXT_color_buffer_half_float")&&!s.getExtension("EXT_color_buffer_float")){t.setCurrentOperation("translucentPass"),n.traverse(t);return}if(e._supported=!0,e.framebuffer===null)t.createFramebuffer(r);else{let u=e.framebuffer.getSize();u===null||u[0]!==i[0]||u[1]!==i[1]?(e.framebuffer.releaseGraphicsResources(),e.translucentRGBATexture.releaseGraphicsResources(r),e.translucentRTexture.releaseGraphicsResources(r),e.translucentZTexture.releaseGraphicsResources(r),t.createFramebuffer(r)):(e.framebuffer.saveCurrentBindingsAndBuffers(),e.framebuffer.bind())}s.drawBuffers([s.COLOR_ATTACHMENT0]),s.clearBufferfv(s.COLOR,0,[0,0,0,0]),s.clearBufferfv(s.DEPTH,0,[1]),s.colorMask(!1,!1,!1,!1),a.getOpaqueActorCount()>0&&(a.setCurrentOperation("opaqueZBufferPass"),n.traverse(a)),s.colorMask(!0,!0,!0,!0),s.drawBuffers([s.COLOR_ATTACHMENT0,s.COLOR_ATTACHMENT1]),s.viewport(0,0,i[0],i[1]),s.scissor(0,0,i[0],i[1]),s.clearBufferfv(s.COLOR,0,[0,0,0,1]),s.clearBufferfv(s.COLOR,1,[0,0,0,0]),s.enable(s.DEPTH_TEST),s.enable(s.BLEND),s.blendFuncSeparate(s.ONE,s.ONE,s.ZERO,s.ONE_MINUS_SRC_ALPHA),t.setCurrentOperation("translucentPass"),n.traverse(t),s.drawBuffers([s.NONE]),e.framebuffer.restorePreviousBindingsAndBuffers(),e.copyShader===null?t.createCopyShader(r):r.getShaderCache().readyShaderProgram(e.copyShader),e.copyVAO||(e.copyVAO=en.newInstance(),e.copyVAO.setOpenGLRenderWindow(r)),e.copyVAO.bind(),e.VBOBuildTime.getMTime()<t.getMTime()&&t.createVBO(r);let o=s.isEnabled(s.CULL_FACE),c=o?s.getParameter(s.CULL_FACE_MODE):null;r.disableCullFace(),s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA),s.depthMask(!1),s.depthFunc(s.ALWAYS),s.viewport(0,0,i[0],i[1]),s.scissor(0,0,i[0],i[1]),e.translucentRGBATexture.activate(),e.copyShader.setUniformi("translucentRGBATexture",e.translucentRGBATexture.getTextureUnit()),e.translucentRTexture.activate(),e.copyShader.setUniformi("translucentRTexture",e.translucentRTexture.getTextureUnit()),s.drawArrays(s.TRIANGLES,0,e.tris.getCABO().getElementCount()),s.depthMask(!0),s.depthFunc(s.LEQUAL),o&&(r.enableCullFace(),r.setCullFaceMode(c)),e.translucentRGBATexture.deactivate(),e.translucentRTexture.deactivate();let f=n.getTiledSizeAndOrigin();s.scissor(f.lowerLeftU,f.lowerLeftV,f.usize,f.vsize),s.viewport(f.lowerLeftU,f.lowerLeftV,f.usize,f.vsize)},t.getShaderReplacement=()=>e._supported?RR:null,t.releaseGraphicsResources=w.chain(r=>{e.framebuffer&&(e.framebuffer.releaseGraphicsResources(r),e.framebuffer=null),e.translucentRGBATexture&&(e.translucentRGBATexture.releaseGraphicsResources(r),e.translucentRGBATexture=null),e.translucentRTexture&&(e.translucentRTexture.releaseGraphicsResources(r),e.translucentRTexture=null),e.translucentZTexture&&(e.translucentZTexture.releaseGraphicsResources(r),e.translucentZTexture=null),e.copyVAO&&(e.copyVAO.releaseGraphicsResources(r),e.copyVAO=null),e.copyShader=null,e.tris.releaseGraphicsResources(r),t.modified()},t.releaseGraphicsResources)}var DR={framebuffer:null,copyShader:null,tris:null};function th(t,e,r={}){Object.assign(e,DR,r),Xe.extend(t,e,r),e.VBOBuildTime={},w.obj(e.VBOBuildTime,{mtime:0}),e.tris=Nt.newInstance(),w.get(t,e,["framebuffer"]),MR(t,e)}var VR=w.newInstance(th,"vtkOpenGLOrderIndependentTranslucentPass"),rh={newInstance:VR,extend:th};function LR(t,e){e.classHierarchy.push("vtkForwardPass"),t.traverse=(r,n=null)=>{if(e.deleted)return;e._currentParent=n,t.setCurrentOperation("buildPass"),r.traverse(t);let a=r.getRenderable().getNumberOfLayers(),i=r.getRenderable().getRenderersByReference();for(let s=0;s<a;s++)for(let o=0;o<i.length;o++){let c=i[o];if(c.getDraw()&&c.getLayer()===s){let f=r.getViewNodeFor(c);if(e.opaqueActorCount=0,e.translucentActorCount=0,e.volumeCount=0,e.overlayActorCount=0,t.setCurrentOperation("queryPass"),f.traverse(t),(e.opaqueActorCount>0||e.translucentActorCount>0)&&e.volumeCount>0||e.depthRequested){let u=r.getFramebufferSize();e.framebuffer===null&&(e.framebuffer=gr.newInstance()),e.framebuffer.setOpenGLRenderWindow(r),e.framebuffer.saveCurrentBindingsAndBuffers();let g=e.framebuffer.getSize();(g===null||g[0]!==u[0]||g[1]!==u[1])&&(e.framebuffer.create(u[0],u[1]),e.framebuffer.populateFramebuffer()),e.framebuffer.bind(),t.setCurrentOperation("zBufferPass"),f.traverse(t),e.framebuffer.restorePreviousBindingsAndBuffers(),e.depthRequested=!1}t.setCurrentOperation("cameraPass"),f.traverse(t),e.opaqueActorCount>0&&(t.setCurrentOperation("opaquePass"),f.traverse(t)),e.translucentActorCount>0&&(e.translucentPass||(e.translucentPass=rh.newInstance()),e.translucentPass.traverse(r,f,t)),e.volumeCount>0&&(t.setCurrentOperation("volumePass"),f.traverse(t)),e.overlayActorCount>0&&(t.setCurrentOperation("overlayPass"),f.traverse(t))}}},t.releaseGraphicsResources=w.chain(r=>{e.framebuffer&&(e.framebuffer.releaseGraphicsResources(),e.framebuffer=null),e.translucentPass?.releaseGraphicsResources(r)},t.releaseGraphicsResources),t.getZBufferTexture=()=>e.framebuffer?e.framebuffer.getColorBuffersByReference()[0]:null,t.requestDepth=()=>{e.depthRequested=!0},t.incrementOpaqueActorCount=()=>e.opaqueActorCount++,t.incrementTranslucentActorCount=()=>e.translucentActorCount++,t.incrementVolumeCount=()=>e.volumeCount++,t.incrementOverlayActorCount=()=>e.overlayActorCount++}var _R={opaqueActorCount:0,translucentActorCount:0,volumeCount:0,overlayActorCount:0,framebuffer:null,depthRequested:!1};function nh(t,e,r={}){Object.assign(e,_R,r),Xe.extend(t,e,r),w.get(t,e,["framebuffer","opaqueActorCount","translucentActorCount","volumeCount"]),LR(t,e)}var BR=w.newInstance(nh,"vtkForwardPass"),ah={newInstance:BR,extend:nh};var FR={GLOBALIDS:0,PEDIGREEIDS:1,VALUES:2,INDICES:3,FRUSTUM:4,LOCATIONS:5,THRESHOLDS:6,BLOCKS:7,QUERY:8},UR={CELL:0,POINT:1,FIELD:2,VERTEX:3,EDGE:4,ROW:5},ih={SelectionContent:FR,SelectionField:UR};function NR(t,e){e.classHierarchy.push("vtkSelectionNode"),t.getBounds=()=>e.points.getBounds()}var GR={contentType:-1,fieldType:-1,properties:null,selectionList:[]};function sh(t,e,r={}){Object.assign(e,GR,r),w.obj(t,e),e.properties={},w.setGet(t,e,["contentType","fieldType","properties","selectionList"]),NR(t,e)}var kR=w.newInstance(sh,"vtkSelectionNode"),Tn={newInstance:kR,extend:sh,...ih};var{FieldAssociations:bR}=yt;function zR(t,e){e.classHierarchy.push("vtkHardwareSelector"),t.getSourceDataAsync=async(r,n,a,i,s)=>{},t.selectAsync=async(r,n,a,i,s)=>{let o=await t.getSourceDataAsync(r,n,a,i,s);return o?o.generateSelection(n,a,i,s):[]}}var WR={fieldAssociation:bR.FIELD_ASSOCIATION_CELLS,captureZValues:!1};function oh(t,e,r={}){Object.assign(e,WR,r),w.obj(t,e),w.setGet(t,e,["fieldAssociation","captureZValues"]),zR(t,e)}var IR=w.newInstance(oh,"vtkHardwareSelector"),Wi={newInstance:IR,extend:oh};var{PassTypes:Ne}=Po,{SelectionContent:HR,SelectionField:ch}=Tn,{FieldAssociations:aa}=yt,{vtkErrorMacro:fh,vtkDebugMacro:na}=w,Or=1;function uh(t){return`${t.propID} ${t.compositeID}`}function lh(t,e,r,n){return r?r[(e*(n[2]-n[0]+1)+t)*4+3]:0}function ar(t,e,r,n,a=null){if(!r)return 0;let i=(e*(n[2]-n[0]+1)+t)*4,s=r[i],o=r[i+1];return(r[i+2]*256+o)*256+s}function ph(t,e){let r=e;return r<<=24,r|=t,r}function mn(t,e,r,n){let a=r<0?0:r;if(a===0){if(n[0]=e[0],n[1]=e[1],e[0]<t.area[0]||e[0]>t.area[2]||e[1]<t.area[1]||e[1]>t.area[3])return null;let c=[e[0]-t.area[0],e[1]-t.area[1]],f=ar(c[0],c[1],t.pixBuffer[Ne.ACTOR_PASS],t.area,"getPixelInformationWithData1");if(f<=0||f-Or>=t.props.length)return null;let u={};u.valid=!0,u.propID=f-Or,u.prop=t.props[u.propID];let g=ar(c[0],c[1],t.pixBuffer[Ne.COMPOSITE_INDEX_PASS],t.area,"getPixelInformationWithData2");if((g<0||g>16777215)&&(g=0),u.compositeID=g-Or,t.captureZValues){let l=(c[1]*(t.area[2]-t.area[0]+1)+c[0])*4;u.zValue=(256*t.zBuffer[l]+t.zBuffer[l+1])/65535,u.displayPosition=e}return t.pixBuffer[Ne.ID_LOW24]&&lh(c[0],c[1],t.pixBuffer[Ne.ID_LOW24],t.area)===0||(u.attributeID=ph(ar(c[0],c[1],t.pixBuffer[Ne.ID_LOW24],t.area,"getPixelInformationWithData3"),ar(c[0],c[1],t.pixBuffer[Ne.ID_HIGH24],t.area,"getPixelInformationWithData4"),0)),u}let i=[e[0],e[1]],s=[0,0],o=mn(t,e,0,n);if(o&&o.valid)return o;for(let c=1;c<a;++c){for(let f=i[1]>c?i[1]-c:0;f<=i[1]+c;++f)if(s[1]=f,i[0]>=c&&(s[0]=i[0]-c,o=mn(t,s,0,n),o&&o.valid)||(s[0]=i[0]+c,o=mn(t,s,0,n),o&&o.valid))return o;for(let f=i[0]>=c?i[0]-(c-1):0;f<=i[0]+(c-1);++f)if(s[0]=f,i[1]>=c&&(s[1]=i[1]-c,o=mn(t,s,0,n),o&&o.valid)||(s[1]=i[1]+c,o=mn(t,s,0,n),o&&o.valid))return o}return n[0]=e[0],n[1]=e[1],null}function gh(t,e,r,n,a){let i=[],s=0;return e.forEach((o,c)=>{let f=Tn.newInstance();switch(f.setContentType(HR.INDICES),t){case aa.FIELD_ASSOCIATION_CELLS:f.setFieldType(ch.CELL);break;case aa.FIELD_ASSOCIATION_POINTS:f.setFieldType(ch.POINT);break;default:fh("Unknown field association")}f.getProperties().propID=o.info.propID,f.getProperties().prop=o.info.prop,f.getProperties().compositeID=o.info.compositeID,f.getProperties().attributeID=o.info.attributeID,f.getProperties().pixelCount=o.pixelCount,r&&(f.getProperties().displayPosition=[o.info.displayPosition[0],o.info.displayPosition[1],o.info.zValue],f.getProperties().worldPosition=a.displayToWorld(o.info.displayPosition[0],o.info.displayPosition[1],o.info.zValue,n)),f.setSelectionList(o.attributeIDs),i[s]=f,s++}),i}function jR(t,e,r,n,a){let i=Math.floor(e),s=Math.floor(r),o=Math.floor(n),c=Math.floor(a),f=new Map,u=[0,0];for(let g=s;g<=c;g++)for(let l=i;l<=o;l++){let h=mn(t,[l,g],0,u);if(h&&h.valid){let y=uh(h);if(!f.has(y))f.set(y,{info:h,pixelCount:1,attributeIDs:[h.attributeID]});else{let p=f.get(y);p.pixelCount++,t.captureZValues&&h.zValue<p.info.zValue&&(p.info=h),p.attributeIDs.indexOf(h.attributeID)===-1&&p.attributeIDs.push(h.attributeID)}}}return gh(t.fieldAssociation,f,t.captureZValues,t.renderer,t.openGLRenderWindow)}function PR(t,e){e.classHierarchy.push("vtkOpenGLHardwareSelector"),t.releasePixBuffers=()=>{e.rawPixBuffer=[],e.pixBuffer=[],e.zBuffer=null},t.releaseGraphicsResources=()=>{t.releasePixBuffers(),e.framebuffer?.delete(),e.framebuffer=null},t.beginSelection=()=>{e._openGLRenderer=e._openGLRenderWindow.getViewNodeFor(e._renderer,e._openGLRenderer),e.maxAttributeId=0;let n=e._openGLRenderWindow.getSize();if(!e.framebuffer)e.framebuffer=gr.newInstance(),e.framebuffer.setOpenGLRenderWindow(e._openGLRenderWindow),e.framebuffer.saveCurrentBindingsAndBuffers(),e.framebuffer.create(n[0],n[1]),e.framebuffer.populateFramebuffer();else{e.framebuffer.setOpenGLRenderWindow(e._openGLRenderWindow),e.framebuffer.saveCurrentBindingsAndBuffers();let a=e.framebuffer.getSize();!a||a[0]!==n[0]||a[1]!==n[1]?(e.framebuffer.create(n[0],n[1]),e.framebuffer.populateFramebuffer()):e.framebuffer.bind()}if(e._openGLRenderer.clear(),e._openGLRenderer.setSelector(t),e.hitProps={},e.propPixels={},e.props=[],t.releasePixBuffers(),e.fieldAssociation===aa.FIELD_ASSOCIATION_POINTS){let a=e._openGLRenderWindow.getContext(),i=a.isEnabled(a.BLEND);a.disable(a.BLEND),e._openGLRenderWindow.traverseAllPasses(),i&&a.enable(a.BLEND)}},t.endSelection=()=>{e.hitProps={},e._openGLRenderer.setSelector(null),e.framebuffer.restorePreviousBindingsAndBuffers()},t.preCapturePass=()=>{let n=e._openGLRenderWindow.getContext();e.originalBlending=n.isEnabled(n.BLEND),n.disable(n.BLEND)},t.postCapturePass=()=>{let n=e._openGLRenderWindow.getContext();e.originalBlending&&n.enable(n.BLEND)},t.select=()=>{let n=null;return t.captureBuffers()&&(n=t.generateSelection(e.area[0],e.area[1],e.area[2],e.area[3]),t.releasePixBuffers()),n},t.getSourceDataAsync=async(n,a,i,s,o)=>{if(e._renderer=n,a===void 0){let f=e._openGLRenderWindow.getSize();t.setArea(0,0,f[0]-1,f[1]-1)}else t.setArea(a,i,s,o);if(!t.captureBuffers())return!1;let c={area:[...e.area],pixBuffer:[...e.pixBuffer],captureZValues:e.captureZValues,zBuffer:e.zBuffer,props:[...e.props],fieldAssociation:e.fieldAssociation,renderer:n,openGLRenderWindow:e._openGLRenderWindow};return c.generateSelection=(...f)=>jR(c,...f),c},t.captureBuffers=()=>{if(!e._renderer||!e._openGLRenderWindow)return fh("Renderer and view must be set before calling Select."),!1;e._openGLRenderer=e._openGLRenderWindow.getViewNodeFor(e._renderer,e._openGLRenderer),e._openGLRenderWindow.getRenderable().preRender(),t.invokeEvent({type:"StartEvent"}),e.originalBackground=e._renderer.getBackgroundByReference(),e._renderer.setBackground(0,0,0,0);let n=e._openGLRenderWindow.getRenderPasses();t.beginSelection();let a=[];for(e.currentPass=Ne.MIN_KNOWN_PASS;e.currentPass<=Ne.MAX_KNOWN_PASS;e.currentPass++)t.passRequired(e.currentPass)&&(t.preCapturePass(e.currentPass),e.captureZValues&&e.currentPass===Ne.ACTOR_PASS&&typeof n[0].requestDepth=="function"&&typeof n[0].getFramebuffer=="function"&&n[0].requestDepth(),e._openGLRenderWindow.traverseAllPasses(),t.postCapturePass(e.currentPass),t.savePixelBuffer(e.currentPass),a.push(e.currentPass));return a.forEach(i=>{e.currentPass=i,t.processPixelBuffers()}),e.currentPass=Ne.MAX_KNOWN_PASS,t.endSelection(),e._renderer.setBackground(e.originalBackground),t.invokeEvent({type:"EndEvent"}),!0},t.processPixelBuffers=()=>{e.props.forEach((n,a)=>{t.isPropHit(a)&&n.processSelectorPixelBuffers(t,e.propPixels[a])})},t.passRequired=n=>{if(n===Ne.ID_HIGH24){if(e.fieldAssociation===aa.FIELD_ASSOCIATION_POINTS)return e.maximumPointId>16777215;if(e.fieldAssociation===aa.FIELD_ASSOCIATION_CELLS)return e.maximumCellId>16777215}return!0},t.savePixelBuffer=n=>{if(e.pixBuffer[n]=e._openGLRenderWindow.getPixelData(e.area[0],e.area[1],e.area[2],e.area[3]),!e.rawPixBuffer[n]){let a=(e.area[2]-e.area[0]+1)*(e.area[3]-e.area[1]+1)*4;e.rawPixBuffer[n]=new Uint8Array(a),e.rawPixBuffer[n].set(e.pixBuffer[n])}if(n===Ne.ACTOR_PASS){if(e.captureZValues){let a=e._openGLRenderWindow.getRenderPasses();if(typeof a[0].requestDepth=="function"&&typeof a[0].getFramebuffer=="function"){let i=a[0].getFramebuffer();i.saveCurrentBindingsAndBuffers(),i.bind(),e.zBuffer=e._openGLRenderWindow.getPixelData(e.area[0],e.area[1],e.area[2],e.area[3]),i.restorePreviousBindingsAndBuffers()}}t.buildPropHitList(e.rawPixBuffer[n])}},t.buildPropHitList=n=>{let a=0;for(let i=0;i<=e.area[3]-e.area[1];i++)for(let s=0;s<=e.area[2]-e.area[0];s++){let o=ar(s,i,n,e.area,"buildPropHitList");o>0&&(o--,o in e.hitProps||(e.hitProps[o]=!0,e.propPixels[o]=[]),e.propPixels[o].push(a*4)),++a}},t.renderProp=n=>{e.currentPass===Ne.ACTOR_PASS&&(t.setPropColorValueFromInt(e.props.length+Or),e.props.push(n))},t.renderCompositeIndex=n=>{e.currentPass===Ne.COMPOSITE_INDEX_PASS&&t.setPropColorValueFromInt(n+Or)},t.renderAttributeId=n=>{n<0||(e.maxAttributeId=n>e.maxAttributeId?n:e.maxAttributeId)},t.passTypeToString=n=>w.enumToString(Ne,n),t.isPropHit=n=>!!e.hitProps[n],t.setPropColorValueFromInt=n=>{e.propColorValue[0]=n%256/255,e.propColorValue[1]=Math.floor(n/256)%256/255,e.propColorValue[2]=Math.floor(n/65536)%256/255},t.delete=w.chain(t.releaseGraphicsResources,t.delete),t.getPixelInformation=(n,a,i)=>{let s=a<0?0:a;if(na("getPixelInformation called",s),s===0){if(i[0]=n[0],i[1]=n[1],n[0]<e.area[0]||n[0]>e.area[2]||n[1]<e.area[1]||n[1]>e.area[3])return null;na(n),na(e.area);let u=[n[0]-e.area[0],n[1]-e.area[1]];na("adjusted displayPosition",u);let g=ar(u[0],u[1],e.pixBuffer[Ne.ACTOR_PASS],e.area,"getPixelInformation");if(na("actorid",g),g<=0||g-Or>=e.props.length)return null;let l={};l.valid=!0,l.propID=g-Or,l.prop=e.props[l.propID];let h=ar(u[0],u[1],e.pixBuffer[Ne.COMPOSITE_INDEX_PASS],e.area,"getPixelInformation2");if((h<0||h>16777215)&&(h=0),l.compositeID=h-Or,e.captureZValues){let y=(u[1]*(e.area[2]-e.area[0]+1)+u[0])*4;l.zValue=(256*e.zBuffer[y]+e.zBuffer[y+1])/65535,l.displayPosition=n}return e.pixBuffer[Ne.ID_LOW24]&&lh(u[0],u[1],e.pixBuffer[Ne.ID_LOW24],e.area)===0||(l.attributeID=ph(ar(u[0],u[1],e.pixBuffer[Ne.ID_LOW24],e.area,"getPixelInformation3"),ar(u[0],u[1],e.pixBuffer[Ne.ID_HIGH24],e.area,"getPixelInformation4"))),l}let o=[n[0],n[1]],c=[0,0],f=t.getPixelInformation(n,0,i);if(f&&f.valid)return f;for(let u=1;u<s;++u){for(let g=o[1]>u?o[1]-u:0;g<=o[1]+u;++g)if(c[1]=g,o[0]>=u&&(c[0]=o[0]-u,f=t.getPixelInformation(c,0,i),f&&f.valid)||(c[0]=o[0]+u,f=t.getPixelInformation(c,0,i),f&&f.valid))return f;for(let g=o[0]>=u?o[0]-(u-1):0;g<=o[0]+(u-1);++g)if(c[0]=g,o[1]>=u&&(c[1]=o[1]-u,f=t.getPixelInformation(c,0,i),f&&f.valid)||(c[1]=o[1]+u,f=t.getPixelInformation(c,0,i),f&&f.valid))return f}return i[0]=n[0],i[1]=n[1],null},t.generateSelection=(n,a,i,s)=>{let o=Math.floor(n),c=Math.floor(a),f=Math.floor(i),u=Math.floor(s),g=new Map,l=[0,0];for(let h=c;h<=u;h++)for(let y=o;y<=f;y++){let p=[y,h],m=t.getPixelInformation(p,0,l);if(m&&m.valid){let d=uh(m);if(!g.has(d))g.set(d,{info:m,pixelCount:1,attributeIDs:[m.attributeID]});else{let x=g.get(d);x.pixelCount++,e.captureZValues&&m.zValue<x.info.zValue&&(x.info=m),x.attributeIDs.indexOf(m.attributeID)===-1&&x.attributeIDs.push(m.attributeID)}}}return gh(e.fieldAssociation,g,e.captureZValues,e._renderer,e._openGLRenderWindow)},t.getRawPixelBuffer=n=>e.rawPixBuffer[n],t.getPixelBuffer=n=>e.pixBuffer[n],t.attach=(n,a)=>{e._openGLRenderWindow=n,e._renderer=a};let r=t.setArea;t.setArea=(...n)=>r(...n)?(e.area[0]=Math.floor(e.area[0]),e.area[1]=Math.floor(e.area[1]),e.area[2]=Math.floor(e.area[2]),e.area[3]=Math.floor(e.area[3]),!0):!1}var $R={area:void 0,currentPass:-1,propColorValue:null,props:null,maximumPointId:0,maximumCellId:0,idOffset:1};function hh(t,e,r={}){Object.assign(e,$R,r),Wi.extend(t,e,r),e.propColorValue=[0,0,0],e.props=[],e.area||(e.area=[0,0,0,0]),w.setGetArray(t,e,["area"],4),w.setGet(t,e,["_renderer","currentPass","_openGLRenderWindow","maximumPointId","maximumCellId"]),w.setGetArray(t,e,["propColorValue"],3),w.moveToProtected(t,e,["renderer","openGLRenderWindow"]),w.event(t,e,"event"),PR(t,e)}var AR=w.newInstance(hh,"vtkOpenGLHardwareSelector"),Ao={newInstance:AR,extend:hh,...Po};var mh=On(Th(),1),KR=["lastShaderProgramBound","context","_openGLRenderWindow"];function XR(t,e){e.classHierarchy.push("vtkShaderCache"),t.replaceShaderValues=(r,n,a)=>{let i=n;a.length>0&&(i=H.substitute(i,"VSOut","GSOut").result);let s=`#version 300 es
#define attribute in
#define textureCube texture
#define texture2D texture
#define textureCubeLod textureLod
#define texture2DLod textureLod
`;i=H.substitute(i,"//VTK::System::Dec",[`${s}
`,"#ifdef GL_FRAGMENT_PRECISION_HIGH","precision highp float;","precision highp int;","#else","precision mediump float;","precision mediump int;","#endif"]).result;let o=H.substitute(r,"//VTK::System::Dec",[`${s}
`,"#ifdef GL_FRAGMENT_PRECISION_HIGH","precision highp float;","precision highp int;","#else","precision mediump float;","precision mediump int;","#endif"]).result;o=H.substitute(o,"varying","out").result,i=H.substitute(i,"varying","in").result;let c="",f=0;for(;i.includes(`gl_FragData[${f}]`);)i=H.substitute(i,`gl_FragData\\[${f}\\]`,`fragOutput${f}`).result,c+=`layout(location = ${f}) out vec4 fragOutput${f};
`,f++;i=H.substitute(i,"//VTK::Output::Dec",c).result;let u=H.substitute(a,"//VTK::System::Dec",s).result;return{VSSource:o,FSSource:i,GSSource:u}},t.readyShaderProgramArray=(r,n,a)=>{let i=t.replaceShaderValues(r,n,a),s=t.getShaderProgram(i.VSSource,i.FSSource,i.GSSource);return t.readyShaderProgram(s)},t.readyShaderProgram=r=>!r||!r.getCompiled()&&!r.compileShader()||!t.bindShaderProgram(r)?null:r,t.getShaderProgram=(r,n,a)=>{let i=`${r}${n}${a}`,s=mh.default.hash(i);if(!(s in e.shaderPrograms)){let o=H.newInstance();return o.setContext(e.context),o.getVertexShader().setSource(r),o.getFragmentShader().setSource(n),a&&o.getGeometryShader().setSource(a),o.setMd5Hash(s),e.shaderPrograms[s]=o,o}return e.shaderPrograms[s]},t.releaseGraphicsResources=r=>{t.releaseCurrentShaderProgram(),Object.keys(e.shaderPrograms).map(n=>e.shaderPrograms[n]).forEach(n=>n.cleanup()),e.shaderPrograms={}},t.releaseCurrentShaderProgram=()=>{e.lastShaderProgramBound&&(e.lastShaderProgramBound.cleanup(),e.lastShaderProgramBound=null)},t.bindShaderProgram=r=>(e.lastShaderProgramBound===r||(e.lastShaderProgramBound&&e.lastShaderProgramBound.release(),r.bind(),e.lastShaderProgramBound=r),1)}var YR={lastShaderProgramBound:null,shaderPrograms:null,context:null};function yh(t,e,r={}){Object.assign(e,YR,r),e.shaderPrograms={},w.obj(t,e),w.setGet(t,e,KR),w.moveToProtected(t,e,["openGLRenderWindow"]),XR(t,e)}var qR=w.newInstance(yh,"vtkShaderCache"),Sh={newInstance:qR,extend:yh};var{vtkErrorMacro:ZR}=w;function QR(t,e){e.classHierarchy.push("vtkOpenGLTextureUnitManager"),t.deleteTable=()=>{for(let r=0;r<e.numberOfTextureUnits;++r)e.textureUnits[r]===!0&&ZR("some texture units  were not properly released");e.textureUnits=[],e.numberOfTextureUnits=0},t.setContext=r=>{if(e.context!==r){if(e.context!==0&&t.deleteTable(),e.context=r,e.context){e.numberOfTextureUnits=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS);for(let n=0;n<e.numberOfTextureUnits;++n)e.textureUnits[n]=!1}t.modified()}},t.allocate=()=>{for(let r=0;r<e.numberOfTextureUnits;r++)if(!t.isAllocated(r))return e.textureUnits[r]=!0,r;return-1},t.allocateUnit=r=>t.isAllocated(r)?-1:(e.textureUnits[r]=!0,r),t.isAllocated=r=>e.textureUnits[r],t.free=r=>{e.textureUnits[r]=!1},t.freeAll=()=>{for(let r=0;r<e.numberOfTextureUnits;++r)e.textureUnits[r]=!1}}var JR={context:null,numberOfTextureUnits:0,textureUnits:0};function xh(t,e,r={}){Object.assign(e,JR,r),w.obj(t,e),e.textureUnits=[],w.get(t,e,["numberOfTextureUnits"]),w.setGet(t,e,["context"]),QR(t,e)}var eE=w.newInstance(xh,"vtkOpenGLTextureUnitManager"),Ch={newInstance:eE,extend:xh};function tE(t,e){e.classHierarchy.push("vtkRenderWindowViewNode"),t.getViewNodeFactory=()=>null,t.getAspectRatio=()=>e.size[0]/e.size[1],t.getAspectRatioForRenderer=r=>{let n=r.getViewportByReference();return e.size[0]*(n[2]-n[0])/((n[3]-n[1])*e.size[1])},t.isInViewport=(r,n,a)=>{let i=a.getViewportByReference(),s=t.getFramebufferSize();return i[0]*s[0]<=r&&i[2]*s[0]>=r&&i[1]*s[1]<=n&&i[3]*s[1]>=n},t.getViewportSize=r=>{let n=r.getViewportByReference(),a=t.getFramebufferSize();return[(n[2]-n[0])*a[0],(n[3]-n[1])*a[1]]},t.getViewportCenter=r=>{let n=t.getViewportSize(r);return[n[0]*.5,n[1]*.5]},t.displayToNormalizedDisplay=(r,n,a)=>{let i=t.getFramebufferSize();return[r/i[0],n/i[1],a]},t.normalizedDisplayToDisplay=(r,n,a)=>{let i=t.getFramebufferSize();return[r*i[0],n*i[1],a]},t.worldToView=(r,n,a,i)=>i.worldToView(r,n,a),t.viewToWorld=(r,n,a,i)=>i.viewToWorld(r,n,a),t.worldToDisplay=(r,n,a,i)=>{let s=i.worldToView(r,n,a),o=t.getViewportSize(i),c=i.viewToProjection(s[0],s[1],s[2],o[0]/o[1]),f=i.projectionToNormalizedDisplay(c[0],c[1],c[2]);return t.normalizedDisplayToDisplay(f[0],f[1],f[2])},t.displayToWorld=(r,n,a,i)=>{let s=t.displayToNormalizedDisplay(r,n,a),o=i.normalizedDisplayToProjection(s[0],s[1],s[2]),c=t.getViewportSize(i),f=i.projectionToView(o[0],o[1],o[2],c[0]/c[1]);return i.viewToWorld(f[0],f[1],f[2])},t.normalizedDisplayToViewport=(r,n,a,i)=>{let s=i.getViewportByReference();s=t.normalizedDisplayToDisplay(s[0],s[1],0);let o=t.normalizedDisplayToDisplay(r,n,a);return[o[0]-s[0]-.5,o[1]-s[1]-.5,a]},t.viewportToNormalizedViewport=(r,n,a,i)=>{let s=t.getViewportSize(i);return s&&s[0]!==0&&s[1]!==0?[r/(s[0]-1),n/(s[1]-1),a]:[r,n,a]},t.normalizedViewportToViewport=(r,n,a,i)=>{let s=t.getViewportSize(i);return[r*(s[0]-1),n*(s[1]-1),a]},t.displayToLocalDisplay=(r,n,a)=>[r,t.getFramebufferSize()[1]-n-1,a],t.viewportToNormalizedDisplay=(r,n,a,i)=>{let s=i.getViewportByReference();s=t.normalizedDisplayToDisplay(s[0],s[1],0);let o=r+s[0]+.5,c=n+s[1]+.5;return t.displayToNormalizedDisplay(o,c,a)},t.getComputedDevicePixelRatio=()=>e.size[0]/t.getContainerSize()[0],t.getContainerSize=()=>{w.vtkErrorMacro("not implemented")},t.getPixelData=(r,n,a,i)=>{w.vtkErrorMacro("not implemented")},t.createSelector=()=>{w.vtkErrorMacro("not implemented")}}var rE={size:void 0,selector:void 0};function Oh(t,e,r={}){Object.assign(e,rE,r),e.size||(e.size=[300,300]),w.getArray(t,e,["size"],2),w.get(t,e,["selector"]),ve.extend(t,e,r),tE(t,e)}var nE=w.newInstance(Oh,"vtkRenderWindowViewNode"),Ii={newInstance:nE,extend:Oh};function wh(){let t=new Map,e={apply(a,i,s){return t.has(s[0])?t.get(s[0]):a.apply(i,s)}};function r(a){return{apply(i,s,o){return t.set(a,o[0]),i.apply(s,o)}}}let n=Object.create(null);return n.getParameter=(a,i,s,o)=>new Proxy(o.bind(a),e),n.depthMask=(a,i,s,o)=>new Proxy(o.bind(a),r(a.DEPTH_WRITEMASK)),{get(a,i,s){if(i==="__getUnderlyingContext")return()=>a;let o=Reflect.get(a,i,a);o instanceof Function&&(o=o.bind(a));let c=n[i];return c?c(a,i,s,o):o}}}var{vtkDebugMacro:aE,vtkErrorMacro:Ko,vtkWarningMacro:iE}=w,sE={position:"absolute",top:0,left:0,width:"100%",height:"100%"},oE=["activateTexture","deactivateTexture","disableCullFace","enableCullFace","setCullFaceMode","get3DContext","getActiveFramebuffer","getContext","getDefaultTextureByteSize","getDefaultTextureInternalFormat","getGLInformations","getGraphicsMemoryInfo","getGraphicsResourceForObject","getHardwareMaximumLineWidth","getPixelData","getShaderCache","getTextureUnitForTexture","getTextureUnitManager","makeCurrent","releaseGraphicsResources","registerGraphicsResourceUser","unregisterGraphicsResourceUser","restoreContext","setActiveFramebuffer","setContext","setGraphicsResourceForObject"];function Pt(t,e,r,n){let a=t.getParameter(t.TEXTURE_BINDING_2D),i=t.getParameter(t.FRAMEBUFFER_BINDING),s=t.createFramebuffer(),o=t.createTexture();t.bindTexture(t.TEXTURE_2D,o),t.texImage2D(t.TEXTURE_2D,0,e,2,2,0,r,n,null),t.bindFramebuffer(t.FRAMEBUFFER,s),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,o,0);let c=t.checkFramebufferStatus(t.FRAMEBUFFER);return t.bindFramebuffer(t.FRAMEBUFFER,i),t.bindTexture(t.TEXTURE_2D,a),t.deleteFramebuffer(s),t.deleteTexture(o),c===t.FRAMEBUFFER_COMPLETE}var Hi=0,Eh=[];function cE(){Hi++,Eh.forEach(t=>t(Hi))}function fE(){Hi--,Eh.forEach(t=>t(Hi))}function Rh(t){t.preventDefault()}function uE(t,e){e.classHierarchy.push("vtkOpenGLRenderWindow");let r;function n(){return r||(r=wh()),r}t.getViewNodeFactory=()=>e.myFactory,e.manageCanvas&&(e.canvas.addEventListener("webglcontextlost",Rh,!1),e.canvas.addEventListener("webglcontextrestored",t.restoreContext,!1));let a=[0,0];function i(){e.renderable&&e.manageCanvas&&(e.size[0]!==a[0]||e.size[1]!==a[1])&&(a[0]=e.size[0],a[1]=e.size[1],e.canvas.setAttribute("width",e.size[0]),e.canvas.setAttribute("height",e.size[1])),e.viewStream&&e.viewStream.setSize(e.size[0],e.size[1]),e.manageCanvas&&(e.canvas.style.display=e.useOffScreen?"none":"block"),e.el&&(e.el.style.cursor=e.cursorVisibility?e.cursor:"none"),e.containerSize=null}t.onModified(i),t.buildPass=p=>{if(p){if(!e.renderable)return;t.prepareNodes(),t.addMissingNodes(e.renderable.getRenderersByReference()),t.addMissingNodes(e.renderable.getChildRenderWindowsByReference()),t.removeUnusedNodes(),t.initialize(),e.children.forEach(m=>{m.setOpenGLRenderWindow?.(t)})}},t.initialize=()=>{if(!e.initialized){if(e.rootOpenGLRenderWindow=t.getLastAncestorOfType("vtkOpenGLRenderWindow"),e.rootOpenGLRenderWindow)e.context2D=t.get2DContext();else{e.context=t.get3DContext(),t.resizeFromChildRenderWindows(),e.context&&cE(),e.textureUnitManager=Ch.newInstance(),e.textureUnitManager.setContext(e.context),e.shaderCache.setContext(e.context);let p=e.context;p.blendFuncSeparate(p.SRC_ALPHA,p.ONE_MINUS_SRC_ALPHA,p.ONE,p.ONE_MINUS_SRC_ALPHA),p.depthFunc(p.LEQUAL),p.enable(p.BLEND)}e.initialized=!0}},t.makeCurrent=()=>{e.context.makeCurrent()},t.setContainer=p=>{e.el&&e.el!==p&&(e.canvas.parentNode!==e.el&&Ko("Error: canvas parent node does not match container"),e.el.removeChild(e.canvas),e.el.contains(e.bgImage)&&e.el.removeChild(e.bgImage)),e.el!==p&&(e.el=p,e.el&&(e.el.appendChild(e.canvas),e.useBackgroundImage&&e.el.appendChild(e.bgImage)),t.modified())},t.getContainer=()=>e.el,t.getContainerSize=()=>{if(!e.containerSize&&e.el){let{width:p,height:m}=e.el.getBoundingClientRect();e.containerSize=[p,m]}return e.containerSize||e.size},t.getFramebufferSize=()=>e.activeFramebuffer?.getSize()||e.size,t.getPixelData=(p,m,d,x)=>{let T=new Uint8Array((d-p+1)*(x-m+1)*4);return e.context.readPixels(p,m,d-p+1,x-m+1,e.context.RGBA,e.context.UNSIGNED_BYTE,T),T},t.get3DContext=(p={preserveDrawingBuffer:!1,depth:!0,alpha:!0,powerPreference:"high-performance"})=>{let m=typeof WebGL2RenderingContext<"u"?e.canvas.getContext("webgl2",p):null;return m&&aE("using WebGL2"),m||Ko("no WebGL2 context"),new Proxy(m,n())},t.get2DContext=(p={})=>e.canvas.getContext("2d",p),t.restoreContext=()=>{let p=Xe.newInstance();p.setCurrentOperation("Release"),p.traverse(t,null)},t.activateTexture=p=>{let m=e._textureResourceIds.get(p);if(m!==void 0){e.context.activeTexture(e.context.TEXTURE0+m);return}let d=t.getTextureUnitManager().allocate();if(d<0){Ko("Hardware does not support the number of textures defined.");return}e._textureResourceIds.set(p,d),e.context.activeTexture(e.context.TEXTURE0+d)},t.deactivateTexture=p=>{let m=e._textureResourceIds.get(p);m!==void 0&&(t.getTextureUnitManager().free(m),e._textureResourceIds.delete(p))},t.getTextureUnitForTexture=p=>{let m=e._textureResourceIds.get(p);return m!==void 0?m:-1},t.getDefaultTextureByteSize=(p,m=null,d=!1)=>{switch(p){case re.CHAR:case re.SIGNED_CHAR:case re.UNSIGNED_CHAR:return 1;case m:case d:case re.UNSIGNED_SHORT:case re.SHORT:case re.VOID:return 2;default:return 4}},t.getDefaultTextureInternalFormat=(p,m,d=null,x=!1)=>{switch(p){case re.UNSIGNED_CHAR:switch(m){case 1:return e.context.R8;case 2:return e.context.RG8;case 3:return e.context.RGB8;default:return e.context.RGBA8}case(d&&!x&&re.UNSIGNED_SHORT):switch(m){case 1:return d.R16_EXT;case 2:return d.RG16_EXT;case 3:return d.RGB16_EXT;default:return d.RGBA16_EXT}case(d&&!x&&re.SHORT):switch(m){case 1:return d.R16_SNORM_EXT;case 2:return d.RG16_SNORM_EXT;case 3:return d.RGB16_SNORM_EXT;default:return d.RGBA16_SNORM_EXT}case re.UNSIGNED_SHORT:case re.SHORT:case re.FLOAT:default:switch(m){case 1:return x?e.context.R16F:e.context.R32F;case 2:return x?e.context.RG16F:e.context.RG32F;case 3:return x?e.context.RGB16F:e.context.RGB32F;default:return x?e.context.RGBA16F:e.context.RGBA32F}}},t.setBackgroundImage=p=>{e.bgImage.src=p.src},t.setUseBackgroundImage=p=>{e.useBackgroundImage=p,e.useBackgroundImage&&!e.el.contains(e.bgImage)?e.el.appendChild(e.bgImage):!e.useBackgroundImage&&e.el.contains(e.bgImage)&&e.el.removeChild(e.bgImage)};function s(p=e.imageFormat){let m=document.createElement("canvas"),d=m.getContext("2d");m.width=e.canvas.width,m.height=e.canvas.height,d.drawImage(e.canvas,0,0);let x=e.canvas.getBoundingClientRect();e.renderable.getRenderers().forEach(v=>{v.getViewProps().forEach(C=>{if(C.getContainer){let O=C.getContainer().getElementsByTagName("canvas");for(let M=0;M<O.length;M++){let S=O[M],E=S.getBoundingClientRect(),R=E.x-x.x,D=E.y-x.y;d.drawImage(S,R,D)}}})});let T=m.toDataURL(p);m.remove(),t.invokeImageReady(T)}t.captureNextImage=(p="image/png",{resetCamera:m=!1,size:d=null,scale:x=1}={})=>{if(e.deleted)return null;let T=d||x!==1?d||e.size.map(C=>C*x):null;T!==null&&!e.manageCanvas&&(iE("Ignoring the requested screenshot size/scale: resizing the canvas requires manageCanvas=true on vtkOpenGLRenderWindow. Capturing at the current size instead."),T=null),e.imageFormat=p;let v=e.notifyStartCaptureImage;return e.notifyStartCaptureImage=!0,e._screenshot={size:T},new Promise((C,O)=>{let M=t.onImageReady(S=>{if(e._screenshot.size===null)e.notifyStartCaptureImage=v,M.unsubscribe(),e._screenshot.placeHolder&&(e.size=e._screenshot.originalSize,t.modified(),e._screenshot.cameras&&e._screenshot.cameras.forEach(({restoreParamsFn:E,arg:R})=>E(R)),t.traverseAllPasses(),e.el.removeChild(e._screenshot.placeHolder),e._screenshot.placeHolder.remove(),e._screenshot=null),C(S);else{let E=document.createElement("img");if(E.style=sE,E.src=S,e._screenshot.placeHolder=e.el.appendChild(E),e.canvas.style.display="none",e._screenshot.originalSize=e.size,e.size=e._screenshot.size,e.rootOpenGLRenderWindow?.resizeFromChildRenderWindows(),e._screenshot.size=null,t.modified(),m){let R=m!==!0;e._screenshot.cameras=e.renderable.getRenderers().map(D=>{let V=D.getActiveCamera(),U=V.get("focalPoint","position","parallelScale");return{resetCameraArgs:R?{renderer:D}:void 0,resetCameraFn:R?m:D.resetCamera,restoreParamsFn:V.set,arg:JSON.parse(JSON.stringify(U))}}),e._screenshot.cameras.forEach(({resetCameraFn:D,resetCameraArgs:V})=>D(V))}t.traverseAllPasses()}})})};let o;t.getHardwareMaximumLineWidth=()=>{if(o!=null)return o;let p=t.get3DContext(),m=p.getParameter(p.ALIASED_LINE_WIDTH_RANGE);return o=m[1],m[1]},t.getGLInformations=()=>{if(e._glInformation)return e._glInformation;let p=t.get3DContext(),m=p.getExtension("EXT_color_buffer_float"),d=p.getExtension("WEBGL_debug_renderer_info"),x=p.getExtension("EXT_texture_filter_anisotropic")||p.getExtension("WEBKIT_EXT_texture_filter_anisotropic"),T=[["Max Vertex Attributes","MAX_VERTEX_ATTRIBS",p.getParameter(p.MAX_VERTEX_ATTRIBS)],["Max Varying Vectors","MAX_VARYING_VECTORS",p.getParameter(p.MAX_VARYING_VECTORS)],["Max Vertex Uniform Vectors","MAX_VERTEX_UNIFORM_VECTORS",p.getParameter(p.MAX_VERTEX_UNIFORM_VECTORS)],["Max Fragment Uniform Vectors","MAX_FRAGMENT_UNIFORM_VECTORS",p.getParameter(p.MAX_FRAGMENT_UNIFORM_VECTORS)],["Max Fragment Texture Image Units","MAX_TEXTURE_IMAGE_UNITS",p.getParameter(p.MAX_TEXTURE_IMAGE_UNITS)],["Max Vertex Texture Image Units","MAX_VERTEX_TEXTURE_IMAGE_UNITS",p.getParameter(p.MAX_VERTEX_TEXTURE_IMAGE_UNITS)],["Max Combined Texture Image Units","MAX_COMBINED_TEXTURE_IMAGE_UNITS",p.getParameter(p.MAX_COMBINED_TEXTURE_IMAGE_UNITS)],["Max 2D Texture Size","MAX_TEXTURE_SIZE",p.getParameter(p.MAX_TEXTURE_SIZE)],["Max Cube Texture Size","MAX_CUBE_MAP_TEXTURE_SIZE",p.getParameter(p.MAX_CUBE_MAP_TEXTURE_SIZE)],["Max Texture Anisotropy","MAX_TEXTURE_MAX_ANISOTROPY_EXT",x&&p.getParameter(x.MAX_TEXTURE_MAX_ANISOTROPY_EXT)],["Point Size Range","ALIASED_POINT_SIZE_RANGE",p.getParameter(p.ALIASED_POINT_SIZE_RANGE).join(" - ")],["Line Width Range","ALIASED_LINE_WIDTH_RANGE",p.getParameter(p.ALIASED_LINE_WIDTH_RANGE).join(" - ")],["Max Viewport Dimensions","MAX_VIEWPORT_DIMS",p.getParameter(p.MAX_VIEWPORT_DIMS).join(" - ")],["Max Renderbuffer Size","MAX_RENDERBUFFER_SIZE",p.getParameter(p.MAX_RENDERBUFFER_SIZE)],["Framebuffer Red Bits","RED_BITS",p.getParameter(p.RED_BITS)],["Framebuffer Green Bits","GREEN_BITS",p.getParameter(p.GREEN_BITS)],["Framebuffer Blue Bits","BLUE_BITS",p.getParameter(p.BLUE_BITS)],["Framebuffer Alpha Bits","ALPHA_BITS",p.getParameter(p.ALPHA_BITS)],["Framebuffer Depth Bits","DEPTH_BITS",p.getParameter(p.DEPTH_BITS)],["Framebuffer Stencil Bits","STENCIL_BITS",p.getParameter(p.STENCIL_BITS)],["Framebuffer Subpixel Bits","SUBPIXEL_BITS",p.getParameter(p.SUBPIXEL_BITS)],["MSAA Samples","SAMPLES",p.getParameter(p.SAMPLES)],["MSAA Sample Buffers","SAMPLE_BUFFERS",p.getParameter(p.SAMPLE_BUFFERS)],["Supported Formats for UByte Render Targets     ","UNSIGNED_BYTE RENDER TARGET FORMATS",[Pt(p,p.RGBA8,p.RGBA,p.UNSIGNED_BYTE)?"RGBA8":"",Pt(p,p.RGB8,p.RGB,p.UNSIGNED_BYTE)?"RGB8":"",Pt(p,p.RG8,p.RG,p.UNSIGNED_BYTE)?"RG8":"",Pt(p,p.R8,p.RED,p.UNSIGNED_BYTE)?"R8":""].join(" ")],["Supported Formats for Half Float Render Targets","HALF FLOAT RENDER TARGET FORMATS",[m&&Pt(p,p.RGBA16F,p.RGBA,p.HALF_FLOAT)?"RGBA16F":"",m&&Pt(p,p.RG16F,p.RG,p.HALF_FLOAT)?"RG16F":"",m&&Pt(p,p.R16F,p.RED,p.HALF_FLOAT)?"R16F":""].join(" ")],["Supported Formats for Full Float Render Targets","FLOAT RENDER TARGET FORMATS",[m&&Pt(p,p.RGBA32F,p.RGBA,p.FLOAT)?"RGBA32F":"",m&&Pt(p,p.RG32F,p.RG,p.FLOAT)?"RG32F":"",m&&Pt(p,p.R32F,p.RED,p.FLOAT)?"R32F":""].join(" ")],["Max Multiple Render Targets Buffers","MAX_DRAW_BUFFERS",p.getParameter(p.MAX_DRAW_BUFFERS)],["High Float Precision in Vertex Shader","HIGH_FLOAT VERTEX_SHADER",[p.getShaderPrecisionFormat(p.VERTEX_SHADER,p.HIGH_FLOAT).precision," (-2<sup>",p.getShaderPrecisionFormat(p.VERTEX_SHADER,p.HIGH_FLOAT).rangeMin,"</sup> - 2<sup>",p.getShaderPrecisionFormat(p.VERTEX_SHADER,p.HIGH_FLOAT).rangeMax,"</sup>)"].join("")],["Medium Float Precision in Vertex Shader","MEDIUM_FLOAT VERTEX_SHADER",[p.getShaderPrecisionFormat(p.VERTEX_SHADER,p.MEDIUM_FLOAT).precision," (-2<sup>",p.getShaderPrecisionFormat(p.VERTEX_SHADER,p.MEDIUM_FLOAT).rangeMin,"</sup> - 2<sup>",p.getShaderPrecisionFormat(p.VERTEX_SHADER,p.MEDIUM_FLOAT).rangeMax,"</sup>)"].join("")],["Low Float Precision in Vertex Shader","LOW_FLOAT VERTEX_SHADER",[p.getShaderPrecisionFormat(p.VERTEX_SHADER,p.LOW_FLOAT).precision," (-2<sup>",p.getShaderPrecisionFormat(p.VERTEX_SHADER,p.LOW_FLOAT).rangeMin,"</sup> - 2<sup>",p.getShaderPrecisionFormat(p.VERTEX_SHADER,p.LOW_FLOAT).rangeMax,"</sup>)"].join("")],["High Float Precision in Fragment Shader","HIGH_FLOAT FRAGMENT_SHADER",[p.getShaderPrecisionFormat(p.FRAGMENT_SHADER,p.HIGH_FLOAT).precision," (-2<sup>",p.getShaderPrecisionFormat(p.FRAGMENT_SHADER,p.HIGH_FLOAT).rangeMin,"</sup> - 2<sup>",p.getShaderPrecisionFormat(p.FRAGMENT_SHADER,p.HIGH_FLOAT).rangeMax,"</sup>)"].join("")],["Medium Float Precision in Fragment Shader","MEDIUM_FLOAT FRAGMENT_SHADER",[p.getShaderPrecisionFormat(p.FRAGMENT_SHADER,p.MEDIUM_FLOAT).precision," (-2<sup>",p.getShaderPrecisionFormat(p.FRAGMENT_SHADER,p.MEDIUM_FLOAT).rangeMin,"</sup> - 2<sup>",p.getShaderPrecisionFormat(p.FRAGMENT_SHADER,p.MEDIUM_FLOAT).rangeMax,"</sup>)"].join("")],["Low Float Precision in Fragment Shader","LOW_FLOAT FRAGMENT_SHADER",[p.getShaderPrecisionFormat(p.FRAGMENT_SHADER,p.LOW_FLOAT).precision," (-2<sup>",p.getShaderPrecisionFormat(p.FRAGMENT_SHADER,p.LOW_FLOAT).rangeMin,"</sup> - 2<sup>",p.getShaderPrecisionFormat(p.FRAGMENT_SHADER,p.LOW_FLOAT).rangeMax,"</sup>)"].join("")],["High Int Precision in Vertex Shader","HIGH_INT VERTEX_SHADER",[p.getShaderPrecisionFormat(p.VERTEX_SHADER,p.HIGH_INT).precision," (-2<sup>",p.getShaderPrecisionFormat(p.VERTEX_SHADER,p.HIGH_INT).rangeMin,"</sup> - 2<sup>",p.getShaderPrecisionFormat(p.VERTEX_SHADER,p.HIGH_INT).rangeMax,"</sup>)"].join("")],["Medium Int Precision in Vertex Shader","MEDIUM_INT VERTEX_SHADER",[p.getShaderPrecisionFormat(p.VERTEX_SHADER,p.MEDIUM_INT).precision," (-2<sup>",p.getShaderPrecisionFormat(p.VERTEX_SHADER,p.MEDIUM_INT).rangeMin,"</sup> - 2<sup>",p.getShaderPrecisionFormat(p.VERTEX_SHADER,p.MEDIUM_INT).rangeMax,"</sup>)"].join("")],["Low Int Precision in Vertex Shader","LOW_INT VERTEX_SHADER",[p.getShaderPrecisionFormat(p.VERTEX_SHADER,p.LOW_INT).precision," (-2<sup>",p.getShaderPrecisionFormat(p.VERTEX_SHADER,p.LOW_INT).rangeMin,"</sup> - 2<sup>",p.getShaderPrecisionFormat(p.VERTEX_SHADER,p.LOW_INT).rangeMax,"</sup>)"].join("")],["High Int Precision in Fragment Shader","HIGH_INT FRAGMENT_SHADER",[p.getShaderPrecisionFormat(p.FRAGMENT_SHADER,p.HIGH_INT).precision," (-2<sup>",p.getShaderPrecisionFormat(p.FRAGMENT_SHADER,p.HIGH_INT).rangeMin,"</sup> - 2<sup>",p.getShaderPrecisionFormat(p.FRAGMENT_SHADER,p.HIGH_INT).rangeMax,"</sup>)"].join("")],["Medium Int Precision in Fragment Shader","MEDIUM_INT FRAGMENT_SHADER",[p.getShaderPrecisionFormat(p.FRAGMENT_SHADER,p.MEDIUM_INT).precision," (-2<sup>",p.getShaderPrecisionFormat(p.FRAGMENT_SHADER,p.MEDIUM_INT).rangeMin,"</sup> - 2<sup>",p.getShaderPrecisionFormat(p.FRAGMENT_SHADER,p.MEDIUM_INT).rangeMax,"</sup>)"].join("")],["Low Int Precision in Fragment Shader","LOW_INT FRAGMENT_SHADER",[p.getShaderPrecisionFormat(p.FRAGMENT_SHADER,p.LOW_INT).precision," (-2<sup>",p.getShaderPrecisionFormat(p.FRAGMENT_SHADER,p.LOW_INT).rangeMin,"</sup> - 2<sup>",p.getShaderPrecisionFormat(p.FRAGMENT_SHADER,p.LOW_INT).rangeMax,"</sup>)"].join("")],["Supported Extensions","EXTENSIONS",p.getSupportedExtensions().join("<br/>					    ")],["WebGL Renderer","RENDERER",p.getParameter(p.RENDERER)],["WebGL Vendor","VENDOR",p.getParameter(p.VENDOR)],["WebGL Version","VERSION",p.getParameter(p.VERSION)],["Shading Language Version","SHADING_LANGUAGE_VERSION",p.getParameter(p.SHADING_LANGUAGE_VERSION)],["Unmasked Renderer","UNMASKED_RENDERER",d&&p.getParameter(d.UNMASKED_RENDERER_WEBGL)],["Unmasked Vendor","UNMASKED_VENDOR",d&&p.getParameter(d.UNMASKED_VENDOR_WEBGL)],["WebGL Version","WEBGL_VERSION",2]],v={};for(;T.length;){let[C,O,M]=T.pop();O&&(v[O]={label:C,value:M})}return e._glInformation=v,v},t.traverseAllPasses=()=>{if(e.renderPasses)for(let m=0;m<e.renderPasses.length;++m)e.renderPasses[m].traverse(t,null);t.copyParentContent(),e.notifyStartCaptureImage&&s();let p=e.renderable.getChildRenderWindowsByReference();for(let m=0;m<p.length;++m)t.getViewNodeFor(p[m])?.traverseAllPasses()},t.copyParentContent=()=>{let p=e.rootOpenGLRenderWindow;if(!p||!e.context2D||e.children.some(x=>!!x.getSelector?.()))return;let m=p.getCanvas(),d=e.canvas;e.context2D.drawImage(m,0,m.height-d.height,d.width,d.height,0,0,d.width,d.height)},t.resizeFromChildRenderWindows=()=>{let p=e.renderable.getChildRenderWindowsByReference();if(p.length>0){let m=[0,0];for(let d=0;d<p.length;++d){let x=t.getViewNodeFor(p[d])?.getSize();x&&(m[0]=x[0]>m[0]?x[0]:m[0],m[1]=x[1]>m[1]?x[1]:m[1])}t.setSize(...m)}},t.disableCullFace=()=>{e.cullFaceEnabled&&(e.context.disable(e.context.CULL_FACE),e.cullFaceEnabled=!1)},t.enableCullFace=()=>{e.cullFaceEnabled||(e.context.enable(e.context.CULL_FACE),e.cullFaceEnabled=!0)},t.setCullFaceMode=p=>{e.cullFaceMode!==p&&(e.context.cullFace(p),e.cullFaceMode=p)},t.setViewStream=p=>{if(e.viewStream===p)return!1;if(e.subscription&&(e.subscription.unsubscribe(),e.subscription=null),e.viewStream=p,e.viewStream){let m=e.renderable.getRenderers()[0];m.getBackgroundByReference()[3]=0,t.setUseBackgroundImage(!0),e.subscription=e.viewStream.onImageReady(d=>t.setBackgroundImage(d.image)),e.viewStream.setSize(e.size[0],e.size[1]),e.viewStream.invalidateCache(),e.viewStream.render(),t.modified()}return!0},t.createSelector=()=>{let p=Ao.newInstance();return p.setOpenGLRenderWindow(t),p};function c(){e.canvas.removeEventListener("webglcontextlost",Rh),e.canvas.removeEventListener("webglcontextrestored",t.restoreContext)}let f=()=>{let p=e.rootOpenGLRenderWindow;return p?!p.isDeleted():!!e.context};function u(p,m=t){f()&&p?.filter(d=>!d.isDeleted()).forEach(d=>d.releaseGraphicsResources?.(m))}function g(p){p.isDeleted()||!p.isA("vtkOpenGLRenderWindow")||(u(p.getRenderPasses(),p),p.getChildrenByReference().forEach(g))}let l=t.setRenderPasses;t.setRenderPasses=p=>{let m=e.renderPasses;return l(p)?(u(m?.filter(d=>!e.renderPasses?.includes(d))),!0):!1},t.delete=w.chain(()=>{u(e.renderPasses),e.context&&fE(),t.setContainer(),t.setViewStream()},c,t.delete),t.setActiveFramebuffer=p=>{e.activeFramebuffer=p};let h=t.setSize;t.setSize=(...p)=>{let m=h(...p);return m&&t.invokeWindowResizeEvent({width:e.size[0],height:e.size[1]}),m},t.registerGraphicsResourceUser=(p,m)=>{e._graphicsResources.has(p)||t.setGraphicsResourceForObject(p,null,null),e._graphicsResources.get(p)?.users.add(m)},t.unregisterGraphicsResourceUser=(p,m)=>{let d=e._graphicsResources.get(p);d&&(d.users.delete(m),d.users.size||(d.oglObject?.releaseGraphicsResources(t),e._graphicsResources.delete(p)))},t.getGraphicsResourceForObject=p=>e._graphicsResources.get(p),t.setGraphicsResourceForObject=(p,m,d)=>{if(!p)return;let x=e._graphicsResources.get(p);x?.oglObject?.releaseGraphicsResources(t),e._graphicsResources.set(p,{coreObject:p,oglObject:m,hash:d,users:x?.users??new Set})},t.getGraphicsMemoryInfo=()=>{let p=0;return e._graphicsResources.forEach(({oglObject:m})=>{p+=m.getAllocatedGPUMemoryInBytes()}),p},t.releaseGraphicsResources=()=>{g(t),e.shaderCache!==null&&e.shaderCache.releaseGraphicsResources(t),e._graphicsResources.forEach(({oglObject:p})=>{p.releaseGraphicsResources(t)}),e._graphicsResources.clear(),e.textureUnitManager!==null&&e.textureUnitManager.freeAll(),e.renderable.getRenderersByReference().forEach(p=>{t.getViewNodeFor(p)?.releaseGraphicsResources()})};let y={...t};oE.forEach(p=>{t[p]=(...m)=>e.rootOpenGLRenderWindow?e.rootOpenGLRenderWindow[p](...m):y[p](...m)})}var lE={cullFaceEnabled:!1,cullFaceMode:null,shaderCache:null,initialized:!1,context:null,context2D:null,canvas:null,manageCanvas:!0,cursorVisibility:!0,cursor:"pointer",textureUnitManager:null,textureResourceIds:null,containerSize:null,renderPasses:[],notifyStartCaptureImage:!1,activeFramebuffer:null,imageFormat:"image/png",useOffScreen:!1,useBackgroundImage:!1};function pE(t,e,r={}){Object.assign(e,lE,r),Ii.extend(t,e,r),e.canvas||(e.canvas=document.createElement("canvas"),e.canvas.style.width="100%"),e.selector||(e.selector=Ao.newInstance(),e.selector.setOpenGLRenderWindow(t)),e.bgImage=new Image,e.bgImage.style.position="absolute",e.bgImage.style.left="0",e.bgImage.style.top="0",e.bgImage.style.width="100%",e.bgImage.style.height="100%",e.bgImage.style.zIndex="-1",e._textureResourceIds=new Map,e._graphicsResources=new Map,e._glInformation=null,e.myFactory=bc.newInstance(),e.shaderCache=Sh.newInstance(),e.shaderCache.setOpenGLRenderWindow(t),e.renderPasses[0]=ah.newInstance(),w.get(t,e,["shaderCache","textureUnitManager","useBackgroundImage","activeFramebuffer","rootOpenGLRenderWindow"]),w.setGet(t,e,["initialized","context","context2D","canvas","manageCanvas","renderPasses","notifyStartCaptureImage","cursor","useOffScreen"]),w.setGetArray(t,e,["size"],2),w.event(t,e,"imageReady"),w.event(t,e,"windowResizeEvent"),uE(t,e)}var Mh=w.newInstance(pE,"vtkOpenGLRenderWindow");ra("WebGL",Mh);_e("vtkRenderWindow",Mh);var{vtkErrorMacro:gE}=we,Xo=["setBindGroup","setIndexBuffer","setVertexBuffer","draw","drawIndexed"];function hE(t,e){e.classHierarchy.push("vtkWebGPURenderEncoder"),t.begin=r=>{e.drawCallbacks=[],e.handle=r.beginRenderPass(e.description),e.label&&e.handle.pushDebugGroup(e.label)},t.end=()=>{for(let r=0;r<e.drawCallbacks.length;r++){let n=e.drawCallbacks[r],a=n.pipeline;t.setPipeline(a);for(let i=0;i<n.callbacks.length;i++)n.callbacks[i](t)}e.label&&e.handle.popDebugGroup(),e.handle.end(),e.boundPipeline=null},t.setPipeline=r=>{if(e.boundPipeline===r)return;e.handle.setPipeline(r.getHandle());let n=r.getPipelineDescription(),a=n.fragment?.targets;if(e.colorTextureViews.length!==a.length)console.log(`mismatched attachment counts on pipeline ${a.length} while encoder has ${e.colorTextureViews.length}`),console.trace();else for(let i=0;i<e.colorTextureViews.length;i++){let s=e.colorTextureViews[i].getTexture()?.getFormat();s&&s!==a[i].format&&(console.log(`mismatched attachments for attachment ${i} on pipeline ${a[i].format} while encoder has ${s}`),console.trace())}if(!!e.depthTextureView!="depthStencil"in n)console.log("mismatched depth attachments"),console.trace();else if(e.depthTextureView){let i=e.depthTextureView.getTexture()?.getFormat();i&&i!==n.depthStencil.format&&(console.log(`mismatched depth attachments on pipeline ${n.depthStencil.format} while encoder has ${i}`),console.trace())}e.boundPipeline=r},t.replaceShaderCode=r=>{e.replaceShaderCodeFunction(r)},t.setColorTextureView=(r,n)=>{e.colorTextureViews[r]!==n&&(e.colorTextureViews[r]=n)},t.setResolveTextureView=(r,n)=>{e.resolveTextureViews[r]!==n&&(e.resolveTextureViews[r]=n)},t.activateBindGroup=r=>{let n=e.boundPipeline.getDevice(),a=e.boundPipeline.getBindGroupLayoutIndex(r.getLabel());if(a<0){gE(`vtkWebGPURenderEncoder: could not find bind group layout ${r.getLabel()}`);return}e.handle.setBindGroup(a,r.getBindGroup(n));let i=n.getBindGroupLayoutDescription(r.getBindGroupLayout(n)),s=n.getBindGroupLayoutDescription(e.boundPipeline.getBindGroupLayout(a));i!==s&&(console.log(`renderEncoder ${e.pipelineHash} mismatched bind group layouts bind group has
${i}
 versus pipeline
${s}
`),console.trace())},t.attachTextureViews=()=>{for(let r=0;r<e.colorTextureViews.length;r++)e.description.colorAttachments[r]?e.description.colorAttachments[r].view=e.colorTextureViews[r].getHandle():e.description.colorAttachments[r]={view:e.colorTextureViews[r].getHandle()},e.resolveTextureViews[r]&&(e.description.colorAttachments[r].resolveTarget=e.resolveTextureViews[r].getHandle(),e.description.colorAttachments[r].storeOp="discard");e.depthTextureView&&(e.description.depthStencilAttachment.view=e.depthTextureView.getHandle())},t.registerDrawCallback=(r,n)=>{for(let a=0;a<e.drawCallbacks.length;a++)if(e.drawCallbacks[a].pipeline===r){e.drawCallbacks[a].callbacks.push(n);return}e.drawCallbacks.push({pipeline:r,callbacks:[n]})};for(let r=0;r<Xo.length;r++)t[Xo[r]]=(...n)=>e.handle[Xo[r]](...n)}var vE={description:null,handle:null,boundPipeline:null,pipelineHash:null,pipelineSettings:null,replaceShaderCodeFunction:null,depthTextureView:null,label:null};function Dh(t,e,r={}){Object.assign(e,vE,r),pe(t,e),e.description={colorAttachments:[{view:void 0,loadOp:"load",storeOp:"store"}],depthStencilAttachment:{view:void 0,depthLoadOp:"clear",depthClearValue:0,depthStoreOp:"store"}},e.replaceShaderCodeFunction=n=>{let a=n.getShaderDescription("fragment");a.addOutput("vec4<f32>","outColor");let i=a.getCode();i=K.substitute(i,"//VTK::RenderEncoder::Impl",["output.outColor = computedColor;"]).result,a.setCode(i)},e.pipelineSettings={primitive:{cullMode:"none"},depthStencil:{depthWriteEnabled:!0,depthCompare:"greater-equal",format:"depth32float"},fragment:{targets:[{format:"rgba16float",blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]}},e.colorTextureViews=[],e.resolveTextureViews=[],Ee(t,e,["boundPipeline","colorTextureViews"]),de(t,e,["depthTextureView","description","handle","label","pipelineHash","pipelineSettings","replaceShaderCodeFunction"]),hE(t,e)}var dE=ue(Dh,"vtkWebGPURenderEncoder"),st={newInstance:dE,extend:Dh};function TE(t,e){return t==="unfilterable-float"&&e?.hasFeature("float32-filterable")?"float":t}function mE(t,e){e.classHierarchy.push("vtkWebGPUTextureView"),t.create=(r,n)=>{e.texture=r,e.options=n,e.options.dimension=e.options.dimension||"2d",e.options.label=e.label,e.textureHandle=r.getHandle(),e.handle=e.textureHandle.createView(e.options),e.bindGroupLayoutEntry.texture.viewDimension=e.options.dimension;let a=Ve.getDetailsFromTextureFormat(e.texture.getFormat());e.bindGroupLayoutEntry.texture.sampleType=TE(a.sampleType,e.texture.getDevice())},t.createFromTextureHandle=(r,n)=>{e.texture=null,e.options=n,e.options.dimension=e.options.dimension||"2d",e.options.label=e.label,e.textureHandle=r,e.handle=e.textureHandle.createView(e.options),e.bindGroupLayoutEntry.texture.viewDimension=e.options.dimension;let a=Ve.getDetailsFromTextureFormat(n.format);e.bindGroupLayoutEntry.texture.sampleType=a.sampleType,e.bindGroupTime.modified()},t.getBindGroupEntry=()=>({resource:t.getHandle()}),t.getShaderCode=(r,n)=>{let a="f32";e.bindGroupLayoutEntry.texture.sampleType==="sint"?a="i32":e.bindGroupLayoutEntry.texture.sampleType==="uint"&&(a="u32");let i=`@binding(${r}) @group(${n}) var ${e.label}: texture_${e.options.dimension}<${a}>;`;return e.bindGroupLayoutEntry.texture.sampleType==="depth"&&(i=`@binding(${r}) @group(${n}) var ${e.label}: texture_depth_${e.options.dimension};`),i},t.addSampler=(r,n)=>{let a=mr.newInstance({label:`${e.label}Sampler`});a.create(r,n),t.setSampler(a)},t.getBindGroupTime=()=>(e.texture&&e.texture.getHandle()!==e.textureHandle&&(e.textureHandle=e.texture.getHandle(),e.handle=e.textureHandle.createView(e.options),e.bindGroupTime.modified()),e.bindGroupTime),t.getHandle=()=>(e.texture&&e.texture.getHandle()!==e.textureHandle&&(e.textureHandle=e.texture.getHandle(),e.handle=e.textureHandle.createView(e.options),e.bindGroupTime.modified()),e.handle)}var yE={texture:null,handle:null,sampler:null,label:null};function Vh(t,e,r={}){Object.assign(e,yE,r),w.obj(t,e),e.bindGroupLayoutEntry={visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,texture:{sampleType:"float",viewDimension:"2d"}},e.bindGroupTime={},w.obj(e.bindGroupTime,{mtime:0}),w.get(t,e,["bindGroupTime","texture"]),w.setGet(t,e,["bindGroupLayoutEntry","label","sampler"]),mE(t,e)}var SE=w.newInstance(Vh),ji={newInstance:SE,extend:Vh};function xE(t,e){e.classHierarchy.push("vtkTexture"),t.imageLoaded=()=>{e.image.removeEventListener("load",t.imageLoaded),e.imageLoaded=!0,t.modified()},t.setJsImageData=r=>{e.jsImageData!==r&&(r!==null&&(t.setInputData(null),t.setInputConnection(null),e.image=null,e.canvas=null,e.imageBitmap=null),e.jsImageData=r,e.imageLoaded=!0,t.modified())},t.setImageBitmap=r=>{e.imageBitmap!==r&&(r!==null&&(t.setInputData(null),t.setInputConnection(null),e.image=null,e.canvas=null,e.jsImageData=null),e.imageBitmap=r,e.imageLoaded=!0,t.modified())},t.setCanvas=r=>{e.canvas!==r&&(r!==null&&(t.setInputData(null),t.setInputConnection(null),e.image=null,e.imageBitmap=null,e.jsImageData=null),e.canvas=r,t.modified())},t.setImage=r=>{e.image!==r&&(r!==null&&(t.setInputData(null),t.setInputConnection(null),e.canvas=null,e.jsImageData=null,e.imageBitmap=null),e.image=r,e.imageLoaded=!1,r.complete?t.imageLoaded():r.addEventListener("load",t.imageLoaded),t.modified())},t.getDimensionality=()=>{let r=0,n=0,a=1;if(t.getInputData()){let i=t.getInputData();r=i.getDimensions()[0],n=i.getDimensions()[1],a=i.getDimensions()[2]}return e.jsImageData&&(r=e.jsImageData.width,n=e.jsImageData.height),e.canvas&&(r=e.canvas.width,n=e.canvas.height),e.image&&(r=e.image.width,n=e.image.height),e.imageBitmap&&(r=e.imageBitmap.width,n=e.imageBitmap.height),(r>1)+(n>1)+(a>1)},t.getInputAsJsImageData=()=>{if(!e.imageLoaded||t.getInputData())return null;if(e.jsImageData)return e.jsImageData;if(e.imageBitmap)return e.imageBitmap;if(e.canvas)return e.canvas.getContext("2d").getImageData(0,0,e.canvas.width,e.canvas.height);if(e.image){let r=e.image.width,n=e.image.height,a=new OffscreenCanvas(r,n).getContext("2d");return a.translate(0,n),a.scale(1,-1),a.drawImage(e.image,0,0,r,n),a.getImageData(0,0,r,n)}return null}}var CE=(t,e,r)=>{let n=t.createShaderModule({code:`
    @group(0) @binding(0) var inputTexture: texture_2d<f32>;
    @group(0) @binding(1) var outputTexture: texture_storage_2d<rgba8unorm, write>;

    @compute @workgroup_size(8, 8)
    fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
      let texelCoord = vec2<i32>(global_id.xy);
      let outputSize = textureDimensions(outputTexture);

      if (texelCoord.x >= i32(outputSize.x) || texelCoord.y >= i32(outputSize.y)) {
        return;
      }

      let inputSize = textureDimensions(inputTexture);
      let scale = vec2<f32>(inputSize) / vec2<f32>(outputSize);

      // Compute the floating-point source coordinate
      let srcCoord = (vec2<f32>(texelCoord) + 0.5) * scale - 0.5;

      // Get integer coordinates for the four surrounding texels
      let x0 = i32(floor(srcCoord.x));
      let x1 = min(x0 + 1, i32(inputSize.x) - 1);
      let y0 = i32(floor(srcCoord.y));
      let y1 = min(y0 + 1, i32(inputSize.y) - 1);

      // Compute the weights
      let wx = srcCoord.x - f32(x0);
      let wy = srcCoord.y - f32(y0);

      // Fetch the four texels
      let c00 = textureLoad(inputTexture, vec2<i32>(x0, y0), 0);
      let c10 = textureLoad(inputTexture, vec2<i32>(x1, y0), 0);
      let c01 = textureLoad(inputTexture, vec2<i32>(x0, y1), 0);
      let c11 = textureLoad(inputTexture, vec2<i32>(x1, y1), 0);

      // Bilinear interpolation
      let color = mix(
        mix(c00, c10, wx),
        mix(c01, c11, wx),
        wy
      );

      textureStore(outputTexture, texelCoord, color);
    }
  `}),a=t.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,texture:{sampleType:"float"}},{binding:1,visibility:GPUShaderStage.COMPUTE,storageTexture:{format:"rgba8unorm",access:"write-only"}},{binding:2,visibility:GPUShaderStage.COMPUTE,sampler:{type:"filtering"}}]}),i=t.createPipelineLayout({bindGroupLayouts:[a]}),s=t.createComputePipeline({label:"ComputeMipmapPipeline",layout:i,compute:{module:n,entryPoint:"main"}}),o=t.createSampler({magFilter:"linear",minFilter:"linear"});for(let c=1;c<r;c++){let f=e.createView({baseMipLevel:c-1,mipLevelCount:1}),u=e.createView({baseMipLevel:c,mipLevelCount:1}),g=t.createBindGroup({layout:s.getBindGroupLayout(0),entries:[{binding:0,resource:f},{binding:1,resource:u},{binding:2,resource:o}]}),l=t.createCommandEncoder({label:"MipmapGenerateCommandEncoder"}),h=l.beginComputePass();h.setPipeline(s),h.setBindGroup(0,g);let y=Math.max(1,e.width>>c),p=Math.max(1,e.height>>c),m=Math.ceil(y/8),d=Math.ceil(p/8);h.dispatchWorkgroups(m,d),h.end(),t.queue.submit([l.finish()])}},OE={image:null,canvas:null,jsImageData:null,imageBitmap:null,imageLoaded:!1,repeat:!1,interpolate:!1,edgeClamp:!1,mipLevel:0,wrapS:null,wrapT:null,resizable:!1};function Lh(t,e,r={}){Object.assign(e,OE,r),w.obj(t,e),w.algo(t,e,6,0),w.get(t,e,["canvas","image","jsImageData","imageBitmap","imageLoaded","resizable"]),w.setGet(t,e,["repeat","edgeClamp","interpolate","mipLevel","wrapS","wrapT"]),xE(t,e)}var wE=w.newInstance(Lh,"vtkTexture"),RE={generateMipmaps:CE},Pi={newInstance:wE,extend:Lh,...RE};var{vtkErrorMacro:ia}=w;function EE(t,e){e.classHierarchy.push("vtkWebGPUTexture");let r=(o,c,f)=>Math.floor(Math.log2(Math.max(o,c,f))),n=o=>o.endsWith("16float"),a=(o,c)=>{if(n(e.format))return"Uint16Array";if(e.format.endsWith("snorm")){if(o.elementSize===1)return"Int8Array";if(o.elementSize===2)return"Int16Array"}if(o.sampleType==="sint"){if(o.elementSize===1)return"Int8Array";if(o.elementSize===2)return"Int16Array";if(o.elementSize===4)return"Int32Array"}else if(o.sampleType==="unfilterable-float"){if(o.elementSize===4)return"Float32Array"}else{if(o.elementSize===1)return"Uint8Array";if(o.elementSize===2)return"Uint16Array";if(o.elementSize===4)return"Uint32Array"}return c},i=(o,c,f,u,g=null)=>{let l=Ve.getDetailsFromTextureFormat(e.format),h=c*l.numComponents,y=h*f*u,p=n(e.format);if(!o?.length&&y>0)return ia("Texture upload failed: missing nativeArray data."),null;let m=g?.width??c,d=g?.height??f,x=g?.depth??u,T=g?.x??0,v=g?.y??0,C=g?.z??0;if(T<0||v<0||C<0||T+c>m||v+f>d||C+u>x)return ia("Texture upload failed: invalid source layout."),null;let O=(((C+u-1)*d+v+f-1)*m+T+c)*l.numComponents;if(o.length<O)return ia(`Texture upload failed: expected ${O} values but received ${o.length}.`),null;let M=o;!g&&o.length>y&&(M=o.subarray(0,y));let S=M.BYTES_PER_ELEMENT||l.elementSize,E=c*l.stride,R=256*Math.floor((E+255)/256),D=a(l,M.constructor.name),V=R/(p?2:w.newTypedArray(D,0).BYTES_PER_ELEMENT),U=h*S;if(!(g||p||M.constructor.name!==D||U!==R))return{data:M,bytesPerRow:R};let B=f*u,_=w.newTypedArray(D,V*B),N=m*l.numComponents,k=d*N;if(p)for(let F=0;F<u;F++){let G=(C+F)*k;for(let b=0;b<f;b++){let z=F*f+b,I=G+(v+b)*N+T*l.numComponents,P=z*V;for(let Q=0;Q<h;Q++)_[P+Q]=Jt.toHalf(M[I+Q])}}else if(!g&&V===h)_.set(M);else for(let F=0;F<u;F++){let G=(C+F)*k;for(let b=0;b<f;b++){let z=F*f+b,I=G+(v+b)*N+T*l.numComponents,P=z*V;_.set(M.subarray(I,I+h),P)}}return{data:_,bytesPerRow:R}},s=(o,c,f,u,g,l)=>o<0||c<0||f<0||u<=0||g<=0||l<=0?(ia(`Texture upload failed: invalid write region origin=(${o}, ${c}, ${f}) size=(${u}, ${g}, ${l}).`),!1):o+u>e.width||c+g>e.height||f+l>e.depth?(ia(`Texture upload failed: write region origin=(${o}, ${c}, ${f}) size=(${u}, ${g}, ${l}) exceeds texture extent=(${e.width}, ${e.height}, ${e.depth}).`),!1):!0;t.create=(o,c)=>{e._device=o,e.width=c.width,e.height=c.height,e.depth=c.depth?c.depth:1,c.dimension?e.dimension=c.dimension:e.dimension=e.depth===1?"2d":"3d",e.format=c.format?c.format:"rgba8unorm",e.mipLevel=c.mipLevel?Math.min(c.mipLevel,r(e.width,e.height,e.depth)):0,e.sampleCount=c.sampleCount?c.sampleCount:1,e.usage=c.usage?c.usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST,e.handle=e._device.getHandle().createTexture({size:[e.width,e.height,e.depth],format:e.format,usage:e.usage,label:e.label,dimension:e.dimension,sampleCount:e.sampleCount,mipLevelCount:e.mipLevel+1})},t.destroy=()=>{e.handle?.destroy?.(),e.handle=null,e.ready=!1},t.assignFromHandle=(o,c,f)=>{e._device=o,e.handle=c,e.width=f.width,e.height=f.height,e.depth=f.depth?f.depth:1,f.dimension?e.dimension=f.dimension:e.dimension=e.depth===1?"2d":"3d",e.format=f.format?f.format:"rgba8unorm",e.usage=f.usage?f.usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST},t.writeImageData=o=>{let c=[],f=p=>{let m=o.originZ??0,d=o.depth??1;e._device.getHandle().queue.copyExternalImageToTexture({source:p,flipY:o.flip},{texture:e.handle,premultipliedAlpha:!1,mipLevel:0,origin:{x:0,y:0,z:m}},[p.width,p.height,d]),e.dimension==="2d"&&d===1&&e.mipLevel>0&&Pi.generateMipmaps(e._device.getHandle(),e.handle,e.mipLevel+1),e.ready=!0};if(o.canvas){f(o.canvas);return}if(o.imageBitmap){o.width=o.imageBitmap.width,o.height=o.imageBitmap.height,o.depth=1,o.format="rgba8unorm",o.flip=!0,f(o.imageBitmap);return}if(o.jsImageData){o.width=o.jsImageData.width,o.height=o.jsImageData.height,o.depth=1,o.format="rgba8unorm",o.flip=!0,f(o.jsImageData);return}if(o.image){o.width=o.image.width,o.height=o.image.height,o.depth=1,o.format="rgba8unorm",o.flip=!0,f(o.image);return}o.nativeArray&&(c=o.nativeArray);let u=o.width??e.width,g=o.height??e.height,l=o.depth??1,h=i(c,u,g,l);if(!h)return;let y=h.data;e._device.getHandle().queue.writeTexture({texture:e.handle,mipLevel:0,origin:{x:0,y:0,z:o.originZ??0}},y,{offset:0,bytesPerRow:h.bytesPerRow,rowsPerImage:g},{width:u,height:g,depthOrArrayLayers:l}),e.dimension==="2d"&&l===1&&e.mipLevel>0&&Pi.generateMipmaps(e._device.getHandle(),e.handle,e.mipLevel+1),e.ready=!0},t.writeSubImageData=o=>{let c=o.x??0,f=o.y??0,u=o.z??0,g=o.width??e.width-c,l=o.height??e.height-f,h=o.depth??e.depth-u,y=o.nativeArray||[];if(!s(c,f,u,g,l,h))return!1;let p=i(y,g,l,h,o.sourceLayout);return p?(e._device.getHandle().queue.writeTexture({texture:e.handle,mipLevel:0,origin:{x:c,y:f,z:u}},p.data,{offset:0,bytesPerRow:p.bytesPerRow,rowsPerImage:l},{width:g,height:l,depthOrArrayLayers:h}),o.deferMipmaps||t.generateMipmaps(),e.ready=!0,!0):!1},t.generateMipmaps=()=>{t.getDimensionality()!==3&&e.mipLevel>0&&Pi.generateMipmaps(e._device.getHandle(),e.handle,e.mipLevel+1)},t.getScale=()=>{if(e.format.endsWith("16unorm"))return 65535;if(e.format.endsWith("16snorm"))return 32767;let o=Ve.getDetailsFromTextureFormat(e.format);return(o.sampleType==="float"||o.sampleType==="unfilterable-float")&&o.elementSize>=2?1:255},t.getNumberOfComponents=()=>Ve.getDetailsFromTextureFormat(e.format).numComponents,t.getDimensionality=()=>{let o=0;return e.width>1&&o++,e.height>1&&o++,e.depth>1&&o++,o},t.resizeToMatch=o=>{(o.getWidth()!==e.width||o.getHeight()!==e.height||o.getDepth()!==e.depth)&&(e.width=o.getWidth(),e.height=o.getHeight(),e.depth=o.getDepth(),e.handle=e._device.getHandle().createTexture({size:[e.width,e.height,e.depth],dimension:e.dimension,format:e.format,usage:e.usage,label:e.label,sampleCount:e.sampleCount}))},t.resize=(o,c,f=1)=>{(o!==e.width||c!==e.height||f!==e.depth)&&(e.width=o,e.height=c,e.depth=f,e.handle=e._device.getHandle().createTexture({size:[e.width,e.height,e.depth],dimension:e.dimension,format:e.format,usage:e.usage,label:e.label,sampleCount:e.sampleCount}))},t.createView=(o,c={})=>{c.dimension||(e.dimension==="3d"?c.dimension="3d":e.depth===1?c.dimension="2d":c.dimension="2d-array");let f=ji.newInstance({label:o});return f.create(t,c),f}}var ME={_device:null,dimension:"2d",handle:null,buffer:null,ready:!1,label:null,sampleCount:1};function _h(t,e,r={}){Object.assign(e,ME,r),w.obj(t,e),w.get(t,e,["dimension","handle","ready","width","height","depth","format","mipLevel","usage","sampleCount"]),w.setGet(t,e,["_device","label"]),EE(t,e)}var DE=w.newInstance(_h),Ye={newInstance:DE,extend:_h};function VE(t,e){e.classHierarchy.push("vtkWebGPUOpaquePass"),t.traverse=(r,n)=>{if(e.deleted)return;e._currentParent=n;let a=n.getDevice(),i=Math.max(1,n.getMultiSample?.()??1);if(e.renderEncoder&&e._currentSampleCount!==i&&(e.renderEncoder=null,e.colorTexture=null,e.depthTexture=null,e.resolveColorTexture=null,e._resolveColorTextureView=null),e.renderEncoder){let s=n.getCanvas().width,o=n.getCanvas().height;e.colorTexture.resize(s,o),e.depthTexture.resize(s,o),e.resolveColorTexture&&e.resolveColorTexture.resize(s,o)}else{t.createRenderEncoder(i),e._currentSampleCount=i;let s=n.getCanvas().width,o=n.getCanvas().height;e.colorTexture=Ye.newInstance({label:"opaquePassColor"}),e.colorTexture.create(a,{width:s,height:o,format:"rgba16float",sampleCount:i,usage:GPUTextureUsage.RENDER_ATTACHMENT|(i===1?GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC:0)});let c=e.colorTexture.createView("opaquePassColorTexture");if(e.renderEncoder.setColorTextureView(0,c),i>1){e.resolveColorTexture=Ye.newInstance({label:"opaquePassResolveColor"}),e.resolveColorTexture.create(a,{width:s,height:o,format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),e._resolveColorTextureView=e.resolveColorTexture.createView("opaquePassColorTexture");let u=e._resolveColorTextureView;e.renderEncoder.setResolveTextureView(0,u)}e.depthFormat="depth32float",e.depthTexture=Ye.newInstance({label:"opaquePassDepth"}),e.depthTexture.create(a,{width:s,height:o,format:e.depthFormat,sampleCount:i,usage:GPUTextureUsage.RENDER_ATTACHMENT|(i===1?GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC:0)});let f=e.depthTexture.createView("opaquePassDepthTexture");e.renderEncoder.setDepthTextureView(f)}e.renderEncoder.attachTextureViews(),t.setCurrentOperation("opaquePass"),r.setRenderEncoder(e.renderEncoder),r.traverse(t)},t.getColorTextureView=()=>e._resolveColorTextureView?e._resolveColorTextureView:e.renderEncoder.getColorTextureViews()[0],t.getDepthTextureView=()=>e.renderEncoder.getDepthTextureView(),t.createRenderEncoder=(r=1)=>{if(e.renderEncoder=st.newInstance({label:"OpaquePass"}),e.renderEncoder.setPipelineHash(`op${r}`),r>1){let n=e.renderEncoder.getPipelineSettings();n.multisample={count:r},e.renderEncoder.setPipelineSettings(n)}},t.releaseGraphicsResources=()=>{e.renderEncoder=null,e.colorTexture=null,e.depthTexture=null}}var LE={renderEncoder:null,colorTexture:null,depthTexture:null,resolveColorTexture:null};function Bh(t,e,r={}){Object.assign(e,LE,r),Xe.extend(t,e,r),w.get(t,e,["colorTexture","depthTexture","resolveColorTexture"]),VE(t,e)}var _E=w.newInstance(Bh,"vtkWebGPUOpaquePass"),Fh={newInstance:_E,extend:Bh};var BE=`
//VTK::Mapper::Dec

//VTK::TCoord::Dec

//VTK::RenderEncoder::Dec

//VTK::IOStructs::Dec

@fragment
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output: fragmentOutput;

  var tcoord: vec2<i32> = vec2<i32>(i32(input.fragPos.x), i32(input.fragPos.y));
  var reveal: f32 = textureLoad(oitpAccumTexture, tcoord, 0).r;
  if (reveal == 1.0) { discard; }
  var tcolor: vec4<f32> = textureLoad(oitpColorTexture, tcoord, 0);
  var total: f32 = max(tcolor.a, 0.01);
  var computedColor: vec4<f32> = vec4<f32>(tcolor.r/total, tcolor.g/total, tcolor.b/total, 1.0 - reveal);

  //VTK::RenderEncoder::Impl
  return output;
}
`;function FE(t,e){e.classHierarchy.push("vtkWebGPUOrderIndependentTranslucentPass"),t.traverse=(r,n)=>{if(e.deleted)return;e._currentParent=n;let a=n.getDevice(),i=Math.max(1,n.getMultiSample?.()??1);if(e.translucentRenderEncoder&&e._currentSampleCount!==i&&(e.translucentRenderEncoder=null,e.translucentColorTexture=null,e.translucentAccumulateTexture=null,e.translucentResolveColorTexture=null,e.translucentResolveAccumulateTexture=null,e._resolveColorView=null,e._resolveAccumulateView=null),e.translucentRenderEncoder)e.translucentColorTexture.resizeToMatch(e.colorTextureView.getTexture()),e.translucentAccumulateTexture.resizeToMatch(e.colorTextureView.getTexture()),e.translucentResolveColorTexture&&(e.translucentResolveColorTexture.resizeToMatch(e.colorTextureView.getTexture()),e.translucentResolveAccumulateTexture.resizeToMatch(e.colorTextureView.getTexture()));else{t.createRenderEncoder(i),t.createFinalEncoder(),e._currentSampleCount=i,e.translucentColorTexture=Ye.newInstance({label:"translucentPassColor"}),e.translucentColorTexture.create(a,{width:n.getCanvas().width,height:n.getCanvas().height,format:"rgba16float",sampleCount:i,usage:GPUTextureUsage.RENDER_ATTACHMENT|(i===1?GPUTextureUsage.TEXTURE_BINDING:0)});let s=e.translucentColorTexture.createView("oitpColorTexture");e.translucentRenderEncoder.setColorTextureView(0,s),i>1&&(e.translucentResolveColorTexture=Ye.newInstance({label:"translucentPassResolveColor"}),e.translucentResolveColorTexture.create(a,{width:n.getCanvas().width,height:n.getCanvas().height,format:"rgba16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),e._resolveColorView=e.translucentResolveColorTexture.createView("oitpColorTexture"),e.translucentRenderEncoder.setResolveTextureView(0,e._resolveColorView)),e.translucentAccumulateTexture=Ye.newInstance({label:"translucentPassAccumulate"}),e.translucentAccumulateTexture.create(a,{width:n.getCanvas().width,height:n.getCanvas().height,format:"r16float",sampleCount:i,usage:GPUTextureUsage.RENDER_ATTACHMENT|(i===1?GPUTextureUsage.TEXTURE_BINDING:0)});let o=e.translucentAccumulateTexture.createView("oitpAccumTexture");e.translucentRenderEncoder.setColorTextureView(1,o),i>1&&(e.translucentResolveAccumulateTexture=Ye.newInstance({label:"translucentPassResolveAccumulate"}),e.translucentResolveAccumulateTexture.create(a,{width:n.getCanvas().width,height:n.getCanvas().height,format:"r16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),e._resolveAccumulateView=e.translucentResolveAccumulateTexture.createView("oitpAccumTexture"),e.translucentRenderEncoder.setResolveTextureView(1,e._resolveAccumulateView)),e.fullScreenQuad=xt.newInstance(),e.fullScreenQuad.setDevice(n.getDevice()),e.fullScreenQuad.setPipelineHash("oitpfsq");let c=i>1?[e._resolveColorView,e._resolveAccumulateView]:e.translucentRenderEncoder.getColorTextureViews();e.fullScreenQuad.setTextureViews(c),e.fullScreenQuad.setFragmentShaderTemplate(BE)}e.translucentRenderEncoder.setDepthTextureView(e.depthTextureView),e.translucentRenderEncoder.attachTextureViews(),t.setCurrentOperation("translucentPass"),r.setOpaqueColorTextureView(e.colorTextureView),r.setRenderEncoder(e.translucentRenderEncoder),r.traverse(t),t.finalPass(n,r)},t.finalPass=(r,n)=>{e.translucentFinalEncoder.setColorTextureView(0,e.colorTextureView),e.translucentFinalEncoder.attachTextureViews(),e.translucentFinalEncoder.begin(r.getCommandEncoder()),n.scissorAndViewport(e.translucentFinalEncoder),e.fullScreenQuad.prepareAndDraw(e.translucentFinalEncoder),e.translucentFinalEncoder.end()},t.getTextures=()=>[e.translucentColorTexture,e.translucentAccumulateTexture],t.createRenderEncoder=(r=1)=>{e.translucentRenderEncoder=st.newInstance({label:"translucentRender"});let n=e.translucentRenderEncoder.getDescription();n.colorAttachments=[{view:void 0,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"},{view:void 0,clearValue:[1,0,0,0],loadOp:"clear",storeOp:"store"}],n.depthStencilAttachment={view:void 0,depthLoadOp:"load",depthStoreOp:"store"},e.translucentRenderEncoder.setReplaceShaderCodeFunction(a=>{let i=a.getShaderDescription("fragment");i.addOutput("vec4<f32>","outColor"),i.addOutput("f32","outAccum"),i.addBuiltinInput("vec4<f32>","@builtin(position) fragPos");let s=i.getCode();s=K.substitute(s,"//VTK::RenderEncoder::Impl",["var w: f32 = computedColor.a * pow(0.1 + input.fragPos.z, 2.0);","output.outColor = vec4<f32>(computedColor.rgb*w, w);","output.outAccum = computedColor.a;"]).result,i.setCode(s)}),e.translucentRenderEncoder.setPipelineHash(`oitpr${r}`),e.translucentRenderEncoder.setPipelineSettings({primitive:{cullMode:"none"},...r>1?{multisample:{count:r}}:{},depthStencil:{depthWriteEnabled:!1,depthCompare:"greater-equal",format:"depth32float"},fragment:{targets:[{format:"rgba16float",blend:{color:{srcFactor:"one",dstFactor:"one"},alpha:{srcFactor:"one",dstFactor:"one"}}},{format:"r16float",blend:{color:{srcFactor:"zero",dstFactor:"one-minus-src"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]}})},t.createFinalEncoder=()=>{e.translucentFinalEncoder=st.newInstance({label:"translucentFinal"}),e.translucentFinalEncoder.setDescription({colorAttachments:[{view:null,loadOp:"load",storeOp:"store"}]}),e.translucentFinalEncoder.setReplaceShaderCodeFunction(r=>{let n=r.getShaderDescription("fragment");n.addOutput("vec4<f32>","outColor"),n.addBuiltinInput("vec4<f32>","@builtin(position) fragPos");let a=n.getCode();a=K.substitute(a,"//VTK::RenderEncoder::Impl",["output.outColor = vec4<f32>(computedColor.rgb, computedColor.a);"]).result,n.setCode(a)}),e.translucentFinalEncoder.setPipelineHash("oitpf"),e.translucentFinalEncoder.setPipelineSettings({primitive:{cullMode:"none"},fragment:{targets:[{format:"rgba16float",blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]}})},t.releaseGraphicsResources=()=>{e.translucentRenderEncoder=null,e.translucentFinalEncoder=null,e.translucentColorTexture=null,e.translucentAccumulateTexture=null,e.fullScreenQuad=null}}var UE={colorTextureView:null,depthTextureView:null,fullScreenQuad:null,translucentResolveColorTexture:null,translucentResolveAccumulateTexture:null};function Uh(t,e,r={}){Object.assign(e,UE,r),Xe.extend(t,e,r),w.setGet(t,e,["colorTextureView","depthTextureView"]),w.get(t,e,["fullScreenQuad","translucentResolveAccumulateTexture","translucentResolveColorTexture"]),FE(t,e)}var NE=w.newInstance(Uh,"vtkWebGPUOrderIndependentTranslucentPass"),Nh={newInstance:NE,extend:Uh};var{vtkWarningMacro:Yo}=w,GE=`
//VTK::Renderer::Dec

//VTK::Mapper::Dec

//VTK::TCoord::Dec

//VTK::Volume::TraverseDec

//VTK::RenderEncoder::Dec

//VTK::IOStructs::Dec

fn getTextureValue(vTex: texture_3d<f32>, tpos: vec4<f32>, vNum: i32) -> vec4<f32>
{
  let forceNearestMask = i32(volumeSSBO.values[vNum].componentInfo.w);
  if (forceNearestMask == 0)
  {
    return textureSampleLevel(vTex, clampSampler, tpos.xyz, 0.0);
  }

  // Match the OpenGL mapper's nearest-interpolation convention: re-sample at
  // the texel center (floor(p*dims)+0.5)/dims through the clamp sampler rather
  // than a raw textureLoad. This keeps boundary behaviour identical to WebGL.
  let dims = vec3<f32>(textureDimensions(vTex, 0));
  let nearestPos = (floor(tpos.xyz * dims) + vec3<f32>(0.5)) / dims;
  let nearestValue = textureSampleLevel(vTex, clampSampler, nearestPos, 0.0);
  if (forceNearestMask == 15)
  {
    return nearestValue;
  }

  var value = textureSampleLevel(vTex, clampSampler, tpos.xyz, 0.0);

  if ((forceNearestMask & 1) != 0) { value.x = nearestValue.x; }
  if ((forceNearestMask & 2) != 0) { value.y = nearestValue.y; }
  if ((forceNearestMask & 4) != 0) { value.z = nearestValue.z; }
  if ((forceNearestMask & 8) != 0) { value.w = nearestValue.w; }

  return value;
}

fn getComponent(v: vec4<f32>, idx: u32) -> f32
{
  if (idx == 0u) { return v.x; }
  if (idx == 1u) { return v.y; }
  if (idx == 2u) { return v.z; }
  return v.w;
}

fn getComponentValue(vTex: texture_3d<f32>, tpos: vec4<f32>, vNum: i32, component: u32) -> f32
{
  return getComponent(getTextureValue(vTex, tpos, vNum), component);
}

fn getDependentOpacityValue(sample: vec4<f32>, numComp: u32) -> f32
{
  if (numComp == 1u) { return sample.x; }
  if (numComp == 2u) { return sample.y; }
  if (numComp == 3u) { return length(sample.xyz); }
  return sample.w;
}

fn getDependentValue(vTex: texture_3d<f32>, tpos: vec4<f32>, vNum: i32, numComp: u32) -> f32
{
  return getDependentOpacityValue(getTextureValue(vTex, tpos, vNum), numComp);
}

fn getTraverseValue(sample: vec4<f32>, vNum: i32) -> f32
{
  let numComp: u32 = u32(volumeSSBO.values[vNum].componentInfo.x);
  if (volumeSSBO.values[vNum].componentInfo.y > 0.5) { return sample.x; }
  return getDependentOpacityValue(sample, numComp);
}

fn getTFunRowCoord(rowIdx: i32, tfunRows: f32) -> f32
{
  return (0.5 + 2.0 * f32(rowIdx)) / tfunRows;
}

fn intersectRayBoundsWithClipPlanes(vNum: i32, minPosSC: vec4<f32>, rayStepSC: vec4<f32>, rayBounds: vec2<f32>) -> vec2<f32>
{
  var result: vec2<f32> = rayBounds;
  let clipCount: i32 = i32(volumeSSBO.values[vNum].clipPlaneStates.x);
  if (clipCount <= 0)
  {
    return result;
  }

  ${Array.from({length:6},(t,e)=>`
  if (clipCount > ${e})
  {
    let clipPlane${e}: vec4<f32> = volumeSSBO.values[vNum].clipPlane${e};
    let rayDirRatio${e}: f32 = dot(rayStepSC, clipPlane${e});
    let equationResult${e}: f32 = dot(minPosSC, clipPlane${e});

    let absRayDirRatio${e}: f32 = abs(rayDirRatio${e});
    if (absRayDirRatio${e} > 1e-6)
    {
      let intersection${e}: f32 = -equationResult${e} / rayDirRatio${e};
      result.x = select(result.x, max(result.x, intersection${e}), rayDirRatio${e} > 0.0);
      result.y = select(result.y, min(result.y, intersection${e}), rayDirRatio${e} < 0.0);
    }
    else if (equationResult${e} < 0.0)
    {
      result.x = result.y;
    }

    if (result.x >= result.y)
    {
      return result;
    }
  }`).join(`
`)}

  return result;
}

fn getLabelOutlineThickness(vNum: i32, segmentIndex: i32) -> i32
{
  if (segmentIndex == 0)
  {
    return 0;
  }

  let dims = vec2<i32>(textureDimensions(labelOutlineThicknessTexture, 0));
  let x = clamp(segmentIndex - 1, 0, dims.x - 1);
  let y = clamp(vNum, 0, dims.y - 1);
  return i32(round(textureLoad(labelOutlineThicknessTexture, vec2<i32>(x, y), 0).r * 255.0));
}

// project a viewport tcoord (0..1) at the given NDC depth into the volume's
// texture coordinates.
fn labelFragToTPos(vNum: i32, tcoord: vec2<f32>, fragZ: f32) -> vec4<f32>
{
  let pcPos = vec4<f32>(2.0 * tcoord.x - 1.0, 1.0 - 2.0 * tcoord.y, fragZ, 1.0);
  var scPos = rendererUBO.PCSCMatrix * pcPos;
  scPos = scPos * (1.0 / scPos.w);
  // no half texel offset here: the SCTCMatrix already addresses texel centers
  return volumeSSBO.values[vNum].SCTCMatrix * scPos;
}

// Screen space label outline compare the segment under this fragment with the
// segments under its screen neighbors within the per segment thickness;
// any mismatch means we are on an edge and the outline color is emitted.
// labelOutline = (useLabelOutline, outlineOpacity, textureScale, unused)
fn getColorForLabelOutline(vTex: texture_3d<f32>, tcoord: vec2<f32>, fragZ: f32, vNum: i32, rowStart: i32, tfunRows: f32) -> vec4<f32>
{
  let centerTPos = labelFragToTPos(vNum, tcoord, fragZ);
  if (
    centerTPos.x < 0.0 || centerTPos.y < 0.0 || centerTPos.z < 0.0 ||
    centerTPos.x > 1.0 || centerTPos.y > 1.0 || centerTPos.z > 1.0
  )
  {
    return vec4<f32>(0.0);
  }

  let centerValue = getTextureValue(vTex, centerTPos, vNum);
  // recover the raw label value from the normalized texture sample
  let segmentIndex = i32(round(centerValue.r * volumeSSBO.values[vNum].labelOutline.z));
  if (segmentIndex == 0)
  {
    return vec4<f32>(0.0);
  }

  let rowCoord = getTFunRowCoord(rowStart, tfunRows);
  var coord = vec2<f32>(
    centerValue.r * volumeSSBO.values[vNum].colorScale.x +
      volumeSSBO.values[vNum].colorShift.x,
    rowCoord
  );
  let color = textureSampleLevel(tfunTexture, clampSampler, coord, 0.0).rgb;
  coord.x = centerValue.r * volumeSSBO.values[vNum].opacityScale.x +
    volumeSSBO.values[vNum].opacityShift.x;
  let opacity = textureSampleLevel(ofunTexture, clampSampler, coord, 0.0).r;

  let actualThickness = getLabelOutlineThickness(vNum, segmentIndex);
  if (actualThickness <= 0)
  {
    return vec4<f32>(color, opacity);
  }

  // one fragment in viewport tcoord units
  let fragStep = vec2<f32>(1.0, 1.0) / rendererUBO.viewportSize;

  for (var i = -actualThickness; i <= actualThickness; i = i + 1)
  {
    for (var j = -actualThickness; j <= actualThickness; j = j + 1)
    {
      if (i == 0 && j == 0)
      {
        continue;
      }

      let neighborTcoord = tcoord + vec2<f32>(f32(i), f32(j)) * fragStep;
      let neighborTPos = labelFragToTPos(vNum, neighborTcoord, fragZ);
      let neighborValue = getTextureValue(vTex, neighborTPos, vNum);
      if (any(neighborValue != centerValue))
      {
        return vec4<f32>(color, volumeSSBO.values[vNum].labelOutline.y);
      }
    }
  }

  return vec4<f32>(color, opacity);
}

fn getGradient(vTex: texture_3d<f32>, tpos: vec4<f32>, vNum: i32, component: u32) -> vec4<f32>
{
  var result: vec4<f32>;

  var tstep: vec4<f32> = volumeSSBO.values[vNum].tstep;
  // Central differences (matches the OpenGL/WebGL mapper) for smoother normals.
  result.x = getComponentValue(vTex, tpos + vec4<f32>(tstep.x, 0.0, 0.0, 0.0), vNum, component)
           - getComponentValue(vTex, tpos - vec4<f32>(tstep.x, 0.0, 0.0, 0.0), vNum, component);
  result.y = getComponentValue(vTex, tpos + vec4<f32>(0.0, tstep.y, 0.0, 0.0), vNum, component)
           - getComponentValue(vTex, tpos - vec4<f32>(0.0, tstep.y, 0.0, 0.0), vNum, component);
  result.z = getComponentValue(vTex, tpos + vec4<f32>(0.0, 0.0, tstep.z, 0.0), vNum, component)
           - getComponentValue(vTex, tpos - vec4<f32>(0.0, 0.0, tstep.z, 0.0), vNum, component);
  // WebGPU texture coordinates have their Y axis opposite to the image-index
  // convention used by the OpenGL volume shader.
  result.y = -result.y;
  result.w = 0.0;

  // central difference spans two samples, so the delta is twice the spacing
  result = result / (2.0 * volumeSSBO.values[vNum].spacing);
  // now we have a gradient in unit tcoords

  var grad: f32 = length(result.xyz);
  if (grad > 0.0)
  {
    // rotate to View Coords, needed for lighting and shading
    var nMat: mat4x4<f32> = rendererUBO.SCVCMatrix * volumeSSBO.values[vNum].planeNormals;
    result = nMat * result;
    result = result / length(result);
  }

  // store gradient magnitude in .w
  result.w = grad;

  return result;
}

fn getDependentGradient(vTex: texture_3d<f32>, tpos: vec4<f32>, vNum: i32, numComp: u32) -> vec4<f32>
{
  var result: vec4<f32>;

  var tstep: vec4<f32> = volumeSSBO.values[vNum].tstep;
  // Central differences (matches the OpenGL/WebGL mapper) for smoother normals.
  result.x = getDependentValue(vTex, tpos + vec4<f32>(tstep.x, 0.0, 0.0, 0.0), vNum, numComp)
           - getDependentValue(vTex, tpos - vec4<f32>(tstep.x, 0.0, 0.0, 0.0), vNum, numComp);
  result.y = getDependentValue(vTex, tpos + vec4<f32>(0.0, tstep.y, 0.0, 0.0), vNum, numComp)
           - getDependentValue(vTex, tpos - vec4<f32>(0.0, tstep.y, 0.0, 0.0), vNum, numComp);
  result.z = getDependentValue(vTex, tpos + vec4<f32>(0.0, 0.0, tstep.z, 0.0), vNum, numComp)
           - getDependentValue(vTex, tpos - vec4<f32>(0.0, 0.0, tstep.z, 0.0), vNum, numComp);
  result.y = -result.y;
  result.w = 0.0;

  // central difference spans two samples, so the delta is twice the spacing
  result = result / (2.0 * volumeSSBO.values[vNum].spacing);

  var grad: f32 = length(result.xyz);
  if (grad > 0.0)
  {
    var nMat: mat4x4<f32> = rendererUBO.SCVCMatrix * volumeSSBO.values[vNum].planeNormals;
    result = nMat * result;
    result = result / length(result);
  }

  result.w = grad;

  return result;
}

// Compute the lighting normal after mapping neighboring scalar values through
// the opacity transfer function. This matches computeDensityNormal in the
// OpenGL volume shader and is used when computeNormalFromOpacity is enabled.
fn getOpacityGradient(
  vTex: texture_3d<f32>, tpos: vec4<f32>, vNum: i32,
  component: u32, rowIdx: i32, gradientOpacity: f32) -> vec4<f32>
{
  let tstep = volumeSSBO.values[vNum].tstep;
  let tfunRows = f32(textureDimensions(ofunTexture).y);
  var result = vec4<f32>(
    getOpacity(getComponentValue(vTex, tpos + vec4<f32>(tstep.x, 0.0, 0.0, 0.0), vNum, component), rowIdx, tfunRows) -
      getOpacity(getComponentValue(vTex, tpos - vec4<f32>(tstep.x, 0.0, 0.0, 0.0), vNum, component), rowIdx, tfunRows),
    getOpacity(getComponentValue(vTex, tpos + vec4<f32>(0.0, tstep.y, 0.0, 0.0), vNum, component), rowIdx, tfunRows) -
      getOpacity(getComponentValue(vTex, tpos - vec4<f32>(0.0, tstep.y, 0.0, 0.0), vNum, component), rowIdx, tfunRows),
    getOpacity(getComponentValue(vTex, tpos + vec4<f32>(0.0, 0.0, tstep.z, 0.0), vNum, component), rowIdx, tfunRows) -
      getOpacity(getComponentValue(vTex, tpos - vec4<f32>(0.0, 0.0, tstep.z, 0.0), vNum, component), rowIdx, tfunRows),
    0.0
  );
  result.y = -result.y;
  result = result * gradientOpacity / volumeSSBO.values[vNum].spacing;
  let gradientMagnitude = length(result.xyz);
  if (gradientMagnitude > 0.0)
  {
    let normalMatrix = rendererUBO.SCVCMatrix * volumeSSBO.values[vNum].planeNormals;
    result = normalMatrix * result;
    result = vec4<f32>(normalize(result.xyz), gradientMagnitude);
  }
  result.w = gradientMagnitude;
  return result;
}

fn getSampleOpacity(vTex: texture_3d<f32>, sample: vec4<f32>, tpos: vec4<f32>, vNum: i32, rowStart: i32) -> f32
{
  let numComp: u32 = u32(volumeSSBO.values[vNum].componentInfo.x);
  let independent = volumeSSBO.values[vNum].componentInfo.y > 0.5;
  let tfunRows = f32(textureDimensions(tfunTexture).y);

  if (independent)
  {
    var alpha: f32 = 0.0;
    for (var c: u32 = 0u; c < numComp; c = c + 1u)
    {
      let rowIdx: i32 = rowStart + i32(c);
      let scalar = getComponent(sample, c);
      var opacity = getOpacity(scalar, rowIdx, tfunRows);
      if (componentSSBO.values[rowIdx].gomin < 1.0)
      {
        let normal = getGradient(vTex, tpos, vNum, c);
        let gofactor = clamp(
          normal.a * componentSSBO.values[rowIdx].goScale + componentSSBO.values[rowIdx].goShift,
          componentSSBO.values[rowIdx].gomin,
          componentSSBO.values[rowIdx].gomax
        );
        opacity = opacity * gofactor;
      }
      alpha = alpha + componentSSBO.values[rowIdx].mixWeight * opacity;
    }
    return min(alpha, 1.0);
  }

  let opacityScalar = getDependentOpacityValue(sample, numComp);
  var opacity: f32;
  if (numComp == 1u)
  {
    opacity = getOpacity(sample.r, rowStart, tfunRows);
  }
  else if (numComp == 2u)
  {
    opacity = getOpacity(sample.g, rowStart, tfunRows);
  }
  else if (numComp == 3u)
  {
    opacity = getOpacity(opacityScalar, rowStart, tfunRows);
  }
  else
  {
    opacity = getOpacity(sample.a, rowStart, tfunRows);
  }

  if (componentSSBO.values[rowStart].gomin < 1.0)
  {
    let normal = getDependentGradient(vTex, tpos, vNum, numComp);
    let gofactor = clamp(
      normal.a * componentSSBO.values[rowStart].goScale + componentSSBO.values[rowStart].goShift,
      componentSSBO.values[rowStart].gomin,
      componentSSBO.values[rowStart].gomax
    );
    opacity = opacity * gofactor;
  }

  return opacity;
}

fn getViewVector(posVC: vec3<f32>) -> vec3<f32>
{
  if (rendererUBO.cameraParallel != 0u)
  {
    return vec3<f32>(0.0, 0.0, 1.0);
  }
  return normalize(-posVC);
}

fn getRayDirection(posVC: vec3<f32>) -> vec3<f32>
{
  return -getViewVector(posVC);
}

fn phaseFunction(cosAngle: f32, vNum: i32) -> f32
{
  let anisotropy = volumeSSBO.values[vNum].scattering.z;
  if (abs(anisotropy) <= 0.000001)
  {
    return 0.5;
  }

  let anisotropy2 = volumeSSBO.values[vNum].scattering.w;
  return ((1.0 - anisotropy2) /
    pow(1.0 + anisotropy2 - 2.0 * anisotropy * cosAngle, 1.5)) *
    0.5;
}

fn getVolumeLightDirection(posVC: vec3<f32>, lightIdx: i32) -> vec3<f32>
{
  let lightType = i32(rendererLightSSBO.values[lightIdx].LightData.x);
  if (lightType == 1)
  {
    return -normalize(
      (rendererUBO.WCVCNormals *
        vec4<f32>(normalize(rendererLightSSBO.values[lightIdx].LightDir.xyz), 0.0)).xyz
    );
  }

  let lightPosVC = rendererLightSSBO.values[lightIdx].LightPos.xyz;
  let lightOffset = lightPosVC - posVC;
  let lightDistance = length(lightOffset);
  if (lightDistance <= 0.0)
  {
    return vec3<f32>(0.0, 0.0, 0.0);
  }
  return lightOffset / lightDistance;
}

fn getFragmentSeed(fragPos: vec4<f32>) -> f32
{
  let firstNoise =
    fract(sin(dot(fragPos.xy, vec2<f32>(12.9898, 78.233))) * 43758.5453);
  let x = (i32(floor(fragPos.x)) % 32 + 32) % 32;
  let y = (i32(floor(fragPos.y)) % 32 + 32) % 32;
  let secondNoise = jitterSSBO.values[y * 32 + x].value;
  let noiseSum = firstNoise + secondNoise;
  return select(noiseSum - 1.0, noiseSum, noiseSum < 1.0);
}

fn sampleDirectionUniform(fragmentSeed: f32, rayIndex: i32) -> vec3<f32>
{
  let rayRandomness = kernelSampleSSBO.values[rayIndex].value;
  var mergedRandom = rayRandomness + vec2<f32>(fragmentSeed, fragmentSeed);
  if (mergedRandom.x >= 1.0) { mergedRandom.x = mergedRandom.x - 1.0; }
  if (mergedRandom.y >= 1.0) { mergedRandom.y = mergedRandom.y - 1.0; }
  let u = mergedRandom.x;
  let v = mergedRandom.y;
  let theta = u * 6.28318530718;
  let phi = acos(2.0 * v - 1.0);
  let sinTheta = sin(theta);
  let cosTheta = cos(theta);
  let sinPhi = sin(phi);
  let cosPhi = cos(phi);
  return vec3<f32>(sinPhi * cosTheta, sinPhi * sinTheta, cosPhi);
}

fn computeLAO(vTex: texture_3d<f32>, fragPos: vec4<f32>, posVC: vec3<f32>, normalVC: vec4<f32>, originalOpacity: f32, vNum: i32, rowStart: i32) -> f32
{
  if (normalVC.w <= 0.0 || originalOpacity <= 0.05)
  {
    return 1.0;
  }

  let kernelSize = i32(volumeSSBO.values[vNum].lao.x);
  if (kernelSize <= 0)
  {
    return 1.0;
  }
  let kernelRadius = i32(volumeSSBO.values[vNum].lao.y);
  let fragmentSeed = getFragmentSeed(fragPos);

  var visibilitySum = 0.0;
  var weightSum = 0.0;
  var i: i32 = 0;
  loop
  {
    if (i >= kernelSize) { break; }
    var rayDirectionVC = sampleDirectionUniform(fragmentSeed, i);
    var normalDotRay = dot(normalVC.xyz, rayDirectionVC);
    if (normalDotRay > 0.0)
    {
      rayDirectionVC = -rayDirectionVC;
      normalDotRay = -normalDotRay;
    }

    var currTC = (volumeSSBO.values[vNum].VCTCMatrix * vec4<f32>(posVC, 1.0)).xyz;
    let rayStepTC = (volumeSSBO.values[vNum].VCTCMatrix *
      vec4<f32>(rayDirectionVC * mapperUBO.SampleDistance, 0.0)).xyz;
    var visibility = 1.0;

    var j: i32 = 0;
    loop
    {
      if (j >= kernelRadius) { break; }
      currTC = currTC + rayStepTC;
      if (any(currTC < vec3<f32>(0.0)) || any(currTC > vec3<f32>(1.0)))
      {
        break;
      }
      let sampleTC = vec4<f32>(currTC, 1.0);
      let opacity = getSampleOpacity(vTex, getTextureValue(vTex, sampleTC, vNum), sampleTC, vNum, rowStart);
      visibility = visibility * (1.0 - opacity);
      if (visibility <= 0.000001)
      {
        visibility = 0.0;
        break;
      }
      j++;
    }

    let rayWeight = -normalDotRay;
    visibilitySum = visibilitySum + visibility * rayWeight;
    weightSum = weightSum + rayWeight;
    i++;
  }

  if (weightSum == 0.0)
  {
    return 1.0;
  }

  // LAO factor is the average ray visibility (low visibility -> low ambient).
  // The 0.3 floor matches the OpenGL mapper and reduces variance/noise so that
  // heavily occluded samples never collapse to fully black.
  return clamp(visibilitySum / weightSum, 0.3, 1.0);
}

fn applySurfaceLighting(vTex: texture_3d<f32>, fragPos: vec4<f32>, tColor: vec3<f32>, alpha: f32, posVC: vec3<f32>, normalVC: vec4<f32>, vNum: i32, rowStart: i32) -> vec3<f32>
{
  if (rendererUBO.LightCount <= 0)
  {
    return tColor;
  }

  let lighting = volumeSSBO.values[vNum].lighting;
  let ambient = lighting.x;
  let diffuseCoeff = lighting.y;
  let specularCoeff = lighting.z;
  let specularPower = lighting.w;
  let viewDir = getViewVector(posVC);
  let laoFactor = computeLAO(vTex, fragPos, posVC, normalVC, alpha, vNum, rowStart);

  var diffuse = vec3<f32>(0.0);
  var specular = vec3<f32>(0.0);

  var i: i32 = 0;
  loop
  {
    if (i >= rendererUBO.LightCount) { break; }

    let lightColor =
      rendererLightSSBO.values[i].LightColor.rgb *
      (rendererLightSSBO.values[i].LightColor.w * 0.2);
    let lightType = i32(rendererLightSSBO.values[i].LightData.x);

    var lightDirection = vec3<f32>(0.0);
    var attenuation = 1.0;

    if (lightType == 0)
    {
      let lightPosVC = rendererLightSSBO.values[i].LightPos.xyz;
      let lightOffset = posVC - lightPosVC;
      let lightDistance = length(lightOffset);
      if (lightDistance <= 0.0)
      {
        i++;
        continue;
      }
      lightDirection = lightOffset / lightDistance;
      let attenuationValues = rendererLightSSBO.values[i].LightAttenuation.xyz;
      attenuation = 1.0 / max(
        0.000001,
        attenuationValues.x + lightDistance *
          (attenuationValues.y + lightDistance * attenuationValues.z)
      );
    }
    else if (lightType == 1)
    {
      lightDirection = -normalize(
        (rendererUBO.WCVCNormals *
          vec4<f32>(normalize(rendererLightSSBO.values[i].LightDir.xyz), 0.0)).xyz
      );
    }
    else if (lightType == 2)
    {
      let lightPosVC = rendererLightSSBO.values[i].LightPos.xyz;
      let lightOffset = posVC - lightPosVC;
      let lightDistance = length(lightOffset);
      if (lightDistance <= 0.0)
      {
        i++;
        continue;
      }
      lightDirection = lightOffset / lightDistance;
      let attenuationValues = rendererLightSSBO.values[i].LightAttenuation.xyz;
      attenuation = 1.0 / max(
        0.000001,
        attenuationValues.x + lightDistance *
          (attenuationValues.y + lightDistance * attenuationValues.z)
      );

      let spotDirVC = -normalize(
        (rendererUBO.WCVCNormals *
          vec4<f32>(normalize(rendererLightSSBO.values[i].LightDir.xyz), 0.0)).xyz
      );
      let theta = dot(spotDirVC, lightDirection);
      let innerCone = rendererLightSSBO.values[i].LightData.y;
      if (theta < innerCone)
      {
        i++;
        continue;
      }
      attenuation = attenuation * pow(
        max(theta, 0.0),
        rendererLightSSBO.values[i].LightAttenuation.w
      );
    }
    else
    {
      i++;
      continue;
    }

    var ndotL = dot(normalVC.xyz, lightDirection);
    if (ndotL < 0.0 && volumeSSBO.values[vNum].shade.z > 0.0)
    {
      ndotL = -ndotL;
    }
    ndotL = max(ndotL, 0.0);
    if (ndotL > 0.0)
    {
      diffuse += ndotL * attenuation * lightColor;

      let reflectDir = normalize(lightDirection - 2.0 * ndotL * normalVC.xyz);
      let vdotR = max(dot(viewDir, reflectDir), 0.0);
      if (vdotR > 0.0)
      {
        specular += pow(vdotR, specularPower) * attenuation * lightColor;
      }
    }

    i++;
  }

  return tColor * (ambient * laoFactor + diffuseCoeff * diffuse) +
    specularCoeff * specular;
}

// The OpenGL mapper uses its simpler applyLighting path for the default
// independent-component preset. In particular, that path does not apply
// two-sided lighting, positional attenuation, LAO, or volume scattering.
fn applyIndependentLighting(tColor: vec3<f32>, normalVC: vec4<f32>, vNum: i32) -> vec3<f32>
{
  let lighting = volumeSSBO.values[vNum].lighting;
  var diffuse = vec3<f32>(0.0);
  var specular = vec3<f32>(0.0);

  var i: i32 = 0;
  loop
  {
    if (i >= rendererUBO.LightCount) { break; }

    let lightColor =
      rendererLightSSBO.values[i].LightColor.rgb *
      (rendererLightSSBO.values[i].LightColor.w * 0.2);
    let lightDirection = -normalize(
      (rendererUBO.WCVCNormals *
        vec4<f32>(normalize(rendererLightSSBO.values[i].LightDir.xyz), 0.0)).xyz
    );
    let df = dot(normalVC.xyz, lightDirection);
    if (df > 0.0)
    {
      diffuse = diffuse + df * lightColor;
      let halfAngle = vec3<f32>(
        -0.5 * lightDirection.x,
        -0.5 * lightDirection.y,
        -0.5 * (lightDirection.z - 1.0)
      );
      let sf = dot(normalVC.xyz, -halfAngle);
      if (sf > 0.0)
      {
        specular = specular +
          pow(sf, lighting.w) * lightColor;
      }
    }
    i++;
  }

  return tColor * (diffuse * lighting.y + lighting.x) +
    specular * lighting.z;
}

fn applyVolumeLighting(vTex: texture_3d<f32>, tColor: vec3<f32>, posVC: vec3<f32>, vNum: i32, rowStart: i32, fragmentSeed: f32) -> vec3<f32>
{
  if (rendererUBO.LightCount <= 0)
  {
    return tColor;
  }

  let lighting = volumeSSBO.values[vNum].lighting;
  let ambient = lighting.x;
  let diffuseCoeff = lighting.y;
  let rayDir = getRayDirection(posVC);
  var diffuse = vec3<f32>(0.0);

  var i: i32 = 0;
  loop
  {
    if (i >= rendererUBO.LightCount) { break; }

    let lightDir = getVolumeLightDirection(posVC, i);
    if (dot(lightDir, lightDir) > 0.0)
    {
      let lightColor =
        rendererLightSSBO.values[i].LightColor.rgb *
        (rendererLightSSBO.values[i].LightColor.w * 0.2);
      let shadowCoeff = computeVolumeShadow(vTex, posVC, lightDir, vNum, rowStart, fragmentSeed);
      let phaseAttenuation = phaseFunction(dot(rayDir, lightDir), vNum);
      diffuse += phaseAttenuation * shadowCoeff * lightColor;
    }

    i++;
  }

  return tColor * (ambient + diffuseCoeff * diffuse);
}

fn rayIntersectTextureDistances(rayOriginTC: vec3<f32>, rayDirTC: vec3<f32>) -> vec2<f32>
{
  let invDir = 1.0 / rayDirTC;
  let distancesTo0 = invDir * (vec3<f32>(0.0) - rayOriginTC);
  let distancesTo1 = invDir * (vec3<f32>(1.0) - rayOriginTC);
  let dMinPerAxis = min(distancesTo0, distancesTo1);
  let dMaxPerAxis = max(distancesTo0, distancesTo1);
  let distanceMin = max(dMinPerAxis.x, max(dMinPerAxis.y, dMinPerAxis.z));
  let distanceMax = min(dMaxPerAxis.x, min(dMaxPerAxis.y, dMaxPerAxis.z));
  return vec2<f32>(distanceMin, distanceMax);
}

fn computeVolumeShadow(vTex: texture_3d<f32>, posVC: vec3<f32>, lightDirVC: vec3<f32>, vNum: i32, rowStart: i32, fragmentSeed: f32) -> f32
{
  // Jitter the shadow step length per fragment by a random factor in [1.5, 3.0]
  // to break up banding, matching the OpenGL mapper (mix(1.5, 3.0, fragmentSeed)).
  let shadowStepLength = volumeSSBO.values[vNum].shadow.y * mix(1.5, 3.0, fragmentSeed);
  if (shadowStepLength <= 0.0)
  {
    return 1.0;
  }

  let initialPosVC = posVC + shadowStepLength * lightDirVC;
  let rayOriginTC = (volumeSSBO.values[vNum].VCTCMatrix * vec4<f32>(initialPosVC, 1.0)).xyz;
  let lightReach = volumeSSBO.values[vNum].scattering.y * volumeSSBO.values[vNum].shadow.x;
  if (lightReach <= 0.0)
  {
    return 1.0;
  }

  let lightDirTC = (volumeSSBO.values[vNum].VCTCMatrix * vec4<f32>(lightDirVC, 0.0)).xyz;
  if (dot(lightDirTC, lightDirTC) <= 0.0)
  {
    return 1.0;
  }

  let intersectionDistances = rayIntersectTextureDistances(rayOriginTC, lightDirTC);
  if (intersectionDistances.y <= intersectionDistances.x || intersectionDistances.y <= 0.0)
  {
    return 1.0;
  }

  let startDistance = max(intersectionDistances.x, 0.0);
  let endDistance = min(intersectionDistances.y, startDistance + lightReach);
  if (endDistance <= startDistance)
  {
    return 1.0;
  }

  var currentDistance = startDistance;
  var shadow = 1.0;
  loop
  {
    if (currentDistance > endDistance) { break; }
    let sampleTC = rayOriginTC + currentDistance * lightDirTC;
    let sample = getTextureValue(vTex, vec4<f32>(sampleTC, 1.0), vNum);
    let opacity = getSampleOpacity(
      vTex,
      sample,
      vec4<f32>(sampleTC, 1.0),
      vNum,
      rowStart
    );
    shadow = shadow * (1.0 - opacity);
    if (shadow <= 0.000001)
    {
      return 0.0;
    }
    currentDistance = currentDistance + shadowStepLength;
  }

  return shadow;
}

fn applyAllLighting(vTex: texture_3d<f32>, fragPos: vec4<f32>, tColor: vec3<f32>, alpha: f32, posVC: vec3<f32>, normalVC: vec4<f32>, vNum: i32, rowStart: i32) -> vec3<f32>
{
  if (rendererUBO.LightCount <= 0)
  {
    return tColor;
  }

  // volCoeff decides how much volume shadowing vs surface shadowing to apply
  // (ported from the OpenGL mapper's applyAllLightning):
  //   0                 <= volCoeff < EPSILON       => surface shadows only
  //   EPSILON           <= volCoeff < 1 - EPSILON   => mix of surface + volume
  //   1 - EPSILON       <= volCoeff                 => volume shadows only
  // It scales the user's VolumetricScatteringBlending (scattering.x) by:
  //   (1 - alpha*0.5)            -> more transparent samples lean volumetric
  //   (1 - atan(grad) * 1/(4pi)) -> weaker gradients lean volumetric
  // normalVC.w is the gradient magnitude and 0.0795774715 == 1/(4*PI).
  let volCoeff = volumeSSBO.values[vNum].scattering.x *
    (1.0 - alpha * 0.5) *
    (1.0 - atan(normalVC.w) * 0.0795774715);

  if (volCoeff <= 0.000001)
  {
    return applySurfaceLighting(vTex, fragPos, tColor, alpha, posVC, normalVC, vNum, rowStart);
  }

  // per fragment seed shared by all lights for the shadow step jitter
  let fragmentSeed = getFragmentSeed(fragPos);
  let volumeShadedColor = applyVolumeLighting(vTex, tColor, posVC, vNum, rowStart, fragmentSeed);
  if (volCoeff >= 0.999999)
  {
    return volumeShadedColor;
  }

  let surfaceShadedColor =
    applySurfaceLighting(vTex, fragPos, tColor, alpha, posVC, normalVC, vNum, rowStart);
  return mix(surfaceShadedColor, volumeShadedColor, volCoeff);
}

fn processVolumeSample(
  vTex: texture_3d<f32>, fragPos: vec4<f32>, vNum: i32, rowStart: i32,
  posSC: vec4<f32>, tpos: vec4<f32>, sample: vec4<f32>,
  tfunRows: f32, enableShading: bool) -> vec4<f32>
{
  var outColor: vec4<f32> = vec4<f32>(0.0, 0.0, 0.0, 0.0);

  let numComp: u32 = u32(volumeSSBO.values[vNum].componentInfo.x);
  let independent = volumeSSBO.values[vNum].componentInfo.y > 0.5;
  let colorMixPreset = i32(volumeSSBO.values[vNum].componentInfo.z);
  let posVC = (rendererUBO.SCVCMatrix * posSC).xyz;

  if (independent)
  {
    if (colorMixPreset == 1 && numComp >= 2u)
    {
      let scalar0 = getComponent(sample, 0u);
      let scalar1 = getComponent(sample, 1u);
      let rowIdx0 = rowStart;
      let rowIdx1 = rowStart + 1;

      let coord0 = vec2<f32>(
        scalar0 * componentSSBO.values[rowIdx0].cScale + componentSSBO.values[rowIdx0].cShift,
        getTFunRowCoord(rowIdx0, tfunRows)
      );
      let coord1 = vec2<f32>(
        scalar1 * componentSSBO.values[rowIdx1].cScale + componentSSBO.values[rowIdx1].cShift,
        getTFunRowCoord(rowIdx1, tfunRows)
      );
      var color0 = textureSampleLevel(tfunTexture, clampSampler, coord0, 0.0).rgb;
      var color1 = textureSampleLevel(tfunTexture, clampSampler, coord1, 0.0).rgb;
      var opacity0 = getOpacity(scalar0, rowIdx0, tfunRows);
      var opacity1 = getOpacity(scalar1, rowIdx1, tfunRows);

      var normal0 = vec4<f32>(0.0);
      var normal1 = vec4<f32>(0.0);
      if (componentSSBO.values[rowIdx0].gomin < 1.0 || volumeSSBO.values[vNum].shade[0] > 0.0)
      {
        normal0 = getGradient(vTex, tpos, vNum, 0u);
        if (componentSSBO.values[rowIdx0].gomin < 1.0)
        {
          opacity0 = opacity0 * clamp(
            normal0.a * componentSSBO.values[rowIdx0].goScale + componentSSBO.values[rowIdx0].goShift,
            componentSSBO.values[rowIdx0].gomin,
            componentSSBO.values[rowIdx0].gomax
          );
        }
      }
      if (componentSSBO.values[rowIdx1].gomin < 1.0 || volumeSSBO.values[vNum].shade[0] > 0.0)
      {
        normal1 = getGradient(vTex, tpos, vNum, 1u);
        if (componentSSBO.values[rowIdx1].gomin < 1.0)
        {
          opacity1 = opacity1 * clamp(
            normal1.a * componentSSBO.values[rowIdx1].goScale + componentSSBO.values[rowIdx1].goShift,
            componentSSBO.values[rowIdx1].gomin,
            componentSSBO.values[rowIdx1].gomax
          );
        }
      }

      let opacitySum = opacity0 + opacity1;
      if (opacitySum <= 0.0)
      {
        return outColor;
      }

      if (enableShading && volumeSSBO.values[vNum].shade[0] > 0.0)
      {
        if (volumeSSBO.values[vNum].shade[1] > 0.0)
        {
          normal0 = getOpacityGradient(vTex, tpos, vNum, 0u, rowIdx0, 1.0);
          normal1 = getOpacityGradient(vTex, tpos, vNum, 1u, rowIdx1, 1.0);
        }
        color0 = applyAllLighting(vTex, fragPos, color0, opacity0, posVC, normal0, vNum, rowIdx0);
        color1 = applyAllLighting(vTex, fragPos, color1, opacity1, posVC, normal1, vNum, rowIdx1);
      }

      outColor = vec4<f32>(
        (opacity0 * color0 + opacity1 * color1) / opacitySum,
        min(1.0, opacitySum)
      );
      return outColor;
    }

    if (colorMixPreset == 2 && numComp >= 2u)
    {
      let scalar0 = getComponent(sample, 0u);
      let scalar1 = getComponent(sample, 1u);
      let rowIdx0 = rowStart;
      let rowIdx1 = rowStart + 1;

      let coord0 = vec2<f32>(
        scalar0 * componentSSBO.values[rowIdx0].cScale + componentSSBO.values[rowIdx0].cShift,
        getTFunRowCoord(rowIdx0, tfunRows)
      );
      let coord1 = vec2<f32>(
        scalar1 * componentSSBO.values[rowIdx1].cScale + componentSSBO.values[rowIdx1].cShift,
        getTFunRowCoord(rowIdx1, tfunRows)
      );
      var color0 = textureSampleLevel(tfunTexture, clampSampler, coord0, 0.0).rgb;
      let colorizingColor = textureSampleLevel(tfunTexture, clampSampler, coord1, 0.0).rgb;
      var opacity0 = getOpacity(scalar0, rowIdx0, tfunRows);
      let colorizingOpacity = getOpacity(scalar1, rowIdx1, tfunRows);

      var normal0 = vec4<f32>(0.0);
      if (componentSSBO.values[rowIdx0].gomin < 1.0 || volumeSSBO.values[vNum].shade[0] > 0.0)
      {
        normal0 = getGradient(vTex, tpos, vNum, 0u);
        if (componentSSBO.values[rowIdx0].gomin < 1.0)
        {
          opacity0 = opacity0 * clamp(
            normal0.a * componentSSBO.values[rowIdx0].goScale + componentSSBO.values[rowIdx0].goShift,
            componentSSBO.values[rowIdx0].gomin,
            componentSSBO.values[rowIdx0].gomax
          );
        }
      }

      var color = color0 * mix(vec3<f32>(1.0), colorizingColor, colorizingOpacity);
      if (enableShading && volumeSSBO.values[vNum].shade[0] > 0.0)
      {
        if (volumeSSBO.values[vNum].shade[1] > 0.0)
        {
          normal0 = getOpacityGradient(vTex, tpos, vNum, 0u, rowIdx0, 1.0);
        }
        color = applyAllLighting(vTex, fragPos, color, opacity0, posVC, normal0, vNum, rowIdx0);
      }

      outColor = vec4<f32>(color, opacity0);
      return outColor;
    }

    var mixedColor: vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
    var mixedAlpha: f32 = 0.0;
    if (i32(componentSSBO.values[rowStart].opacityMode) == 1)
    {
      mixedAlpha = 1.0;
    }
    for (var c: u32 = 0u; c < numComp; c = c + 1u)
    {
      let rowIdx: i32 = rowStart + i32(c);
      let scalar = getComponent(sample, c);
      var coord: vec2<f32> =
        vec2<f32>(
          scalar * componentSSBO.values[rowIdx].cScale + componentSSBO.values[rowIdx].cShift,
          getTFunRowCoord(rowIdx, tfunRows)
        );
      var color: vec3<f32> = textureSampleLevel(tfunTexture, clampSampler, coord, 0.0).rgb;
      coord.x = scalar * componentSSBO.values[rowIdx].oScale + componentSSBO.values[rowIdx].oShift;
      var opacity: f32 = textureSampleLevel(ofunTexture, clampSampler, coord, 0.0).r;

      var gofactor: f32 = 1.0;
      var sampleAlpha = opacity;
      var normal: vec4<f32> = vec4<f32>(0.0,0.0,0.0,0.0);
      if (componentSSBO.values[rowIdx].gomin <  1.0 || volumeSSBO.values[vNum].shade[0] > 0.0)
      {
        normal = getGradient(vTex, tpos, vNum, c);
        if (componentSSBO.values[rowIdx].gomin <  1.0)
        {
          gofactor = clamp(normal.a*componentSSBO.values[rowIdx].goScale + componentSSBO.values[rowIdx].goShift,
            componentSSBO.values[rowIdx].gomin, componentSSBO.values[rowIdx].gomax);
        }
      }
      sampleAlpha = gofactor * opacity;

      if (enableShading && volumeSSBO.values[vNum].shade[0] > 0.0)
      {
        color = applyIndependentLighting(color, normal, vNum);
      }

      let mixWeight = componentSSBO.values[rowIdx].mixWeight;
      let opacityMode = i32(componentSSBO.values[rowIdx].opacityMode);
      if (opacityMode == 1)
      {
        color = color * sampleAlpha;
        mixedAlpha = mixedAlpha * mix(sampleAlpha, 1.0, 1.0 - mixWeight);
      }
      else
      {
        mixedAlpha = mixedAlpha + mixWeight * sampleAlpha;
      }
      mixedColor = mixedColor + mixWeight * color;
    }

    outColor = vec4<f32>(mixedColor, min(mixedAlpha, 1.0));
    return outColor;
  }

  let opacityScalar = getDependentOpacityValue(sample, numComp);
  var coord: vec2<f32> =
    vec2<f32>(
      0.0,
      getTFunRowCoord(rowStart, tfunRows)
    );
  var opacity: f32 = textureSampleLevel(ofunTexture, clampSampler, coord, 0.0).r;
  var color: vec3<f32>;
  if (numComp == 1u)
  {
    coord.x = sample.r * volumeSSBO.values[vNum].colorScale.x +
      volumeSSBO.values[vNum].colorShift.x;
    color = textureSampleLevel(tfunTexture, clampSampler, coord, 0.0).rgb;
    coord.x = sample.r * volumeSSBO.values[vNum].opacityScale.x +
      volumeSSBO.values[vNum].opacityShift.x;
    opacity = textureSampleLevel(ofunTexture, clampSampler, coord, 0.0).r;
  }
  else if (numComp == 2u)
  {
    color = vec3<f32>(
      sample.r * volumeSSBO.values[vNum].colorScale.x +
        volumeSSBO.values[vNum].colorShift.x
    );
    coord.x = sample.g * volumeSSBO.values[vNum].opacityScale.y +
      volumeSSBO.values[vNum].opacityShift.y;
    opacity = textureSampleLevel(ofunTexture, clampSampler, coord, 0.0).r;
  }
  else if (numComp == 3u)
  {
    color = vec3<f32>(
      sample.r * volumeSSBO.values[vNum].colorScale.x +
        volumeSSBO.values[vNum].colorShift.x,
      sample.g * volumeSSBO.values[vNum].colorScale.y +
        volumeSSBO.values[vNum].colorShift.y,
      sample.b * volumeSSBO.values[vNum].colorScale.z +
        volumeSSBO.values[vNum].colorShift.z
    );
    coord.x = opacityScalar * volumeSSBO.values[vNum].opacityScale.x +
      volumeSSBO.values[vNum].opacityShift.x;
    opacity = textureSampleLevel(ofunTexture, clampSampler, coord, 0.0).r;
  }
  else
  {
    color = vec3<f32>(
      sample.r * volumeSSBO.values[vNum].colorScale.x +
        volumeSSBO.values[vNum].colorShift.x,
      sample.g * volumeSSBO.values[vNum].colorScale.y +
        volumeSSBO.values[vNum].colorShift.y,
      sample.b * volumeSSBO.values[vNum].colorScale.z +
        volumeSSBO.values[vNum].colorShift.z
    );
    coord.x = sample.a * volumeSSBO.values[vNum].opacityScale.w +
      volumeSSBO.values[vNum].opacityShift.w;
    opacity = textureSampleLevel(ofunTexture, clampSampler, coord, 0.0).r;
  }

  var gofactor: f32 = 1.0;
  var normal: vec4<f32> = vec4<f32>(0.0,0.0,0.0,0.0);
  if (componentSSBO.values[rowStart].gomin <  1.0 || volumeSSBO.values[vNum].shade[0] > 0.0)
  {
    normal = getDependentGradient(vTex, tpos, vNum, numComp);
    if (componentSSBO.values[rowStart].gomin <  1.0)
    {
      gofactor = clamp(normal.a*componentSSBO.values[rowStart].goScale + componentSSBO.values[rowStart].goShift,
        componentSSBO.values[rowStart].gomin, componentSSBO.values[rowStart].gomax);
    }
  }

  let alpha = gofactor * opacity;
  if (enableShading && volumeSSBO.values[vNum].shade[0] > 0.0)
  {
    if (volumeSSBO.values[vNum].shade[1] > 0.0)
    {
      var opacityComponent: u32 = 0u;
      if (numComp == 2u) { opacityComponent = 1u; }
      if (numComp == 4u) { opacityComponent = 3u; }
      let opacityNormal = getOpacityGradient(
        vTex, tpos, vNum, opacityComponent, rowStart, gofactor);
      if (opacityNormal.w > 0.0)
      {
        normal = opacityNormal;
      }
    }
    color = applyAllLighting(vTex, fragPos, color, alpha, posVC, normal, vNum, rowStart);
  }

  outColor = vec4<f32>(color, alpha);

  return outColor;
}

fn processVolume(vTex: texture_3d<f32>, fragPos: vec4<f32>, vNum: i32, rowStart: i32, posSC: vec4<f32>, tfunRows: f32) -> vec4<f32>
{
  let tpos: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix * posSC;
  if (tpos.x < 0.0 || tpos.y < 0.0 || tpos.z < 0.0 ||
      tpos.x > 1.0 || tpos.y > 1.0 || tpos.z > 1.0)
  {
    return vec4<f32>(0.0);
  }
  let sample = getTextureValue(vTex, tpos, vNum);
  return processVolumeSample(
    vTex, fragPos, vNum, rowStart, posSC, tpos, sample, tfunRows, true);
}

// adjust the start and end point of a raycast such that it intersects the unit cube.
// This function is used to take a raycast starting point and step vector
// and numSteps and return the startijng and ending steps for intersecting the
// unit cube. Recall for a 3D texture, the unit cube is the range of texture coordsinates
// that have valid values. So this funtion can be used to take a ray in texture coordinates
// and bound it to intersecting the texture.
//
fn adjustBounds(tpos: vec4<f32>, tstep: vec4<f32>, numSteps: f32) -> vec2<f32>
{
  var result: vec2<f32> = vec2<f32>(0.0, numSteps);
  var tpos2: vec4<f32> = tpos + tstep*numSteps;

  // move tpos to the start of the volume
  var adjust: f32 =
    min(
      max(tpos.x/tstep.x, (tpos.x - 1.0)/tstep.x),
      min(
        max((tpos.y - 1.0)/tstep.y, tpos.y/tstep.y),
        max((tpos.z - 1.0)/tstep.z, tpos.z/tstep.z)));
  if (adjust < 0.0)
  {
    result.x = result.x - adjust;
  }

  // adjust length to the end
  adjust =
    max(
      min(tpos2.x/tstep.x, (tpos2.x - 1.0)/tstep.x),
      max(
        min((tpos2.y - 1.0)/tstep.y, tpos2.y/tstep.y),
        min((tpos2.z - 1.0)/tstep.z, tpos2.z/tstep.z)));
  if (adjust > 0.0)
  {
    result.y = result.y - adjust;
  }

  return result;
}

fn getSimpleColor(scalar: f32, rowIdx: i32, tfunRows: f32) -> vec4<f32>
{
  var coord: vec2<f32> =
    vec2<f32>(scalar * componentSSBO.values[rowIdx].cScale + componentSSBO.values[rowIdx].cShift,
      getTFunRowCoord(rowIdx, tfunRows));
  var color: vec4<f32> = textureSampleLevel(tfunTexture, clampSampler, coord, 0.0);
  coord.x = (scalar * componentSSBO.values[rowIdx].oScale + componentSSBO.values[rowIdx].oShift);
  var opacity: f32 = textureSampleLevel(ofunTexture, clampSampler, coord, 0.0).r;
  return vec4<f32>(color.rgb, opacity);
}

fn getOpacity(scalar: f32, rowIdx: i32, tfunRows: f32) -> f32
{
  let coord = vec2<f32>(
    scalar * componentSSBO.values[rowIdx].oScale + componentSSBO.values[rowIdx].oShift,
    getTFunRowCoord(rowIdx, tfunRows)
  );
  return textureSampleLevel(ofunTexture, clampSampler, coord, 0.0).r;
}

fn getRadonColor(scalar: f32, rowIdx: i32, tfunRows: f32) -> vec4<f32>
{
  let coord = vec2<f32>(
    scalar * componentSSBO.values[rowIdx].cScale + componentSSBO.values[rowIdx].cShift,
    getTFunRowCoord(rowIdx, tfunRows)
  );
  let color = textureSampleLevel(tfunTexture, clampSampler, coord, 0.0).rgb;
  // Radon/ output is an opaque intensity image: the accumulated
  // attenuation is already encoded in the lookup coordinate, so alpha is 1.0.
  return vec4<f32>(color, 1.0);
}

fn traverseMax(vTex: texture_3d<f32>, vNum: i32, rowIdx: i32, rayLengthSC: f32, minPosSC: vec4<f32>, rayStepSC: vec4<f32>, fragPos: vec4<f32>)
{
  // convert to tcoords and reject if outside the volume
  var numSteps: f32 = rayLengthSC/mapperUBO.SampleDistance;
  var tpos: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*minPosSC;
  var tpos2: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*(minPosSC + rayStepSC);
  var tstep: vec4<f32> = tpos2 - tpos;

  var rayBounds: vec2<f32> = intersectRayBoundsWithClipPlanes(
    vNum,
    minPosSC,
    rayStepSC,
    adjustBounds(tpos, tstep, numSteps));

  // did we hit anything
  if (rayBounds.x >= rayBounds.y)
  {
    traverseVals[vNum] = vec4<f32>(0.0,0.0,0.0,0.0);
    return;
  }

  tpos = tpos + tstep*rayBounds.x;
  var curDist: f32 = rayBounds.x;
  // sample the entry point, then jitter the interior samples per fragment to
  // break up banding (matches the OpenGL mapper)
  var selectedValue = getTextureValue(vTex, tpos, vNum);
  var selectedTpos = tpos;
  var selectedPosSC = minPosSC + rayStepSC * rayBounds.x;
  let tfunRows: f32 = f32(textureDimensions(tfunTexture).y);
  if (rayBounds.y - rayBounds.x <= 1.0)
  {
    traverseVals[vNum] = processVolumeSample(
      vTex, fragPos, vNum, rowIdx,
      selectedPosSC, selectedTpos, selectedValue, tfunRows, false);
    return;
  }
  let jitter: f32 = 0.01 + 0.99 * getFragmentSeed(fragPos);
  tpos = tpos + tstep*jitter;
  curDist = curDist + jitter;
  loop
  {
    if (curDist + 1.0 >= rayBounds.y) { break; }
    let currentValue = getTextureValue(vTex, tpos, vNum);
    let nextValue = max(selectedValue, currentValue);
    if (any(nextValue != selectedValue))
    {
      selectedTpos = tpos;
      selectedPosSC = minPosSC + rayStepSC * curDist;
    }
    selectedValue = nextValue;

    // increment position
    curDist = curDist + 1.0;
    tpos = tpos + tstep;
  }

  let endTpos = tpos - tstep * curDist + tstep * rayBounds.y;
  let endValue = getTextureValue(vTex, endTpos, vNum);
  let finalValue = max(selectedValue, endValue);
  if (any(finalValue != selectedValue))
  {
    selectedTpos = endTpos;
    selectedPosSC = minPosSC + rayStepSC * rayBounds.y;
  }
  traverseVals[vNum] = processVolumeSample(
    vTex, fragPos, vNum, rowIdx, selectedPosSC, selectedTpos, finalValue, tfunRows, false);
}

fn traverseMin(vTex: texture_3d<f32>, vNum: i32, rowIdx: i32, rayLengthSC: f32, minPosSC: vec4<f32>, rayStepSC: vec4<f32>, fragPos: vec4<f32>)
{
  // convert to tcoords and reject if outside the volume
  var numSteps: f32 = rayLengthSC/mapperUBO.SampleDistance;
  var tpos: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*minPosSC;
  var tpos2: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*(minPosSC + rayStepSC);
  var tstep: vec4<f32> = tpos2 - tpos;

  var rayBounds: vec2<f32> = intersectRayBoundsWithClipPlanes(
    vNum,
    minPosSC,
    rayStepSC,
    adjustBounds(tpos, tstep, numSteps));

  // did we hit anything
  if (rayBounds.x >= rayBounds.y)
  {
    traverseVals[vNum] = vec4<f32>(0.0,0.0,0.0,0.0);
    return;
  }

  tpos = tpos + tstep*rayBounds.x;
  var curDist: f32 = rayBounds.x;
  // sample the entry point, then jitter the interior samples per fragment to
  // break up banding (matches the OpenGL mapper)
  var selectedValue = getTextureValue(vTex, tpos, vNum);
  var selectedTpos = tpos;
  var selectedPosSC = minPosSC + rayStepSC * rayBounds.x;
  let tfunRows: f32 = f32(textureDimensions(tfunTexture).y);
  if (rayBounds.y - rayBounds.x <= 1.0)
  {
    traverseVals[vNum] = processVolumeSample(
      vTex, fragPos, vNum, rowIdx,
      selectedPosSC, selectedTpos, selectedValue, tfunRows, false);
    return;
  }
  let jitter: f32 = 0.01 + 0.99 * getFragmentSeed(fragPos);
  tpos = tpos + tstep*jitter;
  curDist = curDist + jitter;
  loop
  {
    if (curDist + 1.0 >= rayBounds.y) { break; }
    let currentValue = getTextureValue(vTex, tpos, vNum);
    let nextValue = min(selectedValue, currentValue);
    if (any(nextValue != selectedValue))
    {
      selectedTpos = tpos;
      selectedPosSC = minPosSC + rayStepSC * curDist;
    }
    selectedValue = nextValue;

    // increment position
    curDist = curDist + 1.0;
    tpos = tpos + tstep;
  }

  let endTpos = tpos - tstep * curDist + tstep * rayBounds.y;
  let endValue = getTextureValue(vTex, endTpos, vNum);
  let finalValue = min(selectedValue, endValue);
  if (any(finalValue != selectedValue))
  {
    selectedTpos = endTpos;
    selectedPosSC = minPosSC + rayStepSC * rayBounds.y;
  }
  traverseVals[vNum] = processVolumeSample(
    vTex, fragPos, vNum, rowIdx, selectedPosSC, selectedTpos, finalValue, tfunRows, false);
}

fn valueWithinIPRange(sample: vec4<f32>, vNum: i32) -> bool
{
  let rangeMin = volumeSSBO.values[vNum].ipScalarRangeMin;
  let rangeMax = volumeSSBO.values[vNum].ipScalarRangeMax;
  let numComp = u32(volumeSSBO.values[vNum].componentInfo.x);
  let independent = volumeSSBO.values[vNum].componentInfo.y > 0.5;
  if (numComp > 1u && !independent)
  {
    return false;
  }
  for (var component: u32 = 0u; component < numComp; component = component + 1u)
  {
    let value = getComponent(sample, component);
    if (value < getComponent(rangeMin, component) ||
        value > getComponent(rangeMax, component))
    {
      return false;
    }
  }
  return true;
}

fn traverseAverage(vTex: texture_3d<f32>, vNum: i32, rowIdx: i32, rayLengthSC: f32, minPosSC: vec4<f32>, rayStepSC: vec4<f32>, fragPos: vec4<f32>)
{
  // convert to tcoords and reject if outside the volume
  var numSteps: f32 = rayLengthSC/mapperUBO.SampleDistance;
  var tpos: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*minPosSC;
  var tpos2: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*(minPosSC + rayStepSC);
  var tstep: vec4<f32> = tpos2 - tpos;

  var rayBounds: vec2<f32> = intersectRayBoundsWithClipPlanes(
    vNum,
    minPosSC,
    rayStepSC,
    adjustBounds(tpos, tstep, numSteps));

  // did we hit anything
  if (rayBounds.x >= rayBounds.y)
  {
    traverseVals[vNum] = vec4<f32>(0.0,0.0,0.0,0.0);
    return;
  }

  tpos = tpos + tstep*rayBounds.x;
  var curDist: f32 = rayBounds.x;
  let raySpan = rayBounds.y - rayBounds.x;
  let tfunRows: f32 = f32(textureDimensions(tfunTexture).y);
  let firstValue = getTextureValue(vTex, tpos, vNum);
  if (raySpan <= 1.0 && valueWithinIPRange(firstValue, vNum))
  {
    // Match the OpenGL mapper's effective coverage for a subsample projection
    // ray. Its rasterized entry/exit interval is 5/4 of the analytic interval
    // used by this fullscreen WebGPU pass.
    traverseVals[vNum] = processVolumeSample(
      vTex, fragPos, vNum, rowIdx,
      minPosSC + rayStepSC * rayBounds.x, tpos, firstValue, tfunRows, false);
    return;
  }

  var sum = vec4<f32>(0.0);
  var totalWeight: f32 = 0.0;
  let jitter: f32 = 0.01 + 0.99 * getFragmentSeed(fragPos);
  if (valueWithinIPRange(firstValue, vNum))
  {
    sum = sum + firstValue * jitter;
    totalWeight = totalWeight + jitter;
  }
  tpos = tpos + tstep*jitter;
  curDist = curDist + jitter;
  loop
  {
    if (curDist + 1.0 >= rayBounds.y) { break; }
    let sample = getTextureValue(vTex, tpos, vNum);
    if (valueWithinIPRange(sample, vNum))
    {
      sum = sum + sample;
      totalWeight = totalWeight + 1.0;
    }

    curDist = curDist + 1.0;
    tpos = tpos + tstep;
  }

  let endTpos = tpos - tstep * curDist + tstep * rayBounds.y;
  let endValue = getTextureValue(vTex, endTpos, vNum);
  if (valueWithinIPRange(endValue, vNum))
  {
    sum = sum + endValue * (rayBounds.y - curDist);
    totalWeight = totalWeight + rayBounds.y - curDist;
  }

  if (totalWeight <= 0.0)
  {
    traverseVals[vNum] = vec4<f32>(0.0,0.0,0.0,0.0);
    return;
  }

  // WebGL leaves alpha unscaled here because only RGB components are averaged
  // by its vec4 divisor.
  let average = vec4<f32>(sum.rgb / totalWeight, sum.a);
  traverseVals[vNum] = processVolumeSample(
    vTex, fragPos, vNum, rowIdx,
    minPosSC + rayStepSC * rayBounds.y, endTpos, average, tfunRows, false);
}

fn traverseAdditive(vTex: texture_3d<f32>, vNum: i32, rowIdx: i32, rayLengthSC: f32, minPosSC: vec4<f32>, rayStepSC: vec4<f32>, fragPos: vec4<f32>)
{
  // convert to tcoords and reject if outside the volume
  var numSteps: f32 = rayLengthSC/mapperUBO.SampleDistance;
  var tpos: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*minPosSC;
  var tpos2: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*(minPosSC + rayStepSC);
  var tstep: vec4<f32> = tpos2 - tpos;

  var rayBounds: vec2<f32> = intersectRayBoundsWithClipPlanes(
    vNum,
    minPosSC,
    rayStepSC,
    adjustBounds(tpos, tstep, numSteps));

  // did we hit anything
  if (rayBounds.x >= rayBounds.y)
  {
    traverseVals[vNum] = vec4<f32>(0.0,0.0,0.0,0.0);
    return;
  }

  tpos = tpos + tstep*rayBounds.x;
  var curDist: f32 = rayBounds.x;
  let raySpan = rayBounds.y - rayBounds.x;
  let tfunRows: f32 = f32(textureDimensions(tfunTexture).y);
  let firstValue = getTextureValue(vTex, tpos, vNum);
  if (raySpan <= 1.0)
  {
    traverseVals[vNum] = processVolumeSample(
      vTex, fragPos, vNum, rowIdx,
      minPosSC + rayStepSC * rayBounds.x, tpos, firstValue, tfunRows, false);
    return;
  }

  var sum = vec4<f32>(0.0);
  let jitter: f32 = 0.01 + 0.99 * getFragmentSeed(fragPos);
  if (valueWithinIPRange(firstValue, vNum))
  {
    sum = sum + firstValue * jitter;
  }
  tpos = tpos + tstep*jitter;
  curDist = curDist + jitter;
  loop
  {
    if (curDist + 1.0 >= rayBounds.y) { break; }
    let sample = getTextureValue(vTex, tpos, vNum);
    if (valueWithinIPRange(sample, vNum))
    {
      sum = sum + sample;
    }
    curDist = curDist + 1.0;
    tpos = tpos + tstep;
  }

  let endTpos = tpos - tstep * curDist + tstep * rayBounds.y;
  let endValue = getTextureValue(vTex, endTpos, vNum);
  if (valueWithinIPRange(endValue, vNum))
  {
    sum = sum + endValue * (rayBounds.y - curDist);
  }
  traverseVals[vNum] = processVolumeSample(
    vTex, fragPos, vNum, rowIdx,
    minPosSC + rayStepSC * rayBounds.y, endTpos, sum, tfunRows, false);
}

// Radon: accumulate attenuation along the ray to produce a
// "normalized ray intensity" that is then mapped through the transfer function
// by getRadonColor. The result is an opaque intensity image (alpha is always
// 1.0), so no opacity is composited here.
//
// Port of the OpenGL mapper's RADON_TRANSFORM_BLEND path: the ray start is
// jittered per fragment to break up banding, and the leading/trailing partial
// samples are weighted by their fractional step length so thin slabs and ray
// endpoints integrate correctly (rather than marching uniform integer steps).
fn traverseRadon(vTex: texture_3d<f32>, vNum: i32, rowIdx: i32, rayLengthSC: f32, minPosSC: vec4<f32>, rayStepSC: vec4<f32>, fragPos: vec4<f32>)
{
  // convert to tcoords and reject if outside the volume
  var numSteps: f32 = rayLengthSC/mapperUBO.SampleDistance;
  let tpos0: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*minPosSC;
  var tpos2: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*(minPosSC + rayStepSC);
  var tstep: vec4<f32> = tpos2 - tpos0;

  var rayBounds: vec2<f32> = adjustBounds(tpos0, tstep, numSteps);

  // did we hit anything
  if (rayBounds.x >= rayBounds.y)
  {
    traverseVals[vNum] = vec4<f32>(0.0,0.0,0.0,0.0);
    return;
  }

  let tfunRows: f32 = f32(textureDimensions(tfunTexture).y);
  let raySpan: f32 = rayBounds.y - rayBounds.x;
  let sampleDistance: f32 = mapperUBO.SampleDistance;

  // Thin volumes can intersect the ray across less than a full sample step.
  if (raySpan <= 1.0)
  {
    let scalar: f32 = getTraverseValue(getTextureValue(vTex, tpos0 + tstep*rayBounds.x, vNum), vNum);
    let intensity = 1.0 - raySpan * sampleDistance * getOpacity(scalar, rowIdx, tfunRows);
    traverseVals[vNum] = getRadonColor(intensity, rowIdx, tfunRows);
    return;
  }

  let jitter: f32 = getFragmentSeed(fragPos);
  var normalizedRayIntensity: f32 = 1.0;

  // Leading partial sample at the entry point, weighted by the jitter offset.
  var tpos: vec4<f32> = tpos0 + tstep*rayBounds.x;
  let firstScalar: f32 = getTraverseValue(getTextureValue(vTex, tpos, vNum), vNum);
  normalizedRayIntensity = normalizedRayIntensity -
    jitter * sampleDistance * getOpacity(firstScalar, rowIdx, tfunRows);

  // Offset the start by the jitter so the interior samples are dithered.
  var curStep: f32 = rayBounds.x + jitter;
  tpos = tpos + tstep*jitter;

  // Full interior steps.
  loop
  {
    if (curStep + 1.0 >= rayBounds.y) { break; }
    let scalar: f32 = getTraverseValue(getTextureValue(vTex, tpos, vNum), vNum);
    normalizedRayIntensity = normalizedRayIntensity -
      sampleDistance * getOpacity(scalar, rowIdx, tfunRows);
    curStep = curStep + 1.0;
    tpos = tpos + tstep;
  }

  // Trailing partial sample at the clamped exit point.
  let remaining: f32 = rayBounds.y - curStep;
  if (remaining > 0.0)
  {
    var endPos: vec4<f32> = tpos0 + tstep*rayBounds.y;
    endPos = vec4<f32>(clamp(endPos.xyz, vec3<f32>(0.0), vec3<f32>(1.0)), 1.0);
    let endScalar: f32 = getTraverseValue(getTextureValue(vTex, endPos, vNum), vNum);
    normalizedRayIntensity = normalizedRayIntensity -
      remaining * sampleDistance * getOpacity(endScalar, rowIdx, tfunRows);
  }

  traverseVals[vNum] = getRadonColor(normalizedRayIntensity, rowIdx, tfunRows);
}

// Labelmap edge projection (LABELMAP_EDGE_PROJECTION_BLEND). Expects a two
// component volume: component 0 holds the image intensity and component 1
// the segment labels. The center ray does a maximum intensity projection of
// component 0 while collecting every segment index it crosses into a
// bitmask. For each collected segment, rays march again from the screen
// neighbors within the per segment outline thickness; when a neighbor ray
// never crosses the segment the fragment lies on the segment's projected
// edge and takes the segment's color from its own transfer function row.
var<private> labelEdgeSegmentBits: array<u32, 8>;

fn setLabelEdgeBit(segmentIndex: i32)
{
  if (segmentIndex > 0 && segmentIndex < 256)
  {
    labelEdgeSegmentBits[segmentIndex / 32] =
      labelEdgeSegmentBits[segmentIndex / 32] | (1u << u32(segmentIndex % 32));
  }
}

fn isLabelEdgeBitSet(segmentIndex: i32) -> bool
{
  return (labelEdgeSegmentBits[segmentIndex / 32] &
    (1u << u32(segmentIndex % 32))) != 0u;
}

// project a viewport tcoord (0..1) at the given NDC depth to SC coordinates
fn labelEdgeTcoordToSC(tcoord: vec2<f32>, fragZ: f32) -> vec4<f32>
{
  var scPos = rendererUBO.PCSCMatrix *
    vec4<f32>(2.0 * tcoord.x - 1.0, 1.0 - 2.0 * tcoord.y, fragZ, 1.0);
  return scPos * (1.0 / scPos.w);
}

// march the ray cast from a neighboring fragment and report whether it never
// crosses the given segment (true = the center fragment is on an edge with
// respect to this neighbor). The neighbor ray marches its own volume bounds
// front to back, covering the same span through the volume as the center ray.
fn labelEdgeNeighborMissesSegment(
  vTex: texture_3d<f32>, vNum: i32, segmentIndex: i32,
  minPosSC: vec4<f32>, rayStepSC: vec4<f32>, numSteps: f32) -> bool
{
  let labelScale: f32 = volumeSSBO.values[vNum].labelOutline.z;
  var tpos: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix * minPosSC;
  let tpos2: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix * (minPosSC + rayStepSC);
  let tstep: vec4<f32> = tpos2 - tpos;

  let rayBounds: vec2<f32> = adjustBounds(tpos, tstep, numSteps);
  if (rayBounds.x >= rayBounds.y)
  {
    return true;
  }

  tpos = tpos + tstep * rayBounds.x;
  var curDist: f32 = rayBounds.x;
  loop
  {
    let sample: vec4<f32> = getTextureValue(vTex, tpos, vNum);
    if (i32(round(sample.y * labelScale)) == segmentIndex)
    {
      return false;
    }
    curDist = curDist + 1.0;
    tpos = tpos + tstep;
    if (curDist > rayBounds.y) { break; }
  }
  return true;
}

fn traverseLabelEdge(vTex: texture_3d<f32>, vNum: i32, rowIdx: i32, segRowIdx: i32, rayLengthSC: f32, minPosSC: vec4<f32>, rayStepSC: vec4<f32>, fragPos: vec4<f32>, tcoord: vec2<f32>, fragZ: f32)
{
  // convert to tcoords and reject if outside the volume
  var numSteps: f32 = rayLengthSC/mapperUBO.SampleDistance;
  var tpos: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*minPosSC;
  var tpos2: vec4<f32> = volumeSSBO.values[vNum].SCTCMatrix*(minPosSC + rayStepSC);
  var tstep: vec4<f32> = tpos2 - tpos;

  var rayBounds: vec2<f32> = intersectRayBoundsWithClipPlanes(
    vNum,
    minPosSC,
    rayStepSC,
    adjustBounds(tpos, tstep, numSteps));

  // did we hit anything
  if (rayBounds.x >= rayBounds.y)
  {
    traverseVals[vNum] = vec4<f32>(0.0,0.0,0.0,0.0);
    return;
  }

  let tfunRows: f32 = f32(textureDimensions(tfunTexture).y);
  // scale to recover the raw label value from the normalized sample
  let labelScale: f32 = volumeSSBO.values[vNum].labelOutline.z;

  // clear the segment bitmask (private vars are zero initialized once per
  // invocation, but several volumes can share this blend mode)
  for (var w: i32 = 0; w < 8; w = w + 1) { labelEdgeSegmentBits[w] = 0u; }

  // maximum intensity projection of component 0 along the center ray while
  // collecting the segment indices (component 1) it crosses
  tpos = tpos + tstep*rayBounds.x;
  var curDist: f32 = rayBounds.x;
  var sample: vec4<f32> = getTextureValue(vTex, tpos, vNum);
  var maxVal: f32 = sample.x;
  var segmentIndex: i32 = i32(round(sample.y * labelScale));
  var seenNonZero: bool = segmentIndex != 0;
  setLabelEdgeBit(segmentIndex);

  // handle very thin volumes
  if (rayBounds.y - rayBounds.x <= 1.0)
  {
    traverseVals[vNum] = getSimpleColor(maxVal, rowIdx, tfunRows);
    return;
  }

  // jitter the interior samples per fragment to break up banding
  let jitter: f32 = 0.01 + 0.99 * getFragmentSeed(fragPos);
  tpos = tpos + tstep*jitter;
  curDist = curDist + jitter;
  loop
  {
    sample = getTextureValue(vTex, tpos, vNum);
    maxVal = max(maxVal, sample.x);
    segmentIndex = i32(round(sample.y * labelScale));
    if (segmentIndex != 0)
    {
      seenNonZero = true;
      setLabelEdgeBit(segmentIndex);
    }

    // increment position
    curDist = curDist + 1.0;
    tpos = tpos + tstep;

    // check if we have reached a terminating condition
    if (curDist > rayBounds.y) { break; }
  }

  // the ray never crossed a segment: output the projected image value
  if (!seenNonZero)
  {
    traverseVals[vNum] = getSimpleColor(maxVal, rowIdx, tfunRows);
    return;
  }

  // SC offsets of one fragment step in x and y at the ray entry depth; the
  // neighbor rays reuse the center ray's step direction and length
  let fragStep: vec2<f32> = vec2<f32>(1.0, 1.0) / rendererUBO.viewportSize;
  let baseSC: vec4<f32> = labelEdgeTcoordToSC(tcoord, fragZ);
  let deltaXSC: vec4<f32> =
    labelEdgeTcoordToSC(tcoord + vec2<f32>(fragStep.x, 0.0), fragZ) - baseSC;
  let deltaYSC: vec4<f32> =
    labelEdgeTcoordToSC(tcoord + vec2<f32>(0.0, fragStep.y), fragZ) - baseSC;

  // used to skip the full neighborhood scan when the fragments are small
  // relative to the voxels (zoomed out), in which case the four corner
  // checks below already catch every edge fragment
  let volSpacing: vec4<f32> = volumeSSBO.values[vNum].spacing;
  let minVoxelSpacing: f32 = min(volSpacing.x, min(volSpacing.y, volSpacing.z));
  let minFragSpacing: f32 = min(length(deltaXSC.xyz), length(deltaYSC.xyz));

  for (var s: i32 = 1; s < 256; s = s + 1)
  {
    // bail out quickly if the segment was not seen by the center ray
    if (!isLabelEdgeBitSet(s))
    {
      continue;
    }

    let actualThickness: i32 = getLabelOutlineThickness(vNum, s);
    if (actualThickness <= 0)
    {
      continue;
    }

    // check the extreme corners of the neighborhood first since there is a
    // better chance of finding the edge there, letting us bail out before
    // the full neighborhood scan
    let t: f32 = f32(actualThickness);
    var onEdge: bool =
      labelEdgeNeighborMissesSegment(vTex, vNum, s, minPosSC - t*deltaXSC - t*deltaYSC, rayStepSC, numSteps) ||
      labelEdgeNeighborMissesSegment(vTex, vNum, s, minPosSC + t*deltaXSC + t*deltaYSC, rayStepSC, numSteps) ||
      labelEdgeNeighborMissesSegment(vTex, vNum, s, minPosSC + t*deltaXSC - t*deltaYSC, rayStepSC, numSteps) ||
      labelEdgeNeighborMissesSegment(vTex, vNum, s, minPosSC - t*deltaXSC + t*deltaYSC, rayStepSC, numSteps);

    // the full scan runs only when the fragments are small enough relative
    // to the voxels that an edge can pass between the corners; otherwise the
    // corner checks above already caught every edge fragment (zoomed out)
    if (!onEdge &&
        minVoxelSpacing <= (2.0 * t - 1.0) * minFragSpacing)
    {
      // loop through the rest, skipping the processed corners and the center
      for (var i: i32 = -actualThickness; i <= actualThickness && !onEdge; i = i + 1)
      {
        for (var j: i32 = -actualThickness; j <= actualThickness && !onEdge; j = j + 1)
        {
          if ((i == 0 && j == 0) ||
              (abs(i) == actualThickness && abs(j) == actualThickness))
          {
            continue;
          }
          onEdge = labelEdgeNeighborMissesSegment(
            vTex, vNum, s,
            minPosSC + f32(i)*deltaXSC + f32(j)*deltaYSC, rayStepSC, numSteps);
        }
      }
    }

    if (onEdge)
    {
      // edge fragment: emit the segment's color and opacity from the label
      // component's transfer function row
      traverseVals[vNum] = getSimpleColor(f32(s) / labelScale, segRowIdx, tfunRows);
      return;
    }
  }

  // interior fragment: fall back to the projected image value
  traverseVals[vNum] = getSimpleColor(maxVal, rowIdx, tfunRows);
}

// opacity correction for samples that cover less than a full sample step
// (thin volumes / slabs and the trailing partial step), like the OpenGL
// mapper's 1-pow(1-a, raySteps) handling
fn correctSampleAlpha(alpha: f32, stepWeight: f32) -> f32
{
  if (stepWeight >= 1.0)
  {
    return alpha;
  }
  return 1.0 - pow(1.0 - alpha, max(stepWeight, 0.0));
}

fn composite(fragPos: vec4<f32>, tcoord: vec2<f32>, fragZ: f32, rayLengthSC: f32, minPosSC: vec4<f32>, rayStepSC: vec4<f32>) -> vec4<f32>
{
  var numSteps: f32 = rayLengthSC/mapperUBO.SampleDistance;

  var rayPosSC: vec4<f32> = minPosSC;

  // how many rows (tfuns) do we have in our tfunTexture
  var tfunRows: f32 = f32(textureDimensions(tfunTexture).y);

  var curDist: f32 = 0.0;
  var computedColor: vec4<f32> = vec4<f32>(0.0, 0.0, 0.0, 0.0);
  var sampleColor: vec4<f32>;
  // combined sample of all volumes at the current step
  var stepColor: vec4<f32> = vec4<f32>(0.0, 0.0, 0.0, 0.0);
  // fraction of a full sample step the current sample covers. This is driven
  // by a coverage cursor from the segment start (the jitter only shifts the
  // sample position, not the covered length) so the total opacity matches
  // the OpenGL mapper's 1-pow(1-a, raySteps) behaviour for thin slabs.
  var stepWeight: f32 = 1.0;
  var coveredSteps: f32 = 0.0;
  // union of the per volume ray bounds (in steps), accumulated by the
  // generated TraverseInit code below
  var unionBounds: vec2<f32> = vec2<f32>(1.0e37, -1.0e37);
//VTK::Volume::TraverseCalls
//VTK::Volume::TraverseInit

  // Advance the ray to the first volume intersection and stop at the last
  // one, like the OpenGL mapper which intersects the volume box before
  // marching. Without this, rays shorter than a sample step (thin slabs)
  // take their single sample at the ray start, which can lie outside a
  // volume that only begins partway through the slab, cutting its edge.
  let clampedStart: f32 = max(0.0, unionBounds.x);
  let clampedEnd: f32 = min(numSteps, unionBounds.y);
  if (clampedEnd <= clampedStart) { return computedColor; }
  // Decide jitter from the clipped interval, not the untrimmed camera ray.
  // A thin MPR slab is often shorter than one sample even when the camera
  // ray is very long; jittering that slab skips it for random fragments.
  let clippedSteps: f32 = clampedEnd - clampedStart;
  let jitter: f32 = select(
    0.01 + 0.99 * getFragmentSeed(fragPos),
    0.0,
    clippedSteps <= 1.0);
  curDist = (clampedStart + jitter) * mapperUBO.SampleDistance;
  rayPosSC = minPosSC + rayStepSC * (clampedStart + jitter);
  coveredSteps = clampedStart;
  let endDist: f32 = clampedEnd * mapperUBO.SampleDistance;

  loop
  {
    stepWeight = min(1.0, clampedEnd - coveredSteps);
    coveredSteps = coveredSteps + stepWeight;
    stepColor = vec4<f32>(0.0, 0.0, 0.0, 0.0);

    // for each volume, sample and accumulate color
//VTK::Volume::CompositeCalls

    // increment position
    curDist = curDist + mapperUBO.SampleDistance;
    rayPosSC = rayPosSC + rayStepSC;

    // check if we have reached a terminating condition
    if (curDist > endDist) { break; }
    if (computedColor.a > 0.98) { break; }
  }
  return computedColor;
}

@fragment
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output: fragmentOutput;

  // the depth bounds textures store 1 - depth so the r16float values keep
  // their precision near the camera (see the VolumePass depth range encoder)
  var rayMax: f32 = 1.0 - textureSampleLevel(maxTexture, clampSampler, input.tcoordVS, 0.0).r;
  var rayMin: f32 = 1.0 - textureSampleLevel(minTexture, clampSampler, input.tcoordVS, 0.0).r;

  // Parallel cameras may legitimately use a clipping range that crosses the
  // camera plane. With a large range, the volume can occupy about one
  // representable step in the r16float depth-bound textures. Pad such an
  // interval around its measured center instead of using the full clipping
  // range, which would lose precision again in the f32 ray coordinates. The
  // analytic per-volume bounds intersection below trims the padded ray.
  if (rendererUBO.cameraParallel != 0u && mapperUBO.CamNear < 0.0 &&
      rayMax - rayMin < 0.001)
  {
    let rayCenter = 0.5 * (rayMax + rayMin);
    rayMax = min(1.0, rayCenter + 0.001);
    rayMin = max(0.0, rayCenter - 0.001);
  }

  // If the camera near plane cuts into the volume (e.g. MPR slab slicing or
  // fly-through), the front faces of the depth bounds geometry are clipped
  // away and only exit fragments remain (entry == exit). Restart the ray at
  // the near plane (depth 1.0 in reversed-z) like the OpenGL mapper, which
  // casts from the near plane and intersects the volume in the shader; the
  // per-volume bounds intersection below trims the ray to the volume.
  if (rayMax <= rayMin && rayMin < 1.0)
  {
    rayMax = 1.0;
  }

  // No depth bounds at all: nearly edge-on cube faces can rasterize to
  // nothing at the silhouette (especially when the near plane cuts into the
  // volume), visibly clipping the volume edge versus the OpenGL mapper,
  // which intersects the volume analytically from a full screen quad. Seed
  // such rays with the full clipping range instead of discarding; the
  // per volume bounds intersection exits early when nothing is hit.
  if (rayMax <= rayMin)
  {
    rayMax = 1.0;
    rayMin = select(mapperUBO.CamNear / mapperUBO.CamFar, 0.0,
      rendererUBO.cameraParallel != 0u);
  }

  // discard empty rays
  if (rayMax <= rayMin) { discard; }
  else
  {
    // compute start and end ray positions in view coordinates
    var minPosSC: vec4<f32> = rendererUBO.PCSCMatrix*vec4<f32>(2.0 * input.tcoordVS.x - 1.0, 1.0 - 2.0 * input.tcoordVS.y, rayMax, 1.0);
    minPosSC = minPosSC * (1.0 / minPosSC.w);
    var maxPosSC: vec4<f32> = rendererUBO.PCSCMatrix*vec4<f32>(2.0 * input.tcoordVS.x - 1.0, 1.0 - 2.0 * input.tcoordVS.y, rayMin, 1.0);
    maxPosSC = maxPosSC * (1.0 / maxPosSC.w);

    // Clamp the ray segment to the camera clipping range in view coordinates
    // (like the OpenGL mapper's camNear/camThick clamp). The projection is
    // reversed-z with an infinite far plane in perspective, so the depth
    // bounds geometry is never clipped against the far plane, and the r16float
    // depth bounds are too coarse near 1.0 to clamp in depth space. This is
    // what makes thin camera clipping ranges render as slices like they do in WebGL.
    let entryZVC: f32 = (rendererUBO.SCVCMatrix * minPosSC).z;
    let exitZVC: f32 = (rendererUBO.SCVCMatrix * maxPosSC).z;
    let zRangeVC: f32 = exitZVC - entryZVC;
    if (abs(zRangeVC) > 1.0e-10)
    {
      let tNear: f32 = (-mapperUBO.CamNear - entryZVC) / zRangeVC;
      let tFar: f32 = (-mapperUBO.CamFar - entryZVC) / zRangeVC;
      let t0: f32 = max(0.0, tNear);
      let t1: f32 = min(1.0, tFar);
      if (t0 >= t1) { discard; }
      let raySpanSC: vec4<f32> = maxPosSC - minPosSC;
      maxPosSC = minPosSC + t1 * raySpanSC;
      minPosSC = minPosSC + t0 * raySpanSC;
    }

    var rayLengthSC: f32 = distance(minPosSC.xyz, maxPosSC.xyz);
    var rayStepSC: vec4<f32> = (maxPosSC - minPosSC)*(mapperUBO.SampleDistance/rayLengthSC);
    rayStepSC.w = 0.0;

    var computedColor: vec4<f32>;

//VTK::Volume::Loop

//VTK::RenderEncoder::Impl
  }

  return output;
}
`,We=new Float64Array(16),ot=new Float64Array(16),Gh=new Float64Array(16),qo=new Float64Array(16),kh=new Float64Array(3),bh=new Float64Array(3);function kE(t,e){e.classHierarchy.push("vtkWebGPUVolumePassFSQ"),t.replaceShaderPosition=(a,i,s)=>{let o=i.getShaderDescription("vertex");o.addBuiltinOutput("vec4<f32>","@builtin(position) Position");let c=o.getCode();c=K.substitute(c,"//VTK::Position::Impl",["output.tcoordVS = vec2<f32>(vertexBC.x * 0.5 + 0.5, 1.0 - vertexBC.y * 0.5 - 0.5);","output.Position = vec4<f32>(vertexBC, 1.0);"]).result,o.setCode(c),i.getShaderDescription("fragment").addBuiltinInput("vec4<f32>","@builtin(position) fragPos")},e.shaderReplacements.set("replaceShaderPosition",t.replaceShaderPosition),t.replaceShaderVolume=(a,i,s)=>{let o=i.getShaderDescription("fragment"),c=o.getCode(),f=[],u=[];for(let d=0;d<e.volumes.length;d++){let x=e.volumes[d].getRenderable(),T=x.getMapper(),v=T.getBlendMode(),C=T.getInputData()?.getPointData()?.getScalars()?.getNumberOfComponents?.(),O=v===Ae.COMPOSITE_BLEND&&x.getProperty().getUseLabelOutline()&&C===1;v===Ae.COMPOSITE_BLEND&&(u.push(`  var tpos${d}: vec4<f32> = volumeSSBO.values[${d}].SCTCMatrix*minPosSC;`),u.push(`  var tpos2_${d}: vec4<f32> = volumeSSBO.values[${d}].SCTCMatrix*(minPosSC + rayStepSC);`),u.push(`  var tstep${d}: vec4<f32> = tpos2_${d} - tpos${d};`),u.push(`  var rayBounds${d}: vec2<f32> = intersectRayBoundsWithClipPlanes(${d}, minPosSC, rayStepSC, adjustBounds(tpos${d}, tstep${d}, numSteps));`),u.push(`  if (rayBounds${d}.x < rayBounds${d}.y) {
    unionBounds = vec2<f32>(min(unionBounds.x, rayBounds${d}.x), max(unionBounds.y, rayBounds${d}.y));
  }`),O&&u.push(`  let labelColor${d}: vec4<f32> = getColorForLabelOutline(volTexture${d}, tcoord, fragZ, ${d}, ${e.rowStarts[d]}, tfunRows);`),f.push(`    if (curDist >= rayBounds${d}.x * mapperUBO.SampleDistance && curDist <= rayBounds${d}.y * mapperUBO.SampleDistance) {`),O?f.push(`      sampleColor = labelColor${d};`):f.push(`      sampleColor = processVolume(volTexture${d}, fragPos, ${d}, ${e.rowStarts[d]}, rayPosSC, tfunRows);`),f.push("      sampleColor.a = correctSampleAlpha(sampleColor.a, stepWeight);"),f.push(`      stepColor = vec4<f32>(
          sampleColor.a * sampleColor.rgb + (1.0 - sampleColor.a) * stepColor.rgb,
          sampleColor.a + (1.0 - sampleColor.a) * stepColor.a);`),f.push("    }"))}f.length&&f.push(`    computedColor = vec4<f32>(
        stepColor.rgb * (1.0 - computedColor.a) + computedColor.rgb,
        (1.0 - computedColor.a) * stepColor.a + computedColor.a);`),c=K.substitute(c,"//VTK::Volume::CompositeCalls",f).result,c=K.substitute(c,"//VTK::Volume::TraverseCalls",[]).result,c=K.substitute(c,"//VTK::Volume::TraverseInit",u).result,c=K.substitute(c,"//VTK::Volume::TraverseDec",[`var<private> traverseVals: array<vec4<f32>,${e.volumes.length}>;`]).result;let g=(d,x)=>{let T="rayLengthSC, minPosSC, rayStepSC, input.fragPos";switch(x){case Ae.MAXIMUM_INTENSITY_BLEND:return`    traverseMax(volTexture${d}, ${d}, ${e.rowStarts[d]}, ${T});`;case Ae.MINIMUM_INTENSITY_BLEND:return`    traverseMin(volTexture${d}, ${d}, ${e.rowStarts[d]}, ${T});`;case Ae.AVERAGE_INTENSITY_BLEND:return`    traverseAverage(volTexture${d}, ${d}, ${e.rowStarts[d]}, ${T});`;case Ae.ADDITIVE_INTENSITY_BLEND:return`    traverseAdditive(volTexture${d}, ${d}, ${e.rowStarts[d]}, ${T});`;case Ae.RADON_TRANSFORM_BLEND:return`    traverseRadon(volTexture${d}, ${d}, ${e.rowStarts[d]}, ${T});`;case Ae.LABELMAP_EDGE_PROJECTION_BLEND:{let v=e.volumes[d].getRenderable(),C=v.getMapper().getInputData()?.getPointData()?.getScalars()?.getNumberOfComponents?.(),O=v.getProperty().getIndependentComponents()&&C>=2,M=e.rowStarts[d]+(O?1:0);return O||Yo("LABELMAP_EDGE_PROJECTION_BLEND expects a two component volume (image + labels) with independent components enabled."),`    traverseLabelEdge(volTexture${d}, ${d}, ${e.rowStarts[d]}, ${M}, ${T}, input.tcoordVS, rayMax);`}default:return null}},l=e.volumes.map(d=>d.getRenderable().getMapper().getBlendMode()),h=l.some(d=>d===Ae.COMPOSITE_BLEND),y=l.some(d=>d!==Ae.COMPOSITE_BLEND),p=h&&y,m=!1;for(let d=0;d<e.volumes.length;d++){let x=l[d],T=[];if(x===Ae.COMPOSITE_BLEND){if(m)continue;m=!0,p?T.push("    let compositeLayer: vec4<f32> = composite(input.fragPos, input.tcoordVS, rayMax, rayLengthSC, minPosSC, rayStepSC);",`    computedColor = vec4<f32>(
      compositeLayer.rgb + (1.0 - compositeLayer.a) * computedColor.rgb,
      compositeLayer.a + (1.0 - compositeLayer.a) * computedColor.a);`):T.push("    computedColor = composite(input.fragPos, input.tcoordVS, rayMax, rayLengthSC, minPosSC, rayStepSC);")}else{let v=g(d,x);if(!v){Yo(`WebGPU volume rendering does not support blend mode ${x} yet; volume ${d} will not be rendered.`);continue}T.push(v),p?T.push(`    let layer${d}: vec4<f32> = traverseVals[${d}];`,`    computedColor = vec4<f32>(
      layer${d}.rgb * layer${d}.a + (1.0 - layer${d}.a) * computedColor.rgb,
      layer${d}.a + (1.0 - layer${d}.a) * computedColor.a);`):T.push(`    computedColor = traverseVals[${d}];`)}T.push("//VTK::Volume::Loop"),c=K.substitute(c,"//VTK::Volume::Loop",T).result}p&&(c=K.substitute(c,"//VTK::Volume::Loop",["    if (computedColor.a > 0.0) {","      computedColor = vec4<f32>(computedColor.rgb / computedColor.a, computedColor.a);","    }"]).result),o.setCode(c)},e.shaderReplacements.set("replaceShaderVolume",t.replaceShaderVolume),t.updateLUTImage=a=>{let i=t.getMTime(),s=[];for(let l=0;l<e.volumes.length;l++){let h=e.volumes[l].getRenderable(),y=h.getMapper().getInputData(),p=h.getProperty(),m=[h.getMTime(),h.getMapper().getMTime(),y.getMTime(),p.getMTime()],d=y.getPointData()&&y.getPointData().getScalars(),x=d?d.getNumberOfComponents():1,T=p.getUseIndependentComponents(x)?x:1;for(let v=0;v<T;v++)m.push(p.getRGBTransferFunction(v).getMTime(),p.getScalarOpacity(v).getMTime());s.push(m.join(".")),i=Math.max(i,...m)}if(i<e.lutBuildTime.getMTime()&&e.lutSampleDist===e.sampleDist)return;e.colorRowLength=Math.max(1,...e.volumes.map(l=>l.getRenderable().getMapper().getColorTextureWidth())),e.opacityRowLength=Math.max(1,...e.volumes.map(l=>l.getRenderable().getMapper().getOpacityTextureWidth())),e.numRows=0,e.rowStarts=[];for(let l=0;l<e.volumes.length;l++){e.rowStarts.push(e.numRows);let h=e.volumes[l].getRenderable(),y=h.getMapper(),p=h.getProperty(),m=y.getInputData(),d=(m.getPointData()&&m.getPointData().getScalars()).getNumberOfComponents(),x=p.getUseIndependentComponents(d)?d:1;e.numRows+=x}let o=new Uint8ClampedArray(e.numRows*2*e.colorRowLength*4),c=new Float32Array(e.numRows*2*e.opacityRowLength),f=0,u=new Float32Array(Math.max(e.colorRowLength*3,e.opacityRowLength));for(let l=0;l<e.volumes.length;l++){let h=e.volumes[l].getRenderable(),y=h.getMapper(),p=h.getProperty(),m=y.getInputData(),d=(m.getPointData()&&m.getPointData().getScalars()).getNumberOfComponents(),x=p.getUseIndependentComponents(d),T=x?d:1;for(let v=0;v<T;++v){let C=x?v:0,O=x?v:0,M=p.getRGBTransferFunction(C),S=M.getRange();M.getTable(S[0],S[1],e.colorRowLength,u,1);let E=f*e.colorRowLength*4;for(let U=0;U<e.colorRowLength;++U){o[E+U*4]=255*u[U*3],o[E+U*4+1]=255*u[U*3+1],o[E+U*4+2]=255*u[U*3+2],o[E+U*4+3]=255;for(let B=0;B<4;B++)o[E+(e.colorRowLength+U)*4+B]=o[E+U*4+B]}let R=p.getScalarOpacity(O),D=e.sampleDist/p.getScalarOpacityUnitDistance(O),V=R.getRange();R.getTable(V[0],V[1],e.opacityRowLength,u,1),E=f*e.opacityRowLength;for(let U=0;U<e.opacityRowLength;++U)c[E+U]=1-(1-u[U])**D,c[E+U+e.opacityRowLength]=c[E+U];f+=2}}let g=`${s.join("|")}-${e.numRows}`;{let l={hash:`volumeColorLUT-${e.colorRowLength}-${g}`,nativeArray:o,width:e.colorRowLength,height:e.numRows*2,depth:1,format:"rgba8unorm"},h=a.getTextureManager().getTexture(l).createView("tfunTexture");e.textureViews[2]=h}{let l={hash:`volumeOpacityLUT-${e.opacityRowLength}-${e.sampleDist}-${g}`,nativeArray:c,width:e.opacityRowLength,height:e.numRows*2,depth:1,format:"r16float"},h=a.getTextureManager().getTexture(l).createView("ofunTexture");e.textureViews[3]=h}e.lutSampleDist=e.sampleDist,e.lutBuildTime.modified()},t.updateSSBO=a=>{let i=e.WebGPURenderer.getRenderable(),s=i.getActiveCamera(),o=e.WebGPURenderer.getViewNodeFor(s),c=o.getKeyMatrices(e.WebGPURenderer),f=Math.max(t.getMTime(),e.WebGPURenderer.getStabilizedTime(),i.getMTime(),s.getMTime(),o.getMTime());for(let j=0;j<e.volumes.length;j++){let A=e.volumes[j].getRenderable(),se=A.getMapper(),ae=se.getInputData(),ce=A.getProperty();f=Math.max(f,A.getMTime(),ae.getMTime(),se.getMTime(),se.getClippingPlanesMTime(),ce.getMTime());let ie=ae.getPointData()&&ae.getPointData().getScalars(),fe=ie?ie.getNumberOfComponents():1,Mt=ce.getUseIndependentComponents(fe)?fe:1;for(let Be=0;Be<Mt;Be++)f=Math.max(f,ce.getRGBTransferFunction(Be).getMTime(),ce.getScalarOpacity(Be).getMTime())}if(f<e.SSBO.getSendTime())return;let u=e.WebGPURenderer.getStabilizedCenterByReference(),g=e.SSBO.getSizeInBytes()===0||e.SSBO.getNumberOfInstances()!==e.volumes.length;g&&(e.SSBO.clearData(),e.SSBO.setNumberOfInstances(e.volumes.length));let l=new Float64Array(e.volumes.length*16),h=new Float64Array(e.volumes.length*16),y=new Float64Array(e.volumes.length*16),p=Array.from({length:6},()=>new Float64Array(e.volumes.length*4)),m=new Float64Array(e.volumes.length*4),d=new Float64Array(e.volumes.length*4),x=new Float64Array(e.volumes.length*4),T=new Float64Array(e.volumes.length*4),v=new Float64Array(e.volumes.length*4),C=new Float64Array(e.volumes.length*4),O=new Float64Array(e.volumes.length*4),M=new Float64Array(e.volumes.length*4),S=new Float64Array(e.volumes.length*4),E=new Float64Array(e.volumes.length*4),R=new Float64Array(e.volumes.length*4),D=new Float64Array(e.volumes.length*4),V=new Float64Array(e.volumes.length*4),U=new Float64Array(e.volumes.length*4),B=new Float64Array(e.volumes.length*4),_=new Float64Array(e.volumes.length*4);for(let j=0;j<e.volumes.length;j++){let A=e.volumes[j].getRenderable(),se=A.getMapper(),ae=se.getInputData(),ce=ae.getPointData()&&ae.getPointData().getScalars(),ie=ce.getNumberOfComponents(),fe=A.getProperty();L.identity(We),L.translate(We,We,u);let Mt=A.getMatrix();L.transpose(ot,Mt),L.invert(ot,ot),L.multiply(We,ot,We);let Be=ae.getWorldToIndex();L.multiply(We,Be,We);let Fe=ae.getDimensions();L.fromTranslation(ot,[.5,.5,.5]),L.multiply(We,ot,We),L.identity(ot),L.scale(ot,ot,[1/Fe[0],1/Fe[1],1/Fe[2]]),L.multiply(We,ot,We);for(let te=0;te<16;te++)l[j*16+te]=We[te];L.invert(Gh,c.scvc),L.multiply(ot,We,Gh);for(let te=0;te<16;te++)h[j*16+te]=ot[te];L.invert(We,We);for(let te=0;te<4;te++)y[j*16+te*4]=We[te*4],y[j*16+te*4+1]=We[te*4+1],y[j*16+te*4+2]=We[te*4+2],y[j*16+te*4+3]=0;d[j*4]=1/Fe[0],d[j*4+1]=1/Fe[1],d[j*4+2]=1/Fe[2],d[j*4+3]=1,x[j*4]=A.getProperty().getShade()?1:0,x[j*4+1]=fe.getComputeNormalFromOpacity()?1:0,x[j*4+2]=i.getTwoSidedLighting()?1:0,T[j*4]=fe.getAmbient(),T[j*4+1]=fe.getDiffuse(),T[j*4+2]=fe.getSpecular(),T[j*4+3]=fe.getSpecularPower()===0?1:fe.getSpecularPower(),v[j*4]=fe.getVolumetricScatteringBlending(),v[j*4+1]=fe.getGlobalIlluminationReach(),v[j*4+2]=fe.getAnisotropy(),v[j*4+3]=fe.getAnisotropy()*fe.getAnisotropy(),L.multiply(qo,c.scvc,We),W.transformMat4(kh,[0,0,0],qo),W.transformMat4(bh,[1,1,1],qo),C[j*4]=W.distance(bh,kh),C[j*4+1]=se.getSampleDistance()*se.getVolumeShadowSamplingDistFactor(),O[j*4]=fe.getLocalAmbientOcclusion()&&fe.getAmbient()>0?fe.getLAOKernelSize():0,O[j*4+1]=fe.getLAOKernelRadius();let $t=ae.getSpacing();M[j*4]=$t[0],M[j*4+1]=$t[1],M[j*4+2]=$t[2],M[j*4+3]=1;let dt=e.textureViews[j+4].getTexture().getScale(),Je=A.getProperty().getIpScalarRange(),Bt=A.getProperty().getFilterMode();for(let te=0;te<ie;te++){let nt=Je[0],Tt=Je[1];if(Bt!==po.RAW){let Dt=ce.getRange(te),At=Dt[1]-Dt[0];nt=Dt[0]+nt*At,Tt=Dt[0]+Tt*At}S[j*4+te]=nt/dt,E[j*4+te]=Tt/dt}R[j*4]=ce.getNumberOfComponents();let Er=fe.getUseIndependentComponents(ie);R[j*4+1]=Er?1:0,R[j*4+2]=fe.getColorMixPreset();let jr=0;if(fe.getInterpolationType()===Hn.NEAREST)jr=15;else for(let te=0;te<ie;te++)fe.getForceNearestInterpolation(te)&&(jr|=1<<te);R[j*4+3]=jr,D[j*4]=fe.getUseLabelOutline()?1:0;let Pr=fe.getLabelOutlineOpacity();D[j*4+1]=Array.isArray(Pr)?Pr[0]??1:Pr,D[j*4+2]=dt,D[j*4+3]=0;for(let te=0;te<ie;te++){let nt=dt,Tt=fe.getRGBTransferFunction(Er?te:0).getRange(),Dt=Tt[1]-Tt[0],At=Math.abs(Dt)>1e-6?1/Dt:0;V[j*4+te]=nt*At,U[j*4+te]=-Tt[0]*At;let Ar=fe.getScalarOpacity(Er?te:0).getRange(),Cn=Ar[1]-Ar[0],ic=Math.abs(Cn)>1e-6?1/Cn:0;B[j*4+te]=nt*ic,_[j*4+te]=-Ar[0]*ic}L.fromTranslation(ot,[-u[0],-u[1],-u[2]]);let $r=di(se,ot,e.clipPlanes);m[j*4]=$r;for(let te=0;te<$r;te++){let nt=j*4;p[te][nt]=e.clipPlanes[te][0],p[te][nt+1]=e.clipPlanes[te][1],p[te][nt+2]=e.clipPlanes[te][2],p[te][nt+3]=e.clipPlanes[te][3]}}g&&(e.SSBO.addEntry("SCTCMatrix","mat4x4<f32>"),e.SSBO.addEntry("VCTCMatrix","mat4x4<f32>"),e.SSBO.addEntry("planeNormals","mat4x4<f32>"),e.SSBO.addEntry("shade","vec4<f32>"),e.SSBO.addEntry("lighting","vec4<f32>"),e.SSBO.addEntry("scattering","vec4<f32>"),e.SSBO.addEntry("shadow","vec4<f32>"),e.SSBO.addEntry("lao","vec4<f32>"),e.SSBO.addEntry("tstep","vec4<f32>"),e.SSBO.addEntry("spacing","vec4<f32>"),e.SSBO.addEntry("ipScalarRangeMin","vec4<f32>"),e.SSBO.addEntry("ipScalarRangeMax","vec4<f32>"),e.SSBO.addEntry("componentInfo","vec4<f32>"),e.SSBO.addEntry("labelOutline","vec4<f32>"),e.SSBO.addEntry("colorScale","vec4<f32>"),e.SSBO.addEntry("colorShift","vec4<f32>"),e.SSBO.addEntry("opacityScale","vec4<f32>"),e.SSBO.addEntry("opacityShift","vec4<f32>"),fn(e.SSBO,"clipPlane"),e.SSBO.addEntry("clipPlaneStates","vec4<f32>")),e.SSBO.setAllInstancesFromArray("SCTCMatrix",l),e.SSBO.setAllInstancesFromArray("VCTCMatrix",h),e.SSBO.setAllInstancesFromArray("planeNormals",y),e.SSBO.setAllInstancesFromArray("shade",x),e.SSBO.setAllInstancesFromArray("lighting",T),e.SSBO.setAllInstancesFromArray("scattering",v),e.SSBO.setAllInstancesFromArray("shadow",C),e.SSBO.setAllInstancesFromArray("lao",O),e.SSBO.setAllInstancesFromArray("tstep",d),e.SSBO.setAllInstancesFromArray("spacing",M),e.SSBO.setAllInstancesFromArray("ipScalarRangeMin",S),e.SSBO.setAllInstancesFromArray("ipScalarRangeMax",E),e.SSBO.setAllInstancesFromArray("componentInfo",R),e.SSBO.setAllInstancesFromArray("labelOutline",D),e.SSBO.setAllInstancesFromArray("colorScale",V),e.SSBO.setAllInstancesFromArray("colorShift",U),e.SSBO.setAllInstancesFromArray("opacityScale",B),e.SSBO.setAllInstancesFromArray("opacityShift",_);for(let j=0;j<6;j++)e.SSBO.setAllInstancesFromArray(`clipPlane${j}`,p[j]);e.SSBO.setAllInstancesFromArray("clipPlaneStates",m),e.SSBO.send(a);let N=e.componentSSBO.getSizeInBytes()===0||e.componentSSBO.getNumberOfInstances()!==e.numRows;N&&(e.componentSSBO.clearData(),e.componentSSBO.setNumberOfInstances(e.numRows));let k=new Float64Array(e.numRows),F=new Float64Array(e.numRows),G=new Float64Array(e.numRows),b=new Float64Array(e.numRows),z=new Float64Array(e.numRows),I=new Float64Array(e.numRows),P=new Float64Array(e.numRows),Q=new Float64Array(e.numRows),$=new Float64Array(e.numRows),J=new Float64Array(e.numRows),Y=0;for(let j=0;j<e.volumes.length;j++){let A=e.volumes[j].getRenderable(),se=A.getMapper(),ae=A.getProperty(),ce=se.getInputData(),ie=(ce.getPointData()&&ce.getPointData().getScalars()).getNumberOfComponents(),fe=ae.getUseIndependentComponents(ie),Mt=fe?ie:1,Be={scale:e.textureViews[j+4].getTexture().getScale(),offset:0};for(let Fe=0;Fe<Mt;Fe++){let $t=fe?Fe:0,dt=0;fe?dt=Fe:(ie===2||ie===4)&&(dt=ie-1);let Je=fe?Fe:0,Bt=Be.scale,Er=ae.getScalarOpacity(dt).getRange(),jr=Er[1]-Er[0],Pr=Math.abs(jr)>1e-6?1/jr:0;b[Y]=(Be.offset-Er[0])*Pr,G[Y]=Bt*Pr;let $r=ae.getRGBTransferFunction($t).getRange(),te=$r[1]-$r[0],nt=Math.abs(te)>1e-6?1/te:0;if(F[Y]=(Be.offset-$r[0])*nt,k[Y]=Bt*nt,$[Y]=fe?ae.getComponentWeight?.(Fe)??1:1,J[Y]=ae.getOpacityMode(Je),ae.getUseGradientOpacity(Je)){let Tt=ae.getGradientOpacityMinimumOpacity(Je),Dt=ae.getGradientOpacityMaximumOpacity(Je);z[Y]=Tt,I[Y]=Dt;let At=[ae.getGradientOpacityMinimumValue(Je),ae.getGradientOpacityMaximumValue(Je)],Ar=At[1]-At[0],Cn=Math.abs(Ar)>1e-6?1/Ar:0;Q[Y]=Bt*(Dt-Tt)*Cn,P[Y]=-At[0]*(Dt-Tt)*Cn+Tt}else z[Y]=1,I[Y]=1,Q[Y]=0,P[Y]=1;Y++}}N&&(e.componentSSBO.addEntry("cScale","f32"),e.componentSSBO.addEntry("cShift","f32"),e.componentSSBO.addEntry("oScale","f32"),e.componentSSBO.addEntry("oShift","f32"),e.componentSSBO.addEntry("goShift","f32"),e.componentSSBO.addEntry("goScale","f32"),e.componentSSBO.addEntry("gomin","f32"),e.componentSSBO.addEntry("gomax","f32"),e.componentSSBO.addEntry("mixWeight","f32"),e.componentSSBO.addEntry("opacityMode","f32")),e.componentSSBO.setAllInstancesFromArray("cScale",k),e.componentSSBO.setAllInstancesFromArray("cShift",F),e.componentSSBO.setAllInstancesFromArray("oScale",G),e.componentSSBO.setAllInstancesFromArray("oShift",b),e.componentSSBO.setAllInstancesFromArray("goScale",Q),e.componentSSBO.setAllInstancesFromArray("goShift",P),e.componentSSBO.setAllInstancesFromArray("gomin",z),e.componentSSBO.setAllInstancesFromArray("gomax",I),e.componentSSBO.setAllInstancesFromArray("mixWeight",$),e.componentSSBO.setAllInstancesFromArray("opacityMode",J),e.componentSSBO.send(a)};let r=t.updateBuffers;t.updateBuffers=()=>{r(),e.jitterSSBO||(e.jitterSSBO=e.device.getCachedObject("vtkWebGPUVolumePassFSQ-jitterSSBO",()=>{let c=zr.newInstance({label:"jitterSSBO"});c.setNumberOfInstances(1024),c.addEntry("value","f32");let f=new Float32Array(1024);for(let u=0;u<f.length;u++)f[u]=Math.random();return c.setAllInstancesFromArray("value",f),c.send(e.device),c})),e.kernelSampleSSBO||(e.kernelSampleSSBO=e.device.getCachedObject("vtkWebGPUVolumePassFSQ-kernelSampleSSBO",()=>{let c=zr.newInstance({label:"kernelSampleSSBO"});c.setNumberOfInstances(32),c.addEntry("value","vec2<f32>");let f=new Float32Array(64);for(let u=0;u<32;u++)f[u*2]=Math.random(),f[u*2+1]=Math.random();return c.setAllInstancesFromArray("value",f),c.send(e.device),c}));let a=e.WebGPURenderer.getRenderable().getVTKWindow()?.getInteractor()?.isAnimating()||!1,i=c=>c.getSampleDistance()*(a?c.getInteractionSampleDistanceFactor():1),s=i(e.volumes[0].getRenderable().getMapper());for(let c=0;c<e.volumes.length;c++){let f=i(e.volumes[c].getRenderable().getMapper());f<s&&(s=f)}let o=e.WebGPURenderer.getRenderable().getActiveCamera().getClippingRange();if(e.UBO.setValue("CamNear",o[0]),e.UBO.setValue("CamFar",o[1]),e.UBO.sendIfNeeded(e.device),e.sampleDist!==s){e.sampleDist=s,e.UBO.setValue("SampleDistance",s),e.UBO.sendIfNeeded(e.device);for(let c=0;c<e.volumes.length;c++){let f=e.volumes[c].getRenderable().getMapper(),u=f.getInputData().getBounds(),g=Math.hypot(u[1]-u[0],u[3]-u[2],u[5]-u[4]),l=Math.ceil(g/s);l>f.getMaximumSamplesPerRay()&&Yo(`The number of steps required ${l} is larger than the specified maximum number of steps ${f.getMaximumSamplesPerRay()}.
Please either change the volumeMapper sampleDistance or its maximum number of samples.`)}}for(let c=0;c<e.volumes.length;c++){let f=e.volumes[c],u=f.getRenderable(),g=u.getMapper().getInputData(),l=u.getProperty(),h=l?.getUpdatedExtents?.()??[],y=e.textureViews[c+4]?.getTexture(),p=!!l?.getPreferSizeOverAccuracy?.(),m=e.device.getTextureManager().getTextureForImageData(g,{updatedExtents:h,existingTexture:y,preferSizeOverAccuracy:p,owner:f});if(h.length&&l.setUpdatedExtents([]),!e.textureViews[c+4]||e.textureViews[c+4].getTexture()!==m){let d=m.createView(`volTexture${c}`);e.textureViews[c+4]=d}}{let c=e.volumes.map(u=>{let g=u.getRenderable().getProperty().getLabelOutlineThickness?.();return g==null?null:Array.isArray(g)?g:[g]}),f=JSON.stringify(c);if(e._labelThicknessHash!==f||e.volumes.length!==e.lastVolumeLength||!e.textureViews[4+e.volumes.length]){e._labelThicknessHash=f;let u=Math.max(1,...e.volumes.map(m=>m.getRenderable().getMapper().getLabelOutlineTextureWidth()));c.forEach(m=>{Array.isArray(m)&&(u=Math.max(u,m.length))});let g=u,l=Math.max(1,e.volumes.length),h=new Uint8Array(g*l);Gr(h,c.map(m=>m??[0]),g);let y={nativeArray:h,width:g,height:l,depth:1,format:"r8unorm"},p=e.device.getTextureManager().getTexture(y).createView("labelOutlineThicknessTexture");e.textureViews[4+e.volumes.length]=p}}e.textureViews.length=Math.min(e.textureViews.length,5+e.volumes.length),e.lastVolumeLength=e.volumes.length,t.updateLUTImage(e.device),t.updateSSBO(e.device),e.clampSampler||(e.clampSampler=mr.newInstance({label:"clampSampler"}),e.clampSampler.create(e.device,{minFilter:"linear",magFilter:"linear"}))},t.computePipelineHash=()=>{e.pipelineHash="volfsq";for(let a=0;a<e.volumes.length;a++){let i=e.volumes[a].getRenderable(),s=i.getMapper(),o=i.getProperty(),c=s.getBlendMode(),f=s.getInputData()?.getPointData()?.getScalars()?.getNumberOfComponents?.()??0,u=Number(o.getUseIndependentComponents(f)),g=Number(c===Ae.COMPOSITE_BLEND&&o.getUseLabelOutline()&&f===1);e.pipelineHash+=`${c}C${f}I${u}L${g}`}},t.setVolumes=a=>{if(!e.volumes||e.volumes.length!==a.length){e.volumes=[...a],t.modified();return}for(let i=0;i<a.length;i++)if(a[i]!==e.volumes[i]){e.volumes=[...a],t.modified();return}};let n=t.getBindables;t.getBindables=()=>{let a=n();return a.push(e.componentSSBO),a.push(e.jitterSSBO),a.push(e.kernelSampleSSBO),a.push(e.clampSampler),a}}var bE={volumes:null,colorRowLength:1024,opacityRowLength:1024,lastVolumeLength:0};function zh(t,e,r={}){Object.assign(e,bE,r),xt.extend(t,e,r),e.fragmentShaderTemplate=GE,e.UBO=Ot.newInstance({label:"mapperUBO"}),e.UBO.addEntry("SampleDistance","f32"),e.UBO.addEntry("CamNear","f32"),e.UBO.addEntry("CamFar","f32"),e.SSBO=zr.newInstance({label:"volumeSSBO"}),e.componentSSBO=zr.newInstance({label:"componentSSBO"}),e.lutBuildTime={},w.obj(e.lutBuildTime,{mtime:0}),e.clipPlanes=Array.from({length:6},()=>[0,0,0,0]),kE(t,e)}var zE=w.newInstance(zh,"vtkWebGPUVolumePassFSQ"),Wh={newInstance:zE,extend:zh};var{Representation:WE}=vr,{BufferUsage:Ih,PrimitiveTypes:IE}=Wt,Zo=[[0,4,6],[0,6,2],[1,3,7],[1,7,5],[0,5,4],[0,1,5],[2,6,7],[2,7,3],[0,3,1],[0,2,3],[4,5,7],[4,7,6]],HE=`
//VTK::Renderer::Dec

//VTK::Select::Dec

//VTK::VolumePass::Dec

//VTK::TCoord::Dec

//VTK::RenderEncoder::Dec

//VTK::Mapper::Dec

//VTK::IOStructs::Dec

@fragment
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output : fragmentOutput;

  //VTK::Select::Impl

  //VTK::TCoord::Impl

  //VTK::VolumePass::Impl

  // The bounds are rasterized over the full texture, while opaque geometry is
  // rasterized in the renderer viewport. Map this fragment to that viewport
  // before reading the opaque depth.
  let depthTextureSize = vec2<f32>(textureDimensions(opaquePassDepthTexture));
  let opaqueDepthCoord = vec2<i32>(rendererUBO.viewportOrigin +
    input.fragPos.xy * rendererUBO.viewportSize / depthTextureSize);

  // use the maximum (closest) of the current value and the zbuffer
  // the blend func will then take the min to find the farthest stop value
  var stopval: f32 = max(input.fragPos.z,
    textureLoad(opaquePassDepthTexture, opaqueDepthCoord, 0));

  //VTK::RenderEncoder::Impl
  return output;
}
`,jE=`
//VTK::Renderer::Dec

//VTK::Mapper::Dec

//VTK::TCoord::Dec

//VTK::RenderEncoder::Dec

//VTK::IOStructs::Dec

@fragment
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output: fragmentOutput;

  var computedColor: vec4<f32> = textureSample(volumePassColorTexture,
    volumePassColorTextureSampler, mapperUBO.tscale*input.tcoordVS);

  //VTK::RenderEncoder::Impl
  return output;
}
`;function PE(t,e){e.classHierarchy.push("vtkWebGPUVolumePass"),t.initialize=r=>{e._clearEncoder||t.createClearEncoder(r),e._mergeEncoder||t.createMergeEncoder(r),e._copyEncoder||t.createCopyEncoder(r),e._depthRangeEncoder||t.createDepthRangeEncoder(r),e.fullScreenQuad||(e.fullScreenQuad=Wh.newInstance(),e.fullScreenQuad.setDevice(r.getDevice()),e.fullScreenQuad.setTextureViews([...e._depthRangeEncoder.getColorTextureViews()])),e._volumeCopyQuad||(e._volumeCopyQuad=xt.newInstance(),e._volumeCopyQuad.setPipelineHash("volpassfsq"),e._volumeCopyQuad.setDevice(r.getDevice()),e._volumeCopyQuad.setFragmentShaderTemplate(jE),e._copyUBO=Ot.newInstance({label:"mapperUBO"}),e._copyUBO.addEntry("tscale","vec2<f32>"),e._volumeCopyQuad.setUBO(e._copyUBO),e._volumeCopyQuad.setTextureViews([e._colorTextureView]))},t.traverse=(r,n)=>{if(e.deleted)return;e._currentParent=n,t.initialize(n),t.computeTiming(n),t.renderDepthBounds(r,n),e._firstGroup=!0;let a=n.getDevice(),i=a.getHandle().limits.maxSampledTexturesPerShaderStage-5;if(e.volumes.length>i){let s=r.getRenderable().getActiveCamera().getPosition(),o=[];for(let g=0;g<e.volumes.length;g++){let l=e.volumes[g].getRenderable().getBounds(),h=[.5*(l[1]+l[0]),.5*(l[3]+l[2]),.5*(l[5]+l[4])];o[g]=ze(h,s)}let c=[...Array(e.volumes.length).keys()];c.sort((g,l)=>o[l]-o[g]);let f=[],u=c.length%i;u===0&&(u=i);for(let g=0;g<c.length;g++)f.push(e.volumes[c[g]]),f.length>=u&&(t.rayCastPass(n,r,f),f=[],u=i,e._firstGroup=!1)}else t.rayCastPass(n,r,e.volumes);if(e._volumeCopyQuad.setWebGPURenderer(r),e._useSmallViewport){let s=e._colorTextureView.getTexture().getWidth(),o=e._colorTextureView.getTexture().getHeight();e._copyUBO.setArray("tscale",[e._smallViewportWidth/s,e._smallViewportHeight/o])}else e._copyUBO.setArray("tscale",[1,1]);e._copyUBO.sendIfNeeded(a),e._copyEncoder.setColorTextureView(0,e.colorTextureView),e._copyEncoder.attachTextureViews(),e._copyEncoder.begin(n.getCommandEncoder()),r.scissorAndViewport(e._copyEncoder),e._volumeCopyQuad.prepareAndDraw(e._copyEncoder),e._copyEncoder.end()},t.delete=w.chain(()=>{e._animationRateSubscription&&(e._animationRateSubscription.unsubscribe(),e._animationRateSubscription=null)},t.delete),t.computeTiming=r=>{let n=r.getRenderable().getInteractor();e._lastScale==null&&(e._lastScale=e.volumes[0].getRenderable().getMapper().getInitialInteractionScale()||1),e._useSmallViewport=!1,n.isAnimating()&&e._lastScale>1.5&&(e._useSmallViewport=!0),e._colorTexture.resize(r.getCanvas().width,r.getCanvas().height),e._animationRateSubscription||(e._animationRateSubscription=n.onAnimationFrameRateUpdate(()=>{let a=e.volumes[0].getRenderable().getMapper();if(a.getAutoAdjustSampleDistances()){let i=n.getRecentAnimationFrameRate();e._lastScale=e._lastScale*n.getDesiredUpdateRate()/i,e._lastScale>400&&(e._lastScale=400)}else e._lastScale=a.getImageSampleDistance()*a.getImageSampleDistance();e._lastScale<1.5&&(e._lastScale=1.5)}))},t.rayCastPass=(r,n,a)=>{let i=e._firstGroup?e._clearEncoder:e._mergeEncoder;i.attachTextureViews(),i.begin(r.getCommandEncoder());let s=e._colorTextureView.getTexture().getWidth(),o=e._colorTextureView.getTexture().getHeight();if(e._useSmallViewport){let c=r.getCanvas(),f=1/Math.sqrt(e._lastScale);e._smallViewportWidth=Math.ceil(f*c.width),e._smallViewportHeight=Math.ceil(f*c.height),s=e._smallViewportWidth,o=e._smallViewportHeight}i.getHandle().setViewport(0,0,s,o,0,1),i.getHandle().setScissorRect(0,0,s,o),e.fullScreenQuad.setWebGPURenderer(n),e.fullScreenQuad.setVolumes(a),e.fullScreenQuad.prepareAndDraw(i),i.end()},t.renderDepthBounds=(r,n)=>{t.updateDepthPolyData(r);let a=e._boundsPoly,i=a.getPoints(),s=a.getPolys(),o={hash:`vp${s.getMTime()}`,usage:Ih.Index,cells:s,numberOfPoints:i.getNumberOfPoints(),primitiveType:IE.Triangles,representation:WE.SURFACE},c=n.getDevice().getBufferManager().getBuffer(o);e._mapper.getVertexInput().setIndexBuffer(c),o={usage:Ih.PointArray,format:"float32x4",hash:`vp${i.getMTime()}${s.getMTime()}`,dataArray:i,indexBuffer:c,packExtra:!0};let f=n.getDevice().getBufferManager().getBuffer(o);e._mapper.getVertexInput().addBuffer(f,["vertexBC"]),e._mapper.setNumberOfVertices(f.getSizeInBytes()/f.getStrideInBytes()),t.drawDepthRange(r,n)},t.updateDepthPolyData=r=>{let n=e._lastMTimes.length!==e.volumes.length+1;for(let u=0;u<e.volumes.length;u++){let g=e.volumes[u],l=g.getRenderable(),h=l.getMapper(),y=h.getInputData(),p=Math.max(g.getMTime(),l.getMTime(),h.getMTime(),y?.getMTime()??0);p!==e._lastMTimes[u]&&(n=!0,e._lastMTimes[u]=p)}let a=r.getStabilizedTime();if((e._lastMTimes.length<=e.volumes.length||a!==e._lastMTimes[e.volumes.length])&&(n=!0,e._lastMTimes[e.volumes.length]=a),e._lastMTimes.length=e.volumes.length+1,!n)return;let i=r.getStabilizedCenterByReference(),s=e.volumes.length*8,o=new Float64Array(s*3),c=e.volumes.length*12,f=new Uint16Array(c*4);for(let u=0;u<e.volumes.length;u++){e.volumes[u].getBoundingCubePoints(o,u*24);let g=u*12*4,l=u*8;for(let h=0;h<12;h++)f[g++]=3,f[g++]=l+Zo[h][0],f[g++]=l+Zo[h][1],f[g++]=l+Zo[h][2]}for(let u=0;u<o.length;u+=3)o[u]-=i[0],o[u+1]-=i[1],o[u+2]-=i[2];e._boundsPoly.getPoints().setData(o,3),e._boundsPoly.getPoints().modified(),e._boundsPoly.getPolys().setData(f,1),e._boundsPoly.getPolys().modified(),e._boundsPoly.modified()},t.drawDepthRange=(r,n)=>{e._depthRangeTexture.resizeToMatch(e.colorTextureView.getTexture()),e._depthRangeTexture2.resizeToMatch(e.colorTextureView.getTexture()),e._depthRangeEncoder.attachTextureViews(),t.setCurrentOperation("volumeDepthRangePass"),r.setRenderEncoder(e._depthRangeEncoder),r.volumeDepthRangePass(!0),e._mapper.setWebGPURenderer(r),e._mapper.prepareToDraw(e._depthRangeEncoder),e._mapper.registerDrawCallback(e._depthRangeEncoder),r.volumeDepthRangePass(!1)},t.createDepthRangeEncoder=r=>{let n=r.getDevice();e._depthRangeEncoder=st.newInstance({label:"VolumePass DepthRange"}),e._depthRangeEncoder.setPipelineHash("volr"),e._depthRangeEncoder.setReplaceShaderCodeFunction(s=>{let o=s.getShaderDescription("fragment");o.addOutput("vec4<f32>","outColor1"),o.addOutput("vec4<f32>","outColor2");let c=o.getCode();c=K.substitute(c,"//VTK::RenderEncoder::Impl",["output.outColor1 = vec4<f32>(1.0 - input.fragPos.z, 0.0, 0.0, 0.0);","output.outColor2 = vec4<f32>(1.0 - stopval, 0.0, 0.0, 0.0);"]).result,o.setCode(c)}),e._depthRangeEncoder.setDescription({colorAttachments:[{view:null,clearValue:[1,1,1,1],loadOp:"clear",storeOp:"store"},{view:null,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]}),e._depthRangeEncoder.setPipelineSettings({primitive:{cullMode:"none"},fragment:{targets:[{format:"r16float",blend:{color:{srcFactor:"one",dstFactor:"one",operation:"min"},alpha:{srcFactor:"one",dstFactor:"one",operation:"min"}}},{format:"r16float",blend:{color:{srcFactor:"one",dstFactor:"one",operation:"max"},alpha:{srcFactor:"one",dstFactor:"one",operation:"max"}}}]}}),e._depthRangeTexture=Ye.newInstance({label:"volumePassMaxDepth"}),e._depthRangeTexture.create(n,{width:r.getCanvas().width,height:r.getCanvas().height,format:"r16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});let a=e._depthRangeTexture.createView("maxTexture");e._depthRangeEncoder.setColorTextureView(0,a),e._depthRangeTexture2=Ye.newInstance({label:"volumePassDepthMin"}),e._depthRangeTexture2.create(n,{width:r.getCanvas().width,height:r.getCanvas().height,format:"r16float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING});let i=e._depthRangeTexture2.createView("minTexture");e._depthRangeEncoder.setColorTextureView(1,i),e._mapper.setDevice(r.getDevice()),e._mapper.setTextureViews([e.depthTextureView])},t.createClearEncoder=r=>{e._colorTexture=Ye.newInstance({label:"volumePassColor"}),e._colorTexture.create(r.getDevice(),{width:r.getCanvas().width,height:r.getCanvas().height,format:"bgra8unorm",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_SRC}),e._colorTextureView=e._colorTexture.createView("volumePassColorTexture"),e._colorTextureView.addSampler(r.getDevice(),{minFilter:"linear",magFilter:"linear"}),e._clearEncoder=st.newInstance({label:"VolumePass Clear"}),e._clearEncoder.setColorTextureView(0,e._colorTextureView),e._clearEncoder.setDescription({colorAttachments:[{view:null,clearValue:[0,0,0,0],loadOp:"clear",storeOp:"store"}]}),e._clearEncoder.setPipelineHash("volpf"),e._clearEncoder.setPipelineSettings({primitive:{cullMode:"none"},fragment:{targets:[{format:"bgra8unorm",blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]}})},t.createCopyEncoder=r=>{e._copyEncoder=st.newInstance({label:"volumePassCopy"}),e._copyEncoder.setDescription({colorAttachments:[{view:null,loadOp:"load",storeOp:"store"}]}),e._copyEncoder.setPipelineHash("volcopypf"),e._copyEncoder.setPipelineSettings({primitive:{cullMode:"none"},fragment:{targets:[{format:"rgba16float",blend:{color:{srcFactor:"one",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]}})},t.createMergeEncoder=r=>{e._mergeEncoder=st.newInstance({label:"volumePassMerge"}),e._mergeEncoder.setColorTextureView(0,e._colorTextureView),e._mergeEncoder.setDescription({colorAttachments:[{view:null,loadOp:"load",storeOp:"store"}]}),e._mergeEncoder.setReplaceShaderCodeFunction(n=>{let a=n.getShaderDescription("fragment");a.addOutput("vec4<f32>","outColor");let i=a.getCode();i=K.substitute(i,"//VTK::RenderEncoder::Impl",["output.outColor = vec4<f32>(computedColor.rgb, computedColor.a);"]).result,a.setCode(i)}),e._mergeEncoder.setPipelineHash("volpf"),e._mergeEncoder.setPipelineSettings({primitive:{cullMode:"none"},fragment:{targets:[{format:"bgra8unorm",blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]}})},t.setVolumes=r=>{if(!e.volumes||e.volumes.length!==r.length){e._lastScale=null,e._lastMTimes.length=0,e.volumes=[...r],t.modified();return}for(let n=0;n<r.length;n++)if(r[n]!==e.volumes[n]){e._lastScale=null,e._lastMTimes.length=0,e.volumes=[...r],t.modified();return}},t.releaseGraphicsResources=()=>{e._animationRateSubscription&&(e._animationRateSubscription.unsubscribe(),e._animationRateSubscription=null),e._mapper.releaseGraphicsResources?.(),e._volumeCopyQuad?.releaseGraphicsResources?.(),e.fullScreenQuad?.releaseGraphicsResources?.(),e._clearEncoder=null,e._mergeEncoder=null,e._copyEncoder=null,e._depthRangeEncoder=null,e._colorTexture=null,e._colorTextureView=null,e._depthRangeTexture=null,e._depthRangeTexture2=null,e._volumeCopyQuad=null,e.fullScreenQuad=null,e._copyUBO=null,e.colorTextureView=null,e.depthTextureView=null}}var $E={colorTextureView:null,depthTextureView:null,volumes:null};function Hh(t,e,r={}){Object.assign(e,$E,r),Xe.extend(t,e,r),e._mapper=on.newInstance(),e._mapper.setFragmentShaderTemplate(HE),e._mapper.getShaderReplacements().set("replaceShaderVolumePass",(n,a,i)=>{a.getShaderDescription("fragment").addBuiltinInput("vec4<f32>","@builtin(position) fragPos")}),e._boundsPoly=tt.newInstance(),e._lastMTimes=[],w.setGet(t,e,["colorTextureView","depthTextureView"]),PE(t,e)}var AE=w.newInstance(Hh,"vtkWebGPUVolumePass"),jh={newInstance:AE,extend:Hh};var KE=`
//VTK::Mapper::Dec

//VTK::TCoord::Dec

//VTK::RenderEncoder::Dec

//VTK::IOStructs::Dec

@fragment
fn main(
//VTK::IOStructs::Input
)
//VTK::IOStructs::Output
{
  var output: fragmentOutput;

  var texCoord: vec2<i32> =
    vec2<i32>(i32(input.fragPos.x), i32(input.fragPos.y));
  var computedColor: vec4<f32> = clamp(
    textureLoad(opaquePassColorTexture, texCoord, 0),
    vec4<f32>(0.0),
    vec4<f32>(1.0)
  );

  //VTK::RenderEncoder::Impl
  return output;
}
`;function XE(t,e){e.classHierarchy.push("vtkForwardPass"),t.traverse=(r,n=null)=>{if(e.deleted)return;e._currentParent=n;let a=!!n?.getCaptureDelegateOutput?.();t.setCurrentOperation("buildPass"),r.traverse(t),e.opaquePass||(e.opaquePass=Fh.newInstance());let i=r.getRenderable().getNumberOfLayers(),s=r.getChildren();for(let o=0;o<i;o++)for(let c=0;c<s.length;c++){let f=s[c],u=r.getRenderable().getRenderers()[c];u.getDraw()&&u.getLayer()===o&&(e.opaqueActorCount=0,e.translucentActorCount=0,e.volumes=[],t.setCurrentOperation("queryPass"),f.traverse(t),t.setCurrentOperation("cameraPass"),f.traverse(t),e.opaquePass.traverse(f,r),e.translucentActorCount>0&&(e.translucentPass||(e.translucentPass=Nh.newInstance()),e.translucentPass.setColorTextureView(e.opaquePass.getColorTextureView()),e.translucentPass.setDepthTextureView(e.opaquePass.getDepthTextureView()),e.translucentPass.traverse(f,r)),e.volumes.length>0&&(e.volumePass||(e.volumePass=jh.newInstance()),e.volumePass.setColorTextureView(e.opaquePass.getColorTextureView()),e.volumePass.setDepthTextureView(e.opaquePass.getDepthTextureView()),e.volumePass.setVolumes(e.volumes),e.volumePass.traverse(f,r)),a||t.finalPass(r,f))}},t.finalPass=(r,n)=>{e._finalBlitEncoder||t.createFinalBlitEncoder(r),e._finalBlitOutputTextureView.createFromTextureHandle(r.getCurrentTexture(),{depth:1,format:r.getPresentationFormat()}),e._finalBlitEncoder.attachTextureViews(),e._finalBlitEncoder.begin(r.getCommandEncoder()),n.scissorAndViewport(e._finalBlitEncoder),e._fullScreenQuad.prepareAndDraw(e._finalBlitEncoder),e._finalBlitEncoder.end()},t.createFinalBlitEncoder=r=>{e._finalBlitEncoder=st.newInstance({label:"forwardPassBlit"}),e._finalBlitEncoder.setDescription({colorAttachments:[{view:null,loadOp:"load",storeOp:"store"}]}),e._finalBlitEncoder.setPipelineHash("fpf"),e._finalBlitEncoder.setPipelineSettings({primitive:{cullMode:"none"},fragment:{targets:[{format:r.getPresentationFormat(),blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha"}}}]}}),e._fsqSampler=mr.newInstance({label:"finalPassSampler"}),e._fsqSampler.create(r.getDevice(),{minFilter:"linear",magFilter:"linear"}),e._fullScreenQuad=xt.newInstance(),e._fullScreenQuad.setDevice(r.getDevice()),e._fullScreenQuad.setPipelineHash("fpfsq"),e._fullScreenQuad.setTextureViews([e.opaquePass.getColorTextureView()]),e._fullScreenQuad.setAdditionalBindables([e._fsqSampler]),e._fullScreenQuad.setFragmentShaderTemplate(KE),e._fullScreenQuad.getShaderReplacements().set("replaceShaderTCoord",(n,a)=>{let i=a.getShaderDescription("vertex");i.hasOutput("tcoordVS")||i.addOutput("vec2<f32>","tcoordVS"),a.getShaderDescription("fragment").addBuiltinInput("vec4<f32>","@builtin(position) fragPos")}),e._finalBlitOutputTextureView=ji.newInstance(),e._finalBlitEncoder.setColorTextureView(0,e._finalBlitOutputTextureView)},t.incrementOpaqueActorCount=()=>e.opaqueActorCount++,t.incrementTranslucentActorCount=()=>e.translucentActorCount++,t.addVolume=r=>{e.volumes.push(r)},t.releaseGraphicsResources=()=>{e.opaquePass?.releaseGraphicsResources?.(),e.translucentPass?.releaseGraphicsResources?.(),e.volumePass?.releaseGraphicsResources?.(),e.opaquePass=null,e.translucentPass=null,e.volumePass=null,e._finalBlitEncoder=null,e._finalBlitOutputTextureView=null,e._fullScreenQuad=null,e._fsqSampler=null}}var YE={opaqueActorCount:0,translucentActorCount:0,volumes:null,opaqueRenderEncoder:null,translucentPass:null,volumePass:null};function Ph(t,e,r={}){Object.assign(e,YE,r),Xe.extend(t,e,r),w.setGet(t,e,["opaquePass","translucentPass","volumePass"]),XE(t,e)}var qE=w.newInstance(Ph,"vtkForwardPass"),$h={newInstance:qE,extend:Ph};var{vtkErrorMacro:sa,vtkWarningMacro:ZE}=w;function Ah(t,e,r){let n=!0;return Object.entries(t).forEach(([a,i])=>{let s=e?.[a];(typeof s!="number"||s<i)&&(ZE(`WebGPU ${r} limit "${a}" is ${s??"unavailable"}, but vtk.js requested ${i}.`),n=!1)}),n}function QE(t,e){e.classHierarchy.push("vtkWebGPUConfiguration");function r(a){a.lost?.then(()=>{e.device===a&&(e.device=null,e.adapter=null,e.deviceReady=!1,t.modified())})}function n(a){a.addEventListener?.("uncapturederror",i=>{let s=i.error;sa(`WebGPU uncaptured error: ${s?.message||String(s)}`)})}t.initialize=async()=>{if(e.deviceReady)return!0;if(e.initializationPromise)return e.initializationPromise;let a=e.initializationGeneration,i=(async()=>{if(!navigator.gpu)return sa("WebGPU is not enabled."),!1;try{let s=await navigator.gpu.requestAdapter({powerPreference:e.powerPreference});if(!s)return sa("Failed to acquire a WebGPU adapter."),!1;let o=(e.optionalFeatures||[]).filter(u=>s.features.has(u)),c=e.requiredLimits||{maxBufferSize:s.limits.maxBufferSize,maxStorageBufferBindingSize:s.limits.maxStorageBufferBindingSize,maxUniformBufferBindingSize:s.limits.maxUniformBufferBindingSize};if(!Ah(c,s.limits,"adapter"))return!1;let f=await s.requestDevice({requiredFeatures:o,requiredLimits:c});return f?!Ah(c,f.limits,"device")||e.initializationGeneration!==a?(f.destroy(),!1):(e.adapter=s,e.device=f,e.deviceReady=!0,r(f),n(f),!0):(sa("Failed to acquire a WebGPU device."),!1)}catch(s){return sa(`WebGPU device creation failed: ${s?.message||String(s)}`),!1}})();e.initializationPromise=i;try{return await i}finally{e.initializationPromise===i&&(e.initializationPromise=null)}},t.isInitialized=()=>e.deviceReady,t.hasFeature=a=>!!e.device?.features?.has(a),t.getFeature=a=>t.hasFeature(a),t.finalize=()=>{e.initializationGeneration+=1,e.initializationPromise=null,e.device?.destroy?.(),e.device=null,e.adapter=null,e.deviceReady=!1}}var JE={adapter:null,device:null,deviceReady:!1,initializationPromise:null,initializationGeneration:0,powerPreference:"high-performance",requiredLimits:void 0,optionalFeatures:["float32-filterable","primitive-index","texture-formats-tier1"]};function Kh(t,e,r={}){Object.assign(e,JE,r),w.obj(t,e),w.get(t,e,["adapter","device","deviceReady"]),w.setGet(t,e,["powerPreference","requiredLimits","optionalFeatures"]),QE(t,e)}var eM=w.newInstance(Kh,"vtkWebGPUConfiguration"),Qo={newInstance:eM,extend:Kh};var{VtkDataTypes:wr}=Z,Xh=2048,tM="texture-formats-tier1";function rM(t,e){e.classHierarchy.push("vtkWebGPUTextureManager");function r(S){switch(S){case 1:return"r";case 2:return"rg";default:return"rgba"}}function n(S){return e.device.hasFeature(tM)?S===wr.SHORT?"16snorm":S===wr.UNSIGNED_SHORT?"16unorm":null:null}function a(S){let E=S.getMTime(),R=e.scalarFormats.get(S);return R?.scalarMTime!==E&&(R={contentTime:void 0,contentVersion:0,halfFloatFitVersion:-1,formats:[],scalarMTime:E,promotedFormat:R?.promotedFormat??null,liveTextures:R?.liveTextures??new Map},e.scalarFormats.set(S,R)),R}function i(S,E){if(E)return null;let R=a(S);return R.promotedFormat&&!u(R.promotedFormat,S)&&(R.promotedFormat=null),R.promotedFormat}function s(S,E){let R=i(S,E);if(R)return R;let D=a(S),V=E?1:0,U=D.formats[V]??null;return!E&&U?.endsWith("16float")&&D.halfFloatFitVersion!==D.contentVersion?null:U}function o(S,E,R){let D=a(S),V=R?1:0;D.formats[V]=E,!R&&E.endsWith("32float")&&(D.promotedFormat=E)}function c(S,E){let R=a(S),D=R.halfFloatFitVersion===R.contentVersion;return R.contentTime!==E&&(R.contentTime=E,R.contentVersion++),{previousContentFitsHalfFloat:D,version:R.contentVersion}}function f(S,E){a(S).halfFloatFitVersion=E}function u(S,E){let R=E.getNumberOfComponents(),D=R===3?4:R;if(Ve.getDetailsFromTextureFormat(S)?.numComponents!==D)return!1;let V=E.getDataType();if(V===wr.UNSIGNED_CHAR||V===wr.UNSIGNED_CHAR_CLAMPED)return S.endsWith("8unorm");let U=n(V);return U?S.endsWith(U):S.endsWith("16float")||S.endsWith("32float")}function g(S){let E=S.getData();for(let R=0;R<E.length;R++)if(E[R]<-2048||E[R]>Xh)return!1;return!0}function l(S,E,R){let D=S.getData(),V=S.getNumberOfComponents(),U=E[0]*V,B=E[1]*U;for(let _=0;_<R.length;_++){let[N,k,F,G,b,z]=R[_],I=(k-N+1)*V;for(let P=b;P<=z;P++)for(let Q=F;Q<=G;Q++){let $=P*B+Q*U+N*V,J=$+I;for(let Y=$;Y<J;Y++)if(D[Y]<-2048||D[Y]>Xh)return!1}}return!0}function h(S){let E=S.dataArray.getDataType();if(E===wr.UNSIGNED_CHAR||E===wr.UNSIGNED_CHAR_CLAMPED)return"8unorm";let R=n(E);return R||(S.forceFloat32?"32float":!S.preferSizeOverAccuracy&&e.device.hasFeature("float32-filterable")?(S.fitsHalfFloat=g(S.dataArray),S.fitsHalfFloat?"16float":"32float"):"16float")}function y(S){if(S.imageData){S.dataArray=S.imageData.getPointData().getScalars(),S.time=S.dataArray.getMTime(),S.nativeArray=S.dataArray.getData();let E=S.imageData.getDimensions();S.width=E[0],S.height=E[1],S.depth=E[2];let R=S.dataArray.getNumberOfComponents();if(S.format=r(R),R===3){let D=S.nativeArray,V=w.newTypedArray(D.constructor.name,D.length/3*4),U=D.BYTES_PER_ELEMENT===1?255:1;for(let B=0,_=0;B<D.length;B+=3,_+=4)V[_]=D[B],V[_+1]=D[B+1],V[_+2]=D[B+2],V[_+3]=U;S.nativeArray=V}S.existingFormat?S.format=S.existingFormat:S.format+=h(S)}S.image&&(S.width=S.image.width,S.height=S.image.height,S.depth=1,S.format="rgba8unorm",S.flip=!0,S.usage=GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT),S.jsImageData&&(S.width=S.jsImageData.width,S.height=S.jsImageData.height,S.depth=1,S.format="rgba8unorm",S.flip=!0,S.nativeArray=S.jsImageData.data,S.usage=GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT),S.imageBitmap&&(S.width=S.imageBitmap.width,S.height=S.imageBitmap.height,S.depth=1,S.format="rgba8unorm",S.flip=!0,S.usage=GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT),S.canvas&&(S.width=S.canvas.width,S.height=S.canvas.height,S.depth=1,S.format="rgba8unorm",S.flip=!0,S.usage=GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.RENDER_ATTACHMENT),S.usage===void 0&&(S.usage=GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST)}function p(S){let E=Ye.newInstance({label:S.label});return E.create(e.device,{width:S.width,height:S.height,depth:S.depth,format:S.format,usage:S.usage,mipLevel:S.mipLevel}),(S.nativeArray||S.image||S.canvas||S.imageBitmap)&&E.writeImageData(S),E}function m(S,E){return!!S?.getHandle?.()&&S.getFormat()===E.format&&S.getWidth()===E.width&&S.getHeight()===E.height&&S.getDepth()===E.depth&&S.getMipLevel?.()===(E.mipLevel??0)&&S.getUsage?.()===E.usage}function d(S,E,R){let D=[E.width,E.height,E.depth];for(let V=0;V<R.length;V++){let U=R[V];if(S.writeSubImageData({x:U[0],y:U[2],z:U[4],width:U[1]-U[0]+1,height:U[3]-U[2]+1,depth:U[5]-U[4]+1,nativeArray:E.nativeArray,sourceLayout:{width:D[0],height:D[1],depth:D[2],x:U[0],y:U[2],z:U[4]},deferMipmaps:!0})===!1)return!1}return S.generateMipmaps?.(),!0}function x(S){let E=(e.textureUseCounts.get(S)??1)-1;if(E>0){e.textureUseCounts.set(S,E);return}e.textureUseCounts.delete(S),e.device.afterNextSubmit(()=>{e.textureUseCounts.has(S)||e.unownedTextures.has(S)||(e.device.removeCachedObject(S),S.destroy?.())})}function T(S,E){let R=e.textureOwners.get(S);R!==E&&(e.textureOwners.set(S,E),e.textureUseCounts.set(E,(e.textureUseCounts.get(E)??0)+1),R&&x(R))}t.releaseTexture=S=>{let E=e.textureOwners.get(S);E&&(e.textureOwners.delete(S),x(E))};function v(S){return`${S.format}:${S.mipLevel??0}:${S.usage}`}function C(S){let E=a(S.dataArray).liveTextures.get(v(S))?.deref();return!E||!m(E,S)?null:(E.writeImageData(S),e.device.getCachedObject(S.hash,()=>E),E)}function O(S,E){E&&typeof E=="object"&&a(S.dataArray).liveTextures.set(v(S),new WeakRef(E))}t.getTexture=S=>S.hash?e.device.getCachedObject(S.hash,p,S):p(S);function M(S,E){let R={time:S.getMTime()},{updatedExtents:D,existingTexture:V}=E;R.imageData=S,R.preferSizeOverAccuracy=!!E.preferSizeOverAccuracy;let U=S.getPointData().getScalars(),{previousContentFitsHalfFloat:B,version:_}=c(U,S.getMTime());if(D?.length&&V){let z=V.getFormat(),I=i(U,R.preferSizeOverAccuracy);if(I&&I!==z)R.forceFloat32=!0;else if(u(z,U)){let P=U.getDataType(),Q=!R.preferSizeOverAccuracy&&P!==wr.UNSIGNED_CHAR&&P!==wr.UNSIGNED_CHAR_CLAMPED&&z.endsWith("16float")&&e.device.hasFeature("float32-filterable");!Q||l(U,S.getDimensions(),D)?(R.existingFormat=z,R.partialFormat=!0,R.fitsHalfFloat=Q&&B):R.forceFloat32=!0}}else R.existingFormat=s(S.getPointData().getScalars(),R.preferSizeOverAccuracy);y(R),R.time=Math.max(R.time,S.getMTime()),E.generateMipmaps&&R.depth===1&&R.format==="rgba8unorm"&&(R.mipLevel=Math.floor(Math.log2(Math.max(R.width,R.height,1))),R.usage=GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING),R.hash=`${R.time}:${R.format}:${R.mipLevel??0}:${R.usage}`;let N=e.device.hasCachedObject(R.hash),k=V;if(m(N,R)&&(k=N),D?.length&&m(k,R)){let z=d(k,R,D);if(z&&!N&&e.device.getCachedObject(R.hash,()=>k),z)return o(R.dataArray,R.format,R.preferSizeOverAccuracy),R.fitsHalfFloat&&f(R.dataArray,_),O(R,k),k}R.partialFormat&&(delete R.partialFormat,delete R.existingFormat,R.format=r(R.dataArray.getNumberOfComponents())+h(R),R.hash=`${R.time}:${R.format}:${R.mipLevel??0}:${R.usage}`),o(R.dataArray,R.format,R.preferSizeOverAccuracy),R.fitsHalfFloat&&f(R.dataArray,_);let F=e.device.hasCachedObject(R.hash);if(F)return F;let G=C(R);if(G)return G;let b=e.device.getTextureManager().getTexture(R);return O(R,b),b}t.getTextureForImageData=(S,E={})=>{let R=M(S,E);return R&&typeof R=="object"&&(E.owner?T(E.owner,R):e.unownedTextures.add(R)),R},t.getTextureForVTKTexture=(S,E=void 0)=>{let R={time:S.getMTime(),label:E};S.getInputData()?(R.imageData=S.getInputData(),R.existingFormat=s(R.imageData.getPointData().getScalars(),!1)):S.getImage()?R.image=S.getImage():S.getJsImageData()?R.jsImageData=S.getJsImageData():S.getImageBitmap()?R.imageBitmap=S.getImageBitmap():S.getCanvas()&&(R.canvas=S.getCanvas()),y(R),R.imageData&&o(R.dataArray,R.format,!1),R.time=Math.max(R.time,S.getMTime()),R.imageData&&(R.time=Math.max(R.time,R.imageData.getMTime())),R.mipLevel=S.getMipLevel(),R.hash=`${R.time}:${R.format}:${R.mipLevel??0}:${R.usage}`;let D=e.device.getTextureManager().getTexture(R);return D&&typeof D=="object"&&e.unownedTextures.add(D),D}}var nM={handle:null,device:null,scalarFormats:null,textureOwners:null,textureUseCounts:null,unownedTextures:null};function Yh(t,e,r={}){Object.assign(e,nM,r),e.scalarFormats=new WeakMap,e.textureOwners=new WeakMap,e.textureUseCounts=new Map,e.unownedTextures=new WeakSet,w.obj(t,e),w.setGet(t,e,["device"]),rM(t,e)}var aM=w.newInstance(Yh),qh={newInstance:aM,extend:Yh};var iM=class extends Map{constructor(){super(),this.registry=new FinalizationRegistry(t=>{let e=super.get(t);e&&e.deref&&e.deref()===void 0&&super.delete(t)})}getValue(t){let e=super.get(t);if(e){let r=e.deref();if(r!==void 0)return r;super.delete(t)}}setValue(t,e){let r;return e&&typeof e=="object"&&(r=new WeakRef(e),this.registry.register(e,t),super.set(t,r)),r}deleteValue(t){super.forEach((e,r)=>{e.deref()===t&&super.delete(r)})}};function sM(t,e){e.classHierarchy.push("vtkWebGPUDevice"),t.initialize=r=>{if(e.handle===r)return;e.handle=r,e.generation+=1;let n=e.generation;r?.lost?.then(a=>{e.handle===r&&e.generation===n&&t.invokeDeviceLost({info:a,generation:n})})},t.hasFeature=r=>!!e.handle?.features?.has(r),t.createCommandEncoder=()=>e.handle.createCommandEncoder(),t.submitCommandEncoder=r=>{e.handle.queue.submit([r.finish()]);let n=e.afterSubmitCallbacks;e.afterSubmitCallbacks=[];for(let a=0;a<n.length;a++)n[a]()},t.afterNextSubmit=r=>{e.afterSubmitCallbacks.push(r)},t.getShaderModule=r=>e.shaderCache.getShaderModule(r),t.getBindGroupLayout=r=>{if(!r.entries)return null;for(let i=0;i<r.entries.length;i++){let s=r.entries[i];s.binding=s.binding||0,s.visibility=s.visibility||GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT}let n=JSON.stringify(r);for(let i=0;i<e.bindGroupLayouts.length;i++)if(e.bindGroupLayouts[i].sval===n)return e.bindGroupLayouts[i].layout;let a=e.handle.createBindGroupLayout(r);return e.bindGroupLayouts.push({sval:n,layout:a}),a},t.getBindGroupLayoutDescription=r=>{for(let n=0;n<e.bindGroupLayouts.length;n++)if(e.bindGroupLayouts[n].layout===r)return e.bindGroupLayouts[n].sval;return vtkErrorMacro("layout not found"),console.trace(),null},t.getPipeline=r=>r in e.pipelines?e.pipelines[r]:null,t.createPipeline=(r,n)=>{n.initialize(t,r),e.pipelines[r]=n},t.onSubmittedWorkDone=()=>e.handle.queue.onSubmittedWorkDone(),t.hasCachedObject=r=>e.objectCache.getValue(r),t.removeCachedObject=r=>{e.objectCache.deleteValue(r)},t.getCachedObject=(r,n,...a)=>{if(!r)return vtkErrorMacro("attempt to cache an object without a hash"),null;let i=e.objectCache.getValue(r);if(i)return i;let s=n(...a);return e.objectCache.setValue(r,s),s}}var oM={handle:null,generation:0,pipelines:null,shaderCache:null,bindGroupLayouts:null,bufferManager:null,textureManager:null};function Zh(t,e,r={}){Object.assign(e,oM,r),pe(t,e),Sa(t,e,"deviceLost"),de(t,e,["handle"]),Ee(t,e,["generation","bufferManager","shaderCache","textureManager"]),e.objectCache=new iM,e.shaderCache=K.newInstance(),e.shaderCache.setDevice(t),e.bindGroupLayouts=[],e.bufferManager=Wt.newInstance(),e.bufferManager.setDevice(t),e.textureManager=qh.newInstance(),e.textureManager.setDevice(t),e.pipelines={},e.afterSubmitCallbacks=[],sM(t,e)}var cM=ue(Zh,"vtkWebGPUDevice"),Qh={newInstance:cM,extend:Zh};function fM(t,e){e.classHierarchy.push("vtkWebGPUHardwareSelectionPass"),t.traverse=(r,n)=>{if(e.deleted)return;e._currentParent=null,t.setCurrentOperation("buildPass"),r.traverse(t);let a=r.getDevice();if(e.selectionRenderEncoder)e.colorTexture.resize(r.getCanvas().width,r.getCanvas().height),e.depthTexture.resizeToMatch(e.colorTexture);else{t.createRenderEncoder(),e.colorTexture=Ye.newInstance({label:"hardwareSelectorColor"}),e.colorTexture.create(a,{width:r.getCanvas().width,height:r.getCanvas().height,format:"rgba32uint",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC});let i=e.colorTexture.createView("hardwareSelectColorTexture");e.selectionRenderEncoder.setColorTextureView(0,i),e.depthTexture=Ye.newInstance({label:"hardwareSelectorDepth"}),e.depthTexture.create(a,{width:r.getCanvas().width,height:r.getCanvas().height,format:"depth32float",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC});let s=e.depthTexture.createView("hardwareSelectDepthTexture");e.selectionRenderEncoder.setDepthTextureView(s)}e.selectionRenderEncoder.attachTextureViews(),n.setRenderEncoder(e.selectionRenderEncoder),t.setCurrentOperation("cameraPass"),n.traverse(t),t.setCurrentOperation("opaquePass"),n.traverse(t)},t.createRenderEncoder=()=>{e.selectionRenderEncoder=st.newInstance({label:"HardwareSelectionPass"}),e.selectionRenderEncoder.setPipelineHash("sel"),e.selectionRenderEncoder.setReplaceShaderCodeFunction(n=>{let a=n.getShaderDescription("fragment");a.addOutput("vec4<u32>","outColor");let i=a.getCode();i=K.substitute(i,"//VTK::Select::Impl",["  var compositeID: u32 = 0u;","  var attributeID: u32 = compositeID;"]).result,i=K.substitute(i,"//VTK::RenderEncoder::Impl",["output.outColor = vec4<u32>(mapperUBO.PropID, compositeID, attributeID + 1u, 0u);"]).result,a.setCode(i)});let r=e.selectionRenderEncoder.getDescription();r.colorAttachments[0].clearValue=[0,0,0,0],e.selectionRenderEncoder.setPipelineSettings({primitive:{cullMode:"none"},depthStencil:{depthWriteEnabled:!0,depthCompare:"greater-equal",format:"depth32float"},fragment:{targets:[{format:"rgba32uint",blend:void 0}]}})}}var uM={selectionRenderEncoder:null,colorTexture:null,depthTexture:null};function Jh(t,e,r={}){Object.assign(e,uM,r),Xe.extend(t,e,r),w.get(t,e,["colorTexture","depthTexture"]),fM(t,e)}var lM=w.newInstance(Jh,"vtkWebGPUHardwareSelectionPass"),e0={newInstance:lM,extend:Jh};var{SelectionContent:pM,SelectionField:t0}=Tn,{FieldAssociations:r0}=yt,{vtkErrorMacro:n0}=w;function gM(t){return`${t.propID} ${t.compositeID}`}function Jo(t,e,r,n){let a=((r.height-e-1)*r.colorBufferWidth+t)*4+n;return r.colorValues[a]}function yn(t,e,r,n){let a=r<0?0:r;if(a===0){if(n[0]=e[0],n[1]=e[1],e[0]<0||e[0]>=t.width||e[1]<0||e[1]>=t.height)return null;let c=Jo(e[0],e[1],t,0);if(c<=0||c-1>=(t.props?.length??0))return null;let f={};f.propID=c-1,f.prop=t.props?.[f.propID];let u=Jo(e[0],e[1],t,1);(u<0||u>16777215)&&(u=0),f.compositeID=u-1;let g=Jo(e[0],e[1],t,2);if(g<1&&(g=u),f.attributeID=g-1,t.captureZValues){let l=(t.height-e[1]-1)*t.zbufferBufferWidth+e[0];f.zValue=t.depthValues[l],f.zValue=t.webGPURenderer.convertToOpenGLDepth(f.zValue),f.displayPosition=e}return f}let i=[e[0],e[1]],s=[0,0],o=yn(t,e,0,n);if(o)return o;for(let c=1;c<a;++c){for(let f=i[1]>c?i[1]-c:0;f<=i[1]+c;++f)if(s[1]=f,i[0]>=c&&(s[0]=i[0]-c,o=yn(t,s,0,n),o)||(s[0]=i[0]+c,o=yn(t,s,0,n),o))return o;for(let f=i[0]>=c?i[0]-(c-1):0;f<=i[0]+(c-1);++f)if(s[0]=f,i[1]>=c&&(s[1]=i[1]-c,o=yn(t,s,0,n),o)||(s[1]=i[1]+c,o=yn(t,s,0,n),o))return o}return n[0]=e[0],n[1]=e[1],null}function hM(t,e,r){let n=[],a=0;return e.forEach((i,s)=>{let o=Tn.newInstance();switch(o.setContentType(pM.INDICES),t){case r0.FIELD_ASSOCIATION_CELLS:o.setFieldType(t0.CELL);break;case r0.FIELD_ASSOCIATION_POINTS:o.setFieldType(t0.POINT);break;default:n0("Unknown field association")}o.getProperties().propID=i.info.propID,o.getProperties().prop=i.info.prop,o.getProperties().compositeID=i.info.compositeID,o.getProperties().attributeID=i.info.attributeID,o.getProperties().pixelCount=i.pixelCount,r.captureZValues&&(o.getProperties().displayPosition=[i.info.displayPosition[0],i.info.displayPosition[1],i.info.zValue],o.getProperties().worldPosition=r.webGPURenderWindow.displayToWorld(i.info.displayPosition[0],i.info.displayPosition[1],i.info.zValue,r.renderer)),o.setSelectionList(i.attributeIDs),n[a]=o,a++}),n}function vM(t,e,r,n,a){let i=Math.floor(e),s=Math.floor(r),o=Math.floor(n),c=Math.floor(a),f=new Map,u=[0,0];for(let g=s;g<=c;g++)for(let l=i;l<=o;l++){let h=yn(t,[l,g],0,u);if(h){let y=gM(h);if(!f.has(y))f.set(y,{info:h,pixelCount:1,attributeIDs:[h.attributeID]});else{let p=f.get(y);p.pixelCount++,t.captureZValues&&h.zValue<p.info.zValue&&(p.info=h),p.attributeIDs.indexOf(h.attributeID)===-1&&p.attributeIDs.push(h.attributeID)}}}return hM(t.fieldAssociation,f,t)}function dM(t,e){e.classHierarchy.push("vtkWebGPUHardwareSelector"),t.attach=(r,n)=>{e._WebGPURenderWindow=r,e._renderer=n},t.getPropIDForSelection=(r,n=null)=>{if(e._selectionPropMap.has(r))return e._selectionPropMap.get(r);let a=e._selectionProps.length;return e._selectionPropMap.set(r,a),e._selectionProps.push(n),a},t.endSelection=()=>{e.WebGPURenderer.setSelector(null)},t.getSourceDataAsync=async(r=e._renderer)=>{if(!r||!e._WebGPURenderWindow)return n0("Renderer and view must be set before calling Select."),!1;e._WebGPURenderWindow.getRenderable().preRender(),e._WebGPURenderWindow.getInitialized()||(e._WebGPURenderWindow.initialize(),await new Promise(y=>{e._WebGPURenderWindow.onInitialized(y)}));let n=e._WebGPURenderWindow.getViewNodeFor(r);if(!n)return!1;let a=n.getSuppressClear(),i=n.getSelector();e._selectionPropMap.clear(),e._selectionProps=[],n.setSuppressClear(!0),n.setSelector(t);try{e._selectionPass.traverse(e._WebGPURenderWindow,n)}finally{n.setSelector(i),n.setSuppressClear(a)}let s=e._WebGPURenderWindow.getDevice(),o=e._selectionPass.getColorTexture(),c=e._selectionPass.getDepthTexture(),f={area:[0,0,o.getWidth()-1,o.getHeight()-1],captureZValues:e.captureZValues,fieldAssociation:e.fieldAssociation,props:[...e._selectionProps],renderer:r,webGPURenderer:n,webGPURenderWindow:e._WebGPURenderWindow,width:o.getWidth(),height:o.getHeight()};f.colorBufferWidth=16*Math.floor((f.width+15)/16),f.colorBufferSizeInBytes=f.colorBufferWidth*f.height*4*4;let u=zt.newInstance({label:"hardwareSelectColorBuffer"});u.setDevice(s),u.create(f.colorBufferSizeInBytes,GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST);let g=e._WebGPURenderWindow.getCommandEncoder();g.copyTextureToBuffer({texture:o.getHandle()},{buffer:u.getHandle(),bytesPerRow:16*f.colorBufferWidth,rowsPerImage:f.height},{width:f.width,height:f.height,depthOrArrayLayers:1});let l;e.captureZValues&&(f.zbufferBufferWidth=64*Math.floor((f.width+63)/64),l=zt.newInstance({label:"hardwareSelectDepthBuffer"}),l.setDevice(s),f.zbufferSizeInBytes=f.height*f.zbufferBufferWidth*4,l.create(f.zbufferSizeInBytes,GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST),g.copyTextureToBuffer({texture:c.getHandle(),aspect:"depth-only"},{buffer:l.getHandle(),bytesPerRow:4*f.zbufferBufferWidth,rowsPerImage:f.height},{width:f.width,height:f.height,depthOrArrayLayers:1})),s.submitCommandEncoder(g);let h=u.mapAsync(GPUMapMode.READ);if(e.captureZValues){let y=l.mapAsync(GPUMapMode.READ);await Promise.all([h,y]),f.depthValues=new Float32Array(l.getMappedRange().slice()),l.unmap()}else await h;return f.colorValues=new Uint32Array(u.getMappedRange().slice()),u.unmap(),f.generateSelection=(y,p,m,d)=>vM(f,y,p,m,d),f}}var TM={_selectionPropMap:null,_selectionProps:null};function a0(t,e,r={}){Object.assign(e,TM,r),Wi.extend(t,e,r),e._selectionPass=e0.newInstance(),e._selectionPropMap=new Map,e._selectionProps=[],w.setGet(t,e,["_WebGPURenderWindow"]),w.moveToProtected(t,e,["WebGPURenderWindow"]),dM(t,e)}var mM=w.newInstance(a0,"vtkWebGPUHardwareSelector"),ec={newInstance:mM,extend:a0};var{vtkErrorMacro:Sn,vtkWarningMacro:yM}=w,i0=new WeakMap;function SM(t){let e=i0.get(t);return e||(e=Qh.newInstance(),e.initialize(t),i0.set(t,e)),e}var xM={position:"absolute",top:0,left:0,width:"100%",height:"100%"};function CM(t,e){e.classHierarchy.push("vtkWebGPURenderWindow"),t.getViewNodeFactory=()=>e.myFactory;function r(l,h=new Set){if(!l||h.has(l))return;h.add(l);let y=l.getChildren?.()||[];for(let p=0;p<y.length;p++){let m=y[p];m?.releaseGraphicsResources?.(),r(m,h)}}function n(){let l=t.onInitialized(()=>{l.unsubscribe(),e.deleted||t.traverseAllPasses()})}function a(l,h){if(e.deleted||h!==e.deviceGeneration||e.handlingDeviceLost)return;e.handlingDeviceLost=!0,e.deviceLostInfo=l;let y=l?.reason??"unknown",p=l?.message||"WebGPU device was lost.";yM(`WebGPU device lost (${y}): ${p}`),t.releaseGraphicsResources(),t.invokeDeviceLost({reason:y,message:p,recoverable:y!=="destroyed"}),y!=="destroyed"&&(n(),t.initialize()),e.handlingDeviceLost=!1}function i(l,h){e.deviceLostSubscription?.unsubscribe(),e.deviceLostSubscription=l.onDeviceLost(({info:y})=>{a(y,h)})}let s=[0,0];function o(){e.renderable&&(e.size[0]!==s[0]||e.size[1]!==s[1])&&(s[0]=e.size[0],s[1]=e.size[1],e.canvas.setAttribute("width",e.size[0]),e.canvas.setAttribute("height",e.size[1]),t.recreateSwapChain()),e.viewStream&&e.viewStream.setSize(e.size[0],e.size[1]),e.canvas.style.display=e.useOffScreen?"none":"block",e.el&&(e.el.style.cursor=e.cursorVisibility?e.cursor:"none"),e.containerSize=null}t.onModified(o),t.recreateSwapChain=()=>{e.context&&(e.context.unconfigure(),e.presentationFormat=navigator.gpu.getPreferredCanvasFormat(e.adapter),e.context.configure({device:e.device.getHandle(),format:e.presentationFormat,alphaMode:"premultiplied",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_DST,width:e.size[0],height:e.size[1]}),e._configured=!0)},t.getCurrentTexture=()=>e.context.getCurrentTexture(),t.buildPass=l=>{if(l){if(!e.renderable)return;t.prepareNodes(),t.addMissingNodes(e.renderable.getRenderersByReference()),t.removeUnusedNodes(),t.initialize()}else e.initialized&&(e._configured||t.recreateSwapChain(),e.commandEncoder=e.device.createCommandEncoder())},t.initialize=()=>{if(!e.initializing){if(e.initializing=!0,e.deviceLostInfo=null,!navigator.gpu){Sn("WebGPU is not enabled."),e.initializing=!1;return}t.create3DContextAsync().then(l=>{!l||e.deleted||(e.initialized=!0,t.invokeInitialized())}).catch(l=>{e.initialized=!1,Sn(`WebGPU initialization failed: ${l.message}`)}).finally(()=>{e.initializing=!1})}},t.setContainer=l=>{e.el&&e.el!==l&&(e.canvas.parentNode!==e.el&&Sn("Error: canvas parent node does not match container"),e.el.removeChild(e.canvas),e.el.contains(e.bgImage)&&e.el.removeChild(e.bgImage)),e.el!==l&&(e.el=l,e.el&&(e.el.appendChild(e.canvas),e.useBackgroundImage&&e.el.appendChild(e.bgImage)),t.modified())},t.getContainer=()=>e.el,t.getContainerSize=()=>{if(!e.containerSize&&e.el){let{width:l,height:h}=e.el.getBoundingClientRect();e.containerSize=[l,h]}return e.containerSize||e.size},t.getFramebufferSize=()=>e.size,t.create3DContextAsync=async()=>{if(!await e.webGPUConfiguration.initialize())throw new Error("Failed to create a WebGPU device.");return e.deleted?!1:(e.adapter=e.webGPUConfiguration.getAdapter(),e.device=SM(e.webGPUConfiguration.getDevice()),e.deviceGeneration+=1,i(e.device,e.deviceGeneration),e.context=e.canvas.getContext("webgpu"),!0)},t.setWebGPUConfiguration=l=>e.initialized||e.initializing?(Sn("setWebGPUConfiguration() must be called before WebGPU initialization."),!1):l!=null&&!l.isA?.("vtkWebGPUConfiguration")?(Sn("setWebGPUConfiguration() expects a vtkWebGPUConfiguration or null."),!1):l===e.webGPUConfiguration?!1:(e.ownsWebGPUConfiguration&&(e.webGPUConfiguration.finalize(),e.webGPUConfiguration.delete()),e.ownsWebGPUConfiguration=l==null,e.webGPUConfiguration=l??Qo.newInstance(),e.device=null,t.modified(),!0),t.releaseGraphicsResources=()=>{if(e.deviceLostSubscription?.unsubscribe(),e.deviceLostSubscription=null,e.renderPasses)for(let h=0;h<e.renderPasses.length;h++)e.renderPasses[h]?.releaseGraphicsResources?.();r(t);let l=Xe.newInstance();l.setCurrentOperation("Release"),l.traverse(t,null),e.context&&e.context.unconfigure(),e.adapter=null,e.ownsWebGPUConfiguration&&e.webGPUConfiguration.finalize(),e.device=null,e.context=null,e.commandEncoder=null,e._configured=!1,e.initialized=!1,e.initializing=!1},t.setBackgroundImage=l=>{e.bgImage.src=l.src},t.setUseBackgroundImage=l=>{e.useBackgroundImage=l,e.useBackgroundImage&&!e.el.contains(e.bgImage)?e.el.appendChild(e.bgImage):!e.useBackgroundImage&&e.el.contains(e.bgImage)&&e.el.removeChild(e.bgImage)};async function c(l=e.imageFormat){let h=document.createElement("canvas"),y=h.getContext("2d");h.width=e.canvas.width,h.height=e.canvas.height;let p=await t.getPixelsAsync(),m=new ImageData(p.colorValues,p.width,p.height);y.putImageData(m,0,0);let d=e.canvas.getBoundingClientRect();e.renderable.getRenderers().forEach(T=>{T.getViewProps().forEach(v=>{if(v.getContainer){let C=v.getContainer().getElementsByTagName("canvas");for(let O=0;O<C.length;O++){let M=C[O],S=M.getBoundingClientRect(),E=S.x-d.x,R=S.y-d.y;y.drawImage(M,E,R)}}})});let x=h.toDataURL(l);h.remove(),t.invokeImageReady(x)}t.captureNextImage=(l="image/png",{resetCamera:h=!1,size:y=null,scale:p=1}={})=>{if(e.deleted)return null;e.imageFormat=l;let m=e.notifyStartCaptureImage;return e.notifyStartCaptureImage=!0,e._screenshot={size:y||p!==1?y||e.size.map(d=>d*p):null},new Promise((d,x)=>{let T=t.onImageReady(v=>{if(e._screenshot.size===null)e.notifyStartCaptureImage=m,T.unsubscribe(),e._screenshot.placeHolder&&(e.size=e._screenshot.originalSize,t.modified(),e._screenshot.cameras&&e._screenshot.cameras.forEach(({restoreParamsFn:C,arg:O})=>C(O)),t.traverseAllPasses(),e.el.removeChild(e._screenshot.placeHolder),e._screenshot.placeHolder.remove(),e._screenshot=null),d(v);else{let C=document.createElement("img");if(C.style=xM,C.src=v,e._screenshot.placeHolder=e.el.appendChild(C),e.canvas.style.display="none",e._screenshot.originalSize=e.size,e.size=e._screenshot.size,e._screenshot.size=null,t.modified(),h){let O=h!==!0;e._screenshot.cameras=e.renderable.getRenderers().map(M=>{let S=M.getActiveCamera(),E=S.get("focalPoint","position","parallelScale");return{resetCameraArgs:O?{renderer:M}:void 0,resetCameraFn:O?h:M.resetCamera,restoreParamsFn:S.set,arg:JSON.parse(JSON.stringify(E))}}),e._screenshot.cameras.forEach(({resetCameraFn:M,resetCameraArgs:S})=>M(S))}t.traverseAllPasses()}})})},t.traverseAllPasses=()=>{if(!e.deleted)if(e.initialized){if(e.renderPasses)for(let l=0;l<e.renderPasses.length;++l)e.renderPasses[l].traverse(t,null);e.commandEncoder&&(e.device.submitCommandEncoder(e.commandEncoder),e.commandEncoder=null,e.notifyStartCaptureImage&&e.device.onSubmittedWorkDone().then(()=>{c()}))}else{t.initialize();let l=t.onInitialized(()=>{l.unsubscribe(),t.traverseAllPasses()})}},t.setViewStream=l=>{if(e.viewStream===l)return!1;if(e.subscription&&(e.subscription.unsubscribe(),e.subscription=null),e.viewStream=l,e.viewStream){let h=e.renderable.getRenderers()[0];h.getBackgroundByReference()[3]=0,t.setUseBackgroundImage(!0),e.subscription=e.viewStream.onImageReady(y=>t.setBackgroundImage(y.image)),e.viewStream.setSize(e.size[0],e.size[1]),e.viewStream.invalidateCache(),e.viewStream.render(),t.modified()}return!0},t.getUniquePropID=()=>e.nextPropID++,t.getPropFromID=l=>{for(let h=0;h<e.children.length;h++){let y=e.children[h].getPropFromID(l);if(y!==null)return y}return null},t.getPixelsAsync=async()=>{let l=e.device,h=e.renderPasses[0].getOpaquePass(),y=h.getResolveColorTexture()?h.getResolveColorTexture():h.getColorTexture(),p={width:y.getWidth(),height:y.getHeight()};p.colorBufferWidth=32*Math.floor((p.width+31)/32),p.colorBufferSizeInBytes=p.colorBufferWidth*p.height*8;let m=zt.newInstance();m.setDevice(l),m.create(p.colorBufferSizeInBytes,GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST);let d=e.device.createCommandEncoder();d.copyTextureToBuffer({texture:y.getHandle()},{buffer:m.getHandle(),bytesPerRow:8*p.colorBufferWidth,rowsPerImage:p.height},{width:p.width,height:p.height,depthOrArrayLayers:1}),l.submitCommandEncoder(d),await m.mapAsync(GPUMapMode.READ),p.colorValues=new Uint16Array(m.getMappedRange().slice()),m.unmap();let x=new Uint8ClampedArray(p.height*p.width*4);for(let T=0;T<p.height;T++)for(let v=0;v<p.width;v++){let C=(T*p.width+v)*4,O=(T*p.colorBufferWidth+v)*4;x[C]=255*Jt.fromHalf(p.colorValues[O]),x[C+1]=255*Jt.fromHalf(p.colorValues[O+1]),x[C+2]=255*Jt.fromHalf(p.colorValues[O+2]),x[C+3]=255*Jt.fromHalf(p.colorValues[O+3])}return p.colorValues=x,p},t.createSelector=()=>{let l=ec.newInstance();return l.setWebGPURenderWindow(t),l};let f=t.setSize;t.setSize=(...l)=>{let h=f(...l);return h&&t.invokeWindowResizeEvent({width:e.size[0],height:e.size[1]}),h};let u=t.setMultiSample;t.setMultiSample=l=>l!==1&&l!==4?(Sn(`Invalid multiSample value: ${l}. Supported values are 1 and 4. Ignoring.`),!1):u(l);function g(){e.ownsWebGPUConfiguration&&(e.webGPUConfiguration.finalize(),e.webGPUConfiguration.delete(),e.ownsWebGPUConfiguration=!1),e.webGPUConfiguration=null}t.delete=w.chain(t.delete,t.setViewStream,g)}var OM={initialized:!1,initializing:!1,handlingDeviceLost:!1,deviceGeneration:0,deviceLostInfo:null,deviceLostSubscription:null,context:null,adapter:null,webGPUConfiguration:null,ownsWebGPUConfiguration:!0,device:null,canvas:null,cursorVisibility:!0,cursor:"pointer",containerSize:null,renderPasses:[],notifyStartCaptureImage:!1,imageFormat:"image/png",useOffScreen:!1,useBackgroundImage:!1,nextPropID:1,xrSupported:!1,presentationFormat:null,multiSample:1};function wM(t,e,r={}){Object.assign(e,OM,r),e.device=null,e.ownsWebGPUConfiguration=e.webGPUConfiguration==null,e.webGPUConfiguration=e.webGPUConfiguration??Qo.newInstance(),e.canvas=document.createElement("canvas"),e.canvas.style.width="100%",e.bgImage=new Image,e.bgImage.style.position="absolute",e.bgImage.style.left="0",e.bgImage.style.top="0",e.bgImage.style.width="100%",e.bgImage.style.height="100%",e.bgImage.style.zIndex="-1",Ii.extend(t,e,r),e.myFactory=pp.newInstance(),e.renderPasses[0]=$h.newInstance(),e.selector||(e.selector=ec.newInstance(),e.selector.setWebGPURenderWindow(t)),w.event(t,e,"imageReady"),w.event(t,e,"initialized"),w.event(t,e,"deviceLost"),w.get(t,e,["commandEncoder","deviceLostInfo","device","webGPUConfiguration","presentationFormat","useBackgroundImage","xrSupported","multiSample"]),w.setGet(t,e,["initialized","context","canvas","renderPasses","notifyStartCaptureImage","cursor","useOffScreen","multiSample"]),w.setGetArray(t,e,["size"],2),w.event(t,e,"windowResizeEvent"),CM(t,e)}var s0=w.newInstance(wM,"vtkWebGPURenderWindow");ra("WebGPU",s0);Ke("vtkRenderWindow",s0);var RM=cg.extractURLParameters();function EM(t,e){let r=t.invokeResize;delete t.invokeResize,e.renderWindow=Qg.newInstance(),e.renderer=Yg.newInstance(),e.renderWindow.addRenderer(e.renderer),e._apiSpecificRenderWindow=e.renderWindow.newAPISpecificView(RM.viewAPI??e.defaultViewAPI),e.renderWindow.addView(e._apiSpecificRenderWindow),e.interactor=Vi.newInstance(),e.interactor.setInteractorStyle(bg.newInstance()),e.interactor.setView(e._apiSpecificRenderWindow),e.interactor.initialize(),t.setBackground=e.renderer.setBackground,t.setBackground(...e.background),t.resize=()=>{if(e.container){let n=e.container.getBoundingClientRect(),a=window.devicePixelRatio||1;e._apiSpecificRenderWindow.setSize(Math.floor(n.width*a),Math.floor(n.height*a)),r(),e.renderWindow.render()}},t.setContainer=n=>{e.container&&e.interactor.unbindEvents(e.container),e.container=n,e._apiSpecificRenderWindow.setContainer(e.container),e.container&&e.interactor.bindEvents(e.container)},t.delete=w.chain(t.setContainer,e._apiSpecificRenderWindow.delete,()=>{window.removeEventListener("resize",t.resize)},t.delete),e.listenWindowResize&&window.addEventListener("resize",t.resize),t.resize()}var MM={background:[.32,.34,.43],listenWindowResize:!0,container:null};function o0(t,e,r={}){Object.assign(e,MM,r),w.obj(t,e),w.get(t,e,["renderWindow","renderer","_apiSpecificRenderWindow","interactor","container"]),w.moveToProtected(t,e,["_apiSpecificRenderWindow"]),w.event(t,e,"resize"),EM(t,e)}var DM=w.newInstance(o0),VM={newInstance:DM,extend:o0};var{vtkErrorMacro:$i}=w;function LM(t,e){e.classHierarchy.push("vtkPiecewiseFunction"),t.getSize=()=>e.nodes.length,t.getType=()=>{let r,n=0,a=0;e.nodes.length>0&&(n=e.nodes[0].y);for(let i=1;i<e.nodes.length;i++){if(r=e.nodes[i].y,r!==n)if(r>n)switch(a){case 0:case 1:a=1;break;default:a=3}else switch(a){case 0:case 2:a=2;break;default:a=3}if(n=r,a===3)break}switch(a){case 0:return"Constant";case 1:return"NonDecreasing";case 2:return"NonIncreasing";default:return"Varied"}},t.getDataPointer=()=>{let r=e.nodes.length;if(e.function=null,r>0){e.function=[];for(let n=0;n<r;n++)e.function[2*n]=e.nodes[n].x,e.function[2*n+1]=e.nodes[n].y}return e.function},t.getFirstNonZeroValue=()=>{if(e.nodes.length===0)return 0;let r=1,n=0,a=0;for(;a<e.nodes.length;a++)if(e.nodes[a].y!==0){r=0;break}return r?n=Number.MAX_VALUE:a>0?n=e.nodes[a-1].x:e.clamping?n=-Number.MAX_VALUE:n=e.nodes[0].x,n},t.getNodeValue=(r,n)=>{let a=e.nodes.length;return r<0||r>=a?($i("Index out of range!"),-1):(n[0]=e.nodes[r].x,n[1]=e.nodes[r].y,n[2]=e.nodes[r].midpoint,n[3]=e.nodes[r].sharpness,1)},t.setNodeValue=(r,n)=>{let a=e.nodes.length;if(r<0||r>=a)return $i("Index out of range!"),-1;let i=e.nodes[r].x;return e.nodes[r].x=n[0],e.nodes[r].y=n[1],e.nodes[r].midpoint=n[2],e.nodes[r].sharpness=n[3],i!==n[0]?t.sortAndUpdateRange():t.modified(),1},t.addPoint=(r,n)=>t.addPointLong(r,n,.5,0),t.addPointLong=(r,n,a,i)=>{if(a<0||a>1)return $i("Midpoint outside range [0.0, 1.0]"),-1;if(i<0||i>1)return $i("Sharpness outside range [0.0, 1.0]"),-1;e.allowDuplicateScalars||t.removePoint(r);let s={x:r,y:n,midpoint:a,sharpness:i};e.nodes.push(s),t.sortAndUpdateRange();let o=0;for(;o<e.nodes.length&&e.nodes[o].x!==r;o++);return o<e.nodes.length?o:-1},t.setNodes=r=>{e.nodes!==r&&(e.nodes=r,t.sortAndUpdateRange())},t.sortAndUpdateRange=()=>{e.nodes.sort((r,n)=>r.x-n.x),t.updateRange()||t.modified()},t.updateRange=()=>{let r=e.range.slice(),n=e.nodes.length;return n?(e.range[0]=e.nodes[0].x,e.range[1]=e.nodes[n-1].x):(e.range[0]=0,e.range[1]=0),r[0]===e.range[0]&&r[1]===e.range[1]?!1:(t.modified(),!0)},t.removePoint=r=>{let n=0;for(;n<e.nodes.length&&e.nodes[n].x!==r;n++);if(n>=e.nodes.length)return-1;let a=n,i=!1;return e.nodes.splice(n,1),(n===0||n===e.nodes.length)&&(i=t.updateRange()),i||t.modified(),a},t.removeAllPoints=()=>{e.nodes=[],t.sortAndUpdateRange()},t.addSegment=(r,n,a,i)=>{t.sortAndUpdateRange();for(let s=0;s<e.nodes.length;)e.nodes[s].x>=r&&e.nodes[s].x<=a?e.nodes.splice(s,1):s++;t.addPoint(r,n,.5,0),t.addPoint(a,i,.5,0)},t.getValue=r=>{let n=[];return t.getTable(r,r,1,n),n[0]},t.findX=r=>{let{nodes:n}=e;for(let a=0;a<n.length-1;a++){let{x:i,y:s,sharpness:o}=n[a],{x:c,y:f}=n[a+1];if(r===s)return i;if(r===f&&o<=.99)return c;if(r>=Math.min(s,f)&&r<=Math.max(s,f)){let u=f>=s,g=i,l=c,h=.5*(g+l);for(;g<h&&h<l;){let y=t.getValue(h);(u?y<r:y>r)?g=h:l=h,h=.5*(g+l)}return l}}if(e.clamping&&n.length>0){let a=1/0,i=-1/0;n.forEach(c=>{a=Math.min(a,c.y),i=Math.max(i,c.y)});let s=n[0],o=n[n.length-1];if(r>=i)return s.y===i?s.x:o.y===i?o.x:null;if(r<=a)return s.y===a?s.x:o.y===a?o.x:null}return null},t.adjustRange=r=>{if(r.length<2)return 0;let n=t.getRange();n[0]<r[0]?t.addPoint(r[0],t.getValue(r[0])):t.addPoint(r[0],t.getValue(n[0])),n[1]>r[1]?t.addPoint(r[1],t.getValue(r[1])):t.addPoint(r[1],t.getValue(n[1])),t.sortAndUpdateRange();for(let a=0;a<e.nodes.length;)e.nodes[a].x>=r[0]&&e.nodes[a].x<=r[1]?e.nodes.splice(a,1):++a;return t.sortAndUpdateRange(),1},t.estimateMinNumberOfSamples=(r,n)=>{let a=t.findMinimumXDistance();return Math.ceil((n-r)/a)},t.findMinimumXDistance=()=>{let r=e.nodes.length;if(r<2)return-1;let n=e.nodes[1].x-e.nodes[0].x;for(let a=0;a<r-1;a++){let i=e.nodes[a+1].x-e.nodes[a].x;i<n&&(n=i)}return n},t.getTable=(r,n,a,i,s=1)=>{let o,c=0,f=e.nodes.length,u=0;f!==0&&(u=e.nodes[f-1].y);let g=0,l=0,h=0,y=0,p=0,m=0,d=0;for(o=0;o<a;o++){let x=s*o;for(a>1?g=r+o/(a-1)*(n-r):g=.5*(r+n);c<f&&g>e.nodes[c].x;)c++,c<f&&(l=e.nodes[c-1].x,h=e.nodes[c].x,y=e.nodes[c-1].y,p=e.nodes[c].y,m=e.nodes[c-1].midpoint,d=e.nodes[c-1].sharpness,m<1e-5&&(m=1e-5),m>.99999&&(m=.99999));if(c>=f)i[x]=e.clamping?u:0;else if(c===0)i[x]=e.clamping?e.nodes[0].y:0;else{let T=(g-l)/(h-l);if(T<m?T=.5*T/m:T=.5+.5*(T-m)/(1-m),d>.99)if(T<.5){i[x]=y;continue}else{i[x]=p;continue}if(d<.01){i[x]=(1-T)*y+T*p;continue}T<.5?T=.5*(T*2)**(1+10*d):T>.5&&(T=1-.5*((1-T)*2)**(1+10*d));let v=T*T,C=v*T,O=2*C-3*v+1,M=-2*C+3*v,S=C-2*v+T,E=C-v,R=p-y,D=(1-d)*R;i[x]=O*y+M*p+S*D+E*D;let V=y<p?y:p,U=y>p?y:p;i[x]=i[x]<V?V:i[x],i[x]=i[x]>U?U:i[x]}}}}var _M={range:[0,0],clamping:!0,allowDuplicateScalars:!1};function c0(t,e,r={}){Object.assign(e,_M,r),w.obj(t,e),e.nodes=[],w.setGet(t,e,["allowDuplicateScalars","clamping"]),w.setArray(t,e,["range"],2),w.getArray(t,e,["range"]),LM(t,e)}var BM=w.newInstance(c0,"vtkPiecewiseFunction"),xn={newInstance:BM,extend:c0};var FM={RGB:0,HSV:1,LAB:2,DIVERGING:3},UM={LINEAR:0,LOG10:1},tc={ColorSpace:FM,Scale:UM};var{ColorSpace:Et,Scale:rc}=tc,{ScalarMappingTarget:Ai}=Zn,{vtkDebugMacro:NM,vtkErrorMacro:ir,vtkWarningMacro:GM}=w;function f0(t,e){let r=t[0],n=t[1],a=t[2],i=Math.sqrt(r*r+n*n+a*a),s=i>.001?Math.acos(r/i):0,o=s>.001?Math.atan2(a,n):0;e[0]=i,e[1]=s,e[2]=o}function kM(t,e){let r=t[0],n=t[1],a=t[2];e[0]=r*Math.cos(n),e[1]=r*Math.sin(n)*Math.cos(a),e[2]=r*Math.sin(n)*Math.sin(a)}function u0(t,e){if(t[0]>=e-.1)return t[2];let r=t[1]*Math.sqrt(e*e-t[0]*t[0])/(t[0]*Math.sin(t[1]));return t[2]>-.3*Math.PI?t[2]+r:t[2]-r}function bM(t,e){let r=t-e;for(r<0&&(r=-r);r>=2*Math.PI;)r-=2*Math.PI;return r>Math.PI&&(r=2*Math.PI-r),r}function l0(t,e,r,n){let a=[],i=[];fr(e,a),fr(r,i);let s=[],o=[];f0(a,s),f0(i,o);let c=t;if(s[1]>.05&&o[1]>.05&&bM(s[2],o[2])>.33*Math.PI){let g=Math.max(s[0],o[0]);g=Math.max(88,g),t<.5?(o[0]=g,o[1]=0,o[2]=0,c*=2):(s[0]=g,s[1]=0,s[2]=0,c=2*c-1)}s[1]<.05&&o[1]>.05?s[2]=u0(o,s[0]):o[1]<.05&&s[1]>.05&&(o[2]=u0(s,o[0]));let f=[];f[0]=(1-c)*s[0]+c*o[0],f[1]=(1-c)*s[1]+c*o[1],f[2]=(1-c)*s[2]+c*o[2];let u=[];kM(f,u),Bn(u,n)}function zM(t,e){e.classHierarchy.push("vtkColorTransferFunction"),t.getSize=()=>e.nodes.length,t.addRGBPoint=(r,n,a,i)=>t.addRGBPointLong(r,n,a,i,.5,0),t.addRGBPointLong=(r,n,a,i,s=.5,o=0)=>{if(s<0||s>1)return ir("Midpoint outside range [0.0, 1.0]"),-1;if(o<0||o>1)return ir("Sharpness outside range [0.0, 1.0]"),-1;e.allowDuplicateScalars||t.removePoint(r);let c={x:r,r:n,g:a,b:i,midpoint:s,sharpness:o};e.nodes.push(c),t.sortAndUpdateRange();let f=0;for(;f<e.nodes.length&&e.nodes[f].x!==r;f++);return f<e.nodes.length?f:-1},t.addHSVPoint=(r,n,a,i)=>t.addHSVPointLong(r,n,a,i,.5,0),t.addHSVPointLong=(r,n,a,i,s=.5,o=0)=>{let c=[];return Qt([n,a,i],c),t.addRGBPoint(r,c[0],c[1],c[2],s,o)},t.setNodes=r=>{if(e.nodes!==r){let n=JSON.stringify(e.nodes);e.nodes=r;let a=JSON.stringify(e.nodes);if(t.sortAndUpdateRange()||n!==a)return t.modified(),!0}return!1},t.sortAndUpdateRange=()=>{let r=JSON.stringify(e.nodes);e.nodes.sort((i,s)=>i.x-s.x);let n=JSON.stringify(e.nodes),a=t.updateRange();return!a&&r!==n?(t.modified(),!0):a},t.updateRange=()=>{let r=[2];r[0]=e.mappingRange[0],r[1]=e.mappingRange[1];let n=e.nodes.length;return n?(e.mappingRange[0]=e.nodes[0].x,e.mappingRange[1]=e.nodes[n-1].x):(e.mappingRange[0]=0,e.mappingRange[1]=0),r[0]===e.mappingRange[0]&&r[1]===e.mappingRange[1]?!1:(t.modified(),!0)},t.removePoint=r=>{let n=0;for(;n<e.nodes.length&&e.nodes[n].x!==r;n++);let a=n;if(n>=e.nodes.length)return-1;let i=!1;return e.nodes.splice(n,1),(n===0||n===e.nodes.length)&&(i=t.updateRange()),i||t.modified(),a},t.movePoint=(r,n)=>{if(r!==n){t.removePoint(n);for(let a=0;a<e.nodes.length;a++)if(e.nodes[a].x===r){e.nodes[a].x=n,t.sortAndUpdateRange();break}}},t.removeAllPoints=()=>{e.nodes=[],t.sortAndUpdateRange()},t.addRGBSegment=(r,n,a,i,s,o,c,f)=>{t.sortAndUpdateRange();for(let u=0;u<e.nodes.length;)e.nodes[u].x>=r&&e.nodes[u].x<=s?e.nodes.splice(u,1):u++;t.addRGBPointLong(r,n,a,i,.5,0),t.addRGBPointLong(s,o,c,f,.5,0),t.modified()},t.addHSVSegment=(r,n,a,i,s,o,c,f)=>{let u=[n,a,i],g=[o,c,f],l=[],h=[];Qt(u,l),Qt(g,h),t.addRGBSegment(r,l[0],l[1],l[2],s,h[0],h[1],h[2])},t.mapValue=r=>{let n=[];return t.getColor(r,n),[Math.floor(255*n[0]+.5),Math.floor(255*n[1]+.5),Math.floor(255*n[2]+.5),255]},t.getColor=(r,n)=>{if(e.indexedLookup){let a=t.getSize(),i=t.getAnnotatedValueIndexInternal(r);if(i<0||a===0){let s=t.getNanColorByReference();n[0]=s[0],n[1]=s[1],n[2]=s[2]}else{let s=[];t.getNodeValue(i%a,s),n[0]=s[1],n[1]=s[2],n[2]=s[3]}return}t.getTable(r,r,1,n)},t.getRedValue=r=>{let n=[];return t.getColor(r,n),n[0]},t.getGreenValue=r=>{let n=[];return t.getColor(r,n),n[1]},t.getBlueValue=r=>{let n=[];return t.getColor(r,n),n[2]},t.logScaleEnabled=()=>e.scale===rc.LOG10,t.usingLogScale=()=>t.logScaleEnabled()&&e.mappingRange[0]>0,t.getTable=(r,n,a,i)=>{let s=t.usingLogScale(),o=s?Math.log10(Number(r)):Number(r),c=s?Math.log10(Number(n)):Number(n);if(Lr(o)||Lr(c)){for(let M=0;M<a;M++)i[M*3+0]=e.nanColor[0],i[M*3+1]=e.nanColor[1],i[M*3+2]=e.nanColor[2];return}let f=0,u=e.nodes.length,g=0,l=0,h=0;u!==0&&(g=e.nodes[u-1].r,l=e.nodes[u-1].g,h=e.nodes[u-1].b);let y=0,p=0,m=0,d=[0,0,0],x=[0,0,0],T=0,v=0,C=[],O=e.mappingRange;s&&(O=[Math.log10(e.mappingRange[0]),Math.log10(e.mappingRange[1])]);for(let M=0;M<a;M++){let S=3*M;if(a>1?y=o+M/(a-1)*(c-o):y=.5*(o+c),e.discretize){let E=O;if(y>=E[0]&&y<=E[1]){let R=e.numberOfValues,D=E[1]-E[0];if(R<=1)y=E[0]+D/2;else{let V=(y-E[0])/D,U=Vn(R*V);y=E[0]+U/(R-1)*D}}}for(;f<u&&y>e.nodes[f].x;)f++,f<u&&(p=e.nodes[f-1].x,m=e.nodes[f].x,d[0]=e.nodes[f-1].r,x[0]=e.nodes[f].r,d[1]=e.nodes[f-1].g,x[1]=e.nodes[f].g,d[2]=e.nodes[f-1].b,x[2]=e.nodes[f].b,T=e.nodes[f-1].midpoint,v=e.nodes[f-1].sharpness,T<1e-5&&(T=1e-5),T>.99999&&(T=.99999));if(y>O[1])i[S]=0,i[S+1]=0,i[S+2]=0,e.clamping&&(t.getUseAboveRangeColor()?(i[S]=e.aboveRangeColor[0],i[S+1]=e.aboveRangeColor[1],i[S+2]=e.aboveRangeColor[2]):(i[S]=g,i[S+1]=l,i[S+2]=h));else if(y<O[0]||Bs(y)&&y<0)i[S]=0,i[S+1]=0,i[S+2]=0,e.clamping&&(t.getUseBelowRangeColor()?(i[S]=e.belowRangeColor[0],i[S+1]=e.belowRangeColor[1],i[S+2]=e.belowRangeColor[2]):u>0&&(i[S]=e.nodes[0].r,i[S+1]=e.nodes[0].g,i[S+2]=e.nodes[0].b));else if(f===0&&(Math.abs(y-o)<1e-6||e.discretize))u>0?(i[S]=e.nodes[0].r,i[S+1]=e.nodes[0].g,i[S+2]=e.nodes[0].b):(i[S]=0,i[S+1]=0,i[S+2]=0);else{let E=0;if(E=(y-p)/(m-p),E<T?E=.5*E/T:E=.5+.5*(E-T)/(1-T),v>.99)if(E<.5){i[S]=d[0],i[S+1]=d[1],i[S+2]=d[2];continue}else{i[S]=x[0],i[S+1]=x[1],i[S+2]=x[2];continue}if(v<.01){if(e.colorSpace===Et.RGB)i[S]=(1-E)*d[0]+E*x[0],i[S+1]=(1-E)*d[1]+E*x[1],i[S+2]=(1-E)*d[2]+E*x[2];else if(e.colorSpace===Et.HSV){let F=[],G=[];Qr(d,F),Qr(x,G),e.hSVWrap&&(F[0]-G[0]>.5||G[0]-F[0]>.5)&&(F[0]>G[0]?F[0]-=1:G[0]-=1);let b=[];b[0]=(1-E)*F[0]+E*G[0],b[0]<0&&(b[0]+=1),b[1]=(1-E)*F[1]+E*G[1],b[2]=(1-E)*F[2]+E*G[2],Qt(b,C),i[S]=C[0],i[S+1]=C[1],i[S+2]=C[2]}else if(e.colorSpace===Et.LAB){let F=[],G=[];fr(d,F),fr(x,G);let b=[];b[0]=(1-E)*F[0]+E*G[0],b[1]=(1-E)*F[1]+E*G[1],b[2]=(1-E)*F[2]+E*G[2],Bn(b,C),i[S]=C[0],i[S+1]=C[1],i[S+2]=C[2]}else e.colorSpace===Et.DIVERGING?(l0(E,d,x,C),i[S]=C[0],i[S+1]=C[1],i[S+2]=C[2]):ir("ColorSpace set to invalid value.",e.colorSpace);continue}E<.5?E=.5*(E*2)**(1+10*v):E>.5&&(E=1-.5*((1-E)*2)**(1+10*v));let R=E*E,D=R*E,V=2*D-3*R+1,U=-2*D+3*R,B=D-2*R+E,_=D-R,N,k;if(e.colorSpace===Et.RGB)for(let F=0;F<3;F++)N=x[F]-d[F],k=(1-v)*N,i[S+F]=V*d[F]+U*x[F]+B*k+_*k;else if(e.colorSpace===Et.HSV){let F=[],G=[];Qr(d,F),Qr(x,G),e.hSVWrap&&(F[0]-G[0]>.5||G[0]-F[0]>.5)&&(F[0]>G[0]?F[0]-=1:G[0]-=1);let b=[];for(let z=0;z<3;z++)N=G[z]-F[z],k=(1-v)*N,b[z]=V*F[z]+U*G[z]+B*k+_*k,z===0&&b[z]<0&&(b[z]+=1);Qt(b,C),i[S]=C[0],i[S+1]=C[1],i[S+2]=C[2]}else if(e.colorSpace===Et.LAB){let F=[],G=[];fr(d,F),fr(x,G);let b=[];for(let z=0;z<3;z++)N=G[z]-F[z],k=(1-v)*N,b[z]=V*F[z]+U*G[z]+B*k+_*k;Bn(b,C),i[S]=C[0],i[S+1]=C[1],i[S+2]=C[2]}else e.colorSpace===Et.DIVERGING?(l0(E,d,x,C),i[S]=C[0],i[S+1]=C[1],i[S+2]=C[2]):ir("ColorSpace set to invalid value.");for(let F=0;F<3;F++)i[S+F]=i[S+F]<0?0:i[S+F],i[S+F]=i[S+F]>1?1:i[S+F]}}},t.getUint8Table=(r,n,a,i=!1)=>{if(t.getMTime()<=e.buildTime&&e.tableSize===a&&e.tableWithAlpha!==i)return e.table;if(e.nodes.length===0)return ir("Attempting to lookup a value with no points in the function"),e.table;let s=i?4:3;(e.tableSize!==a||e.tableWithAlpha!==i)&&(e.table=new Uint8Array(a*s),e.tableSize=a,e.tableWithAlpha=i);let o=[];t.getTable(r,n,a,o);for(let c=0;c<a;c++)e.table[c*s+0]=Math.floor(o[c*3+0]*255+.5),e.table[c*s+1]=Math.floor(o[c*3+1]*255+.5),e.table[c*s+2]=Math.floor(o[c*3+2]*255+.5),i&&(e.table[c*s+3]=255);return e.buildTime.modified(),e.table},t.buildFunctionFromArray=r=>{t.removeAllPoints();let n=r.getNumberOfComponents();for(let a=0;a<r.getNumberOfTuples();a++)switch(n){case 3:e.nodes.push({x:a,r:r.getComponent(a,0),g:r.getComponent(a,1),b:r.getComponent(a,2),midpoint:.5,sharpness:0});break;case 4:e.nodes.push({x:r.getComponent(a,0),r:r.getComponent(a,1),g:r.getComponent(a,2),b:r.getComponent(a,3),midpoint:.5,sharpness:0});break;case 5:e.nodes.push({x:a,r:r.getComponent(a,0),g:r.getComponent(a,1),b:r.getComponent(a,2),midpoint:r.getComponent(a,4),sharpness:r.getComponent(a,5)});break;case 6:e.nodes.push({x:r.getComponent(a,0),r:r.getComponent(a,1),g:r.getComponent(a,2),b:r.getComponent(a,3),midpoint:r.getComponent(a,4),sharpness:r.getComponent(a,5)})}t.sortAndUpdateRange()},t.buildFunctionFromTable=(r,n,a,i)=>{let s=0;t.removeAllPoints(),a>1&&(s=(n-r)/(a-1));for(let o=0;o<a;o++){let c={x:r+s*o,r:i[o*3],g:i[o*3+1],b:i[o*3+2],sharpness:0,midpoint:.5};e.nodes.push(c)}t.sortAndUpdateRange()},t.getNodeValue=(r,n)=>r<0||r>=e.nodes.length?(ir("Index out of range!"),-1):(n[0]=e.nodes[r].x,n[1]=e.nodes[r].r,n[2]=e.nodes[r].g,n[3]=e.nodes[r].b,n[4]=e.nodes[r].midpoint,n[5]=e.nodes[r].sharpness,1),t.setNodeValue=(r,n)=>{if(r<0||r>=e.nodes.length)return ir("Index out of range!"),-1;let a=e.nodes[r].x;return e.nodes[r].x=n[0],e.nodes[r].r=n[1],e.nodes[r].g=n[2],e.nodes[r].b=n[3],e.nodes[r].midpoint=n[4],e.nodes[r].sharpness=n[5],a!==n[0]?t.sortAndUpdateRange():t.modified(),1},t.getNumberOfAvailableColors=()=>{if(e.indexedLookup&&t.getSize())return t.getSize();if(e.tableSize)return e.tableSize;let r=e.nodes?.length??0;return Math.max(4094,r)},t.getIndexedColor=(r,n)=>{let a=t.getSize();if(a>0&&r>=0){let s=[];t.getNodeValue(r%a,s);for(let o=0;o<3;++o)n[o]=s[o+1];n[3]=1;return}let i=t.getNanColorByReference();n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=1},t.fillFromDataPointer=(r,n)=>{if(!(r<=0||!n)){t.removeAllPoints();for(let a=0;a<r;a++)t.addRGBPoint(n[a*4],n[a*4+1],n[a*4+2],n[a*4+3])}},t.setMappingRange=(r,n)=>{let a=[r,n],i=[r,n],s=t.getRange(),o=t.logScaleEnabled();if(s[1]===a[1]&&s[0]===a[0])return;if(a[1]===a[0]){ir("attempt to set zero width color range");return}o&&(a[0]<=0?console.warn("attempt to set log scale color range with non-positive minimum"):(i[0]=Math.log10(a[0]),i[1]=Math.log10(a[1])));let c=(i[1]-i[0])/(s[1]-s[0]),f=i[0]-s[0]*c;for(let u=0;u<e.nodes.length;++u)e.nodes[u].x=e.nodes[u].x*c+f;e.mappingRange[0]=a[0],e.mappingRange[1]=a[1],t.modified()},t.adjustRange=r=>{let n=t.getRange(),a=[];n[0]<r[0]?(t.getColor(r[0],a),t.addRGBPoint(r[0],a[0],a[1],a[2])):(t.getColor(n[0],a),t.addRGBPoint(r[0],a[0],a[1],a[2])),n[1]>r[1]?(t.getColor(r[1],a),t.addRGBPoint(r[1],a[0],a[1],a[2])):(t.getColor(n[1],a),t.addRGBPoint(r[1],a[0],a[1],a[2])),t.sortAndUpdateRange();for(let i=0;i<e.nodes.length;)e.nodes[i].x>=r[0]&&e.nodes[i].x<=r[1]?e.nodes.splice(i,1):++i;return 1},t.estimateMinNumberOfSamples=(r,n)=>{let a=t.findMinimumXDistance();return Math.ceil((n-r)/a)},t.findMinimumXDistance=()=>{if(e.nodes.length<2)return-1;let r=Number.MAX_VALUE;for(let n=0;n<e.nodes.length-1;n++){let a=e.nodes[n+1].x-e.nodes[n].x;a<r&&(r=a)}return r},t.mapScalarsThroughTable=(r,n,a,i)=>{if(t.getSize()===0){NM("Transfer Function Has No Points!");return}e.indexedLookup?t.mapDataIndexed(r,n,a,i):t.mapData(r,n,a,i)},t.mapData=(r,n,a,i)=>{if(t.getSize()===0){GM("Transfer Function Has No Points!");return}let s=Math.floor(t.getAlpha()*255+.5),o=r.getNumberOfTuples(),c=r.getNumberOfComponents(),f=n.getData(),u=r.getData(),g=[];if(a===Ai.RGBA)for(let l=0;l<o;l++){let h=u[l*c+i];t.getColor(h,g),f[l*4]=Math.floor(g[0]*255+.5),f[l*4+1]=Math.floor(g[1]*255+.5),f[l*4+2]=Math.floor(g[2]*255+.5),f[l*4+3]=s}if(a===Ai.RGB)for(let l=0;l<o;l++){let h=u[l*c+i];t.getColor(h,g),f[l*3]=Math.floor(g[0]*255+.5),f[l*3+1]=Math.floor(g[1]*255+.5),f[l*3+2]=Math.floor(g[2]*255+.5)}if(a===Ai.LUMINANCE)for(let l=0;l<o;l++){let h=u[l*c+i];t.getColor(h,g),f[l]=Math.floor(g[0]*76.5+g[1]*150.45+g[2]*28.05+.5)}if(a===Ai.LUMINANCE_ALPHA)for(let l=0;l<o;l++){let h=u[l*c+i];t.getColor(h,g),f[l*2]=Math.floor(g[0]*76.5+g[1]*150.45+g[2]*28.05+.5),f[l*2+1]=s}},t.applyColorMap=r=>{let n=JSON.stringify(e.colorSpace);r.ColorSpace&&(e.colorSpace=Et[r.ColorSpace.toUpperCase()],e.colorSpace===void 0&&(ir(`ColorSpace ${r.ColorSpace} not supported, using RGB instead`),e.colorSpace=Et.RGB));let a=n!==JSON.stringify(e.colorSpace),i=a||JSON.stringify(e.nanColor);if(r.NanColor)for(e.nanColor=[].concat(r.NanColor);e.nanColor.length<4;)e.nanColor.push(1);a=a||i!==JSON.stringify(e.nanColor);let s=a||JSON.stringify(e.nodes);if(r.RGBPoints){let f=r.RGBPoints.length;e.nodes=[];let u=.5,g=0;for(let l=0;l<f;l+=4)e.nodes.push({x:r.RGBPoints[l],r:r.RGBPoints[l+1],g:r.RGBPoints[l+2],b:r.RGBPoints[l+3],midpoint:u,sharpness:g})}let o=t.sortAndUpdateRange(),c=!o&&(a||s!==JSON.stringify(e.nodes));return c&&t.modified(),o||c},t.getDataPointer=()=>e.nodes}var WM={clamping:!0,colorSpace:Et.RGB,hSVWrap:!0,scale:rc.LINEAR,nanColor:null,belowRangeColor:null,aboveRangeColor:null,useAboveRangeColor:!1,useBelowRangeColor:!1,allowDuplicateScalars:!1,table:null,tableSize:0,buildTime:null,nodes:null,discretize:!1,numberOfValues:256};function p0(t,e,r={}){Object.assign(e,WM,r),Zn.extend(t,e,r),e.table=[],e.nodes=[],e.nanColor=[.5,0,0,1],e.belowRangeColor=[0,0,0,1],e.aboveRangeColor=[1,1,1,1],e.buildTime={},w.obj(e.buildTime),w.get(t,e,["buildTime","mappingRange"]),w.setGet(t,e,["useAboveRangeColor","useBelowRangeColor","discretize","numberOfValues",{type:"enum",name:"colorSpace",enum:Et},{type:"enum",name:"scale",enum:rc}]),w.setArray(t,e,["nanColor","belowRangeColor","aboveRangeColor"],4),w.getArray(t,e,["nanColor","belowRangeColor","aboveRangeColor"]),zM(t,e)}var IM=w.newInstance(p0,"vtkColorTransferFunction"),nc={newInstance:IM,extend:p0,...tc};var{InterpolationType:oa,OpacityMode:HM,FilterMode:ca,ColorMixPreset:jM}=go,{vtkErrorMacro:ac}=w,Ki=4;function PM(t,e){e.classHierarchy.push("vtkVolumeProperty");let r={...t};t.getMTime=()=>{let n=e.mtime,a;for(let i=0;i<Ki;i++)e.componentData[i].colorChannels===1?e.componentData[i].grayTransferFunction&&(a=e.componentData[i].grayTransferFunction.getMTime(),n=n>a?n:a):e.componentData[i].colorChannels===3&&e.componentData[i].rGBTransferFunction&&(a=e.componentData[i].rGBTransferFunction.getMTime(),n=n>a?n:a),e.componentData[i].scalarOpacity&&(a=e.componentData[i].scalarOpacity.getMTime(),n=n>a?n:a),e.componentData[i].gradientOpacity&&(e.componentData[i].disableGradientOpacity||(a=e.componentData[i].gradientOpacity.getMTime(),n=n>a?n:a));return n},t.getColorChannels=n=>n<0||n>3?(ac("Bad index - must be between 0 and 3"),0):e.componentData[n].colorChannels,t.getUseIndependentComponents=n=>e.independentComponents&&n>=2||!!e.colorMixPreset,t.setGrayTransferFunction=(n=0,a=null)=>{let i=!1;return e.componentData[n].grayTransferFunction!==a&&(e.componentData[n].grayTransferFunction=a,i=!0),e.componentData[n].colorChannels!==1&&(e.componentData[n].colorChannels=1,i=!0),i&&t.modified(),i},t.getGrayTransferFunction=(n=0)=>(e.componentData[n].grayTransferFunction===null&&(e.componentData[n].grayTransferFunction=xn.newInstance(),e.componentData[n].grayTransferFunction.addPoint(0,0),e.componentData[n].grayTransferFunction.addPoint(1024,1),e.componentData[n].colorChannels!==1&&(e.componentData[n].colorChannels=1),t.modified()),e.componentData[n].grayTransferFunction),t.setRGBTransferFunction=(n=0,a=null)=>{let i=!1;return e.componentData[n].rGBTransferFunction!==a&&(e.componentData[n].rGBTransferFunction=a,i=!0),e.componentData[n].colorChannels!==3&&(e.componentData[n].colorChannels=3,i=!0),i&&t.modified(),i},t.getRGBTransferFunction=(n=0)=>(e.componentData[n].rGBTransferFunction===null&&(e.componentData[n].rGBTransferFunction=nc.newInstance(),e.componentData[n].rGBTransferFunction.addRGBPoint(0,0,0,0),e.componentData[n].rGBTransferFunction.addRGBPoint(1024,1,1,1),e.componentData[n].colorChannels!==3&&(e.componentData[n].colorChannels=3),t.modified()),e.componentData[n].rGBTransferFunction),t.setScalarOpacity=(n=0,a=null)=>e.componentData[n].scalarOpacity!==a?(e.componentData[n].scalarOpacity=a,t.modified(),!0):!1,t.getScalarOpacity=(n=0)=>(e.componentData[n].scalarOpacity===null&&(e.componentData[n].scalarOpacity=xn.newInstance(),e.componentData[n].scalarOpacity.addPoint(0,1),e.componentData[n].scalarOpacity.addPoint(1024,1),t.modified()),e.componentData[n].scalarOpacity),t.setComponentWeight=(n=0,a=1)=>{if(n<0||n>=Ki)return ac("Invalid index"),!1;let i=Math.min(1,Math.max(0,a));return e.componentData[n].componentWeight!==i?(e.componentData[n].componentWeight=i,t.modified(),!0):!1},t.getComponentWeight=(n=0)=>n<0||n>=Ki?(ac("Invalid index"),0):e.componentData[n].componentWeight,t.setInterpolationTypeToNearest=()=>t.setInterpolationType(oa.NEAREST),t.setInterpolationTypeToLinear=()=>t.setInterpolationType(oa.LINEAR),t.setInterpolationTypeToFastLinear=()=>t.setInterpolationType(oa.FAST_LINEAR),t.getInterpolationTypeAsString=()=>w.enumToString(oa,e.interpolationType),["useGradientOpacity","scalarOpacityUnitDistance","gradientOpacityMinimumValue","gradientOpacityMinimumOpacity","gradientOpacityMaximumValue","gradientOpacityMaximumOpacity","opacityMode","forceNearestInterpolation"].forEach(n=>{let a=w.capitalize(n);t[`set${a}`]=(i,s)=>e.componentData[i][`${n}`]!==s?(e.componentData[i][`${n}`]=s,t.modified(),!0):!1}),["useGradientOpacity","scalarOpacityUnitDistance","gradientOpacityMinimumValue","gradientOpacityMinimumOpacity","gradientOpacityMaximumValue","gradientOpacityMaximumOpacity","opacityMode","forceNearestInterpolation"].forEach(n=>{let a=w.capitalize(n);t[`get${a}`]=i=>e.componentData[i][`${n}`]}),t.getFilterModeAsString=()=>w.enumToString(ca,e.filterMode),t.setFilterModeToOff=()=>{t.setFilterMode(ca.OFF)},t.setFilterModeToNormalized=()=>{t.setFilterMode(ca.NORMALIZED)},t.setFilterModeToRaw=()=>{t.setFilterMode(ca.RAW)},t.setGlobalIlluminationReach=n=>r.setGlobalIlluminationReach(Yt(n,0,1)),t.setVolumetricScatteringBlending=n=>r.setVolumetricScatteringBlending(Yt(n,0,1)),t.setAnisotropy=n=>r.setAnisotropy(Yt(n,-.99,.99)),t.setLAOKernelSize=n=>r.setLAOKernelSize(Vn(Yt(n,1,32))),t.setLAOKernelRadius=n=>r.setLAOKernelRadius(n>=1?n:1)}var $M=t=>({colorMixPreset:jM.DEFAULT,independentComponents:!0,interpolationType:oa.FAST_LINEAR,shade:!1,ambient:.1,diffuse:.7,specular:.2,specularPower:10,useLabelOutline:!1,labelOutlineThickness:[1],labelOutlineOpacity:1,ipScalarRange:[-1e6,1e6],filterMode:ca.OFF,preferSizeOverAccuracy:!1,computeNormalFromOpacity:!1,volumetricScatteringBlending:0,globalIlluminationReach:0,anisotropy:0,localAmbientOcclusion:!1,LAOKernelSize:15,LAOKernelRadius:7,updatedExtents:[],...t});function g0(t,e,r={}){if(Object.assign(e,$M(r)),w.obj(t,e),!e.componentData){e.componentData=[];for(let n=0;n<Ki;++n)e.componentData.push({colorChannels:1,grayTransferFunction:null,rGBTransferFunction:null,scalarOpacity:null,scalarOpacityUnitDistance:1,opacityMode:HM.FRACTIONAL,gradientOpacityMinimumValue:0,gradientOpacityMinimumOpacity:0,gradientOpacityMaximumValue:1,gradientOpacityMaximumOpacity:1,useGradientOpacity:!1,componentWeight:1,forceNearestInterpolation:!1})}w.setGet(t,e,["colorMixPreset","independentComponents","interpolationType","shade","ambient","diffuse","specular","specularPower","useLabelOutline","labelOutlineOpacity","filterMode","preferSizeOverAccuracy","computeNormalFromOpacity","volumetricScatteringBlending","globalIlluminationReach","anisotropy","localAmbientOcclusion","LAOKernelSize","LAOKernelRadius","updatedExtents"]),w.setGetArray(t,e,["ipScalarRange"],2),w.setGetArray(t,e,["labelOutlineThickness"]),PM(t,e)}var AM=w.newInstance(g0,"vtkVolumeProperty"),h0={newInstance:AM,extend:g0,...go};function KM(t,e){e.classHierarchy.push("vtkVolume"),t.getVolumes=()=>[t],t.makeProperty=h0.newInstance,t.getRedrawMTime=()=>{let r=e.mtime;if(e.mapper!==null){let n=e.mapper.getMTime();r=n>r?n:r,e.mapper.getInput()!==null&&(e.mapper.getInputAlgorithm().update(),n=e.mapper.getInput().getMTime(),r=n>r?n:r)}return r}}var XM={mapper:null};function v0(t,e,r={}){Object.assign(e,XM,r),Li.extend(t,e,r),e.boundsMTime={},w.obj(e.boundsMTime),w.setGet(t,e,["mapper"]),KM(t,e)}var YM=w.newInstance(v0,"vtkVolume"),qM={newInstance:YM,extend:v0};var{BlendMode:Rr}=np;function ZM(t,e,r,n,a){let i=null;return a?(i=a,i.removeAllPoints()):i=xn.newInstance(),i.addPointLong(-1024,0,1,1),i.addPoint(t,e),i.addPoint(r,n),i}var QM=["getAnisotropy","getComputeNormalFromOpacity","getFilterMode","getFilterModeAsString","getGlobalIlluminationReach","getIpScalarRange","getIpScalarRangeByReference","getLAOKernelRadius","getLAOKernelSize","getLocalAmbientOcclusion","getPreferSizeOverAccuracy","getVolumetricScatteringBlending","setAnisotropy","setComputeNormalFromOpacity","setFilterMode","setFilterModeToNormalized","setFilterModeToOff","setFilterModeToRaw","setGlobalIlluminationReach","setIpScalarRange","setIpScalarRangeFrom","setLAOKernelRadius","setLAOKernelSize","setLocalAmbientOcclusion","setPreferSizeOverAccuracy","setVolumetricScatteringBlending"],JM={createRadonTransferFunction:ZM};function eD(t,e){e.classHierarchy.push("vtkVolumeMapper");let r={...t};t.computeBounds=()=>{let n=t.getInputData();if(!n){q.reset(e.bounds);return}e.static||t.update(),q.setBounds(e.bounds,n.getBounds())},t.setBlendModeToComposite=()=>{t.setBlendMode(Rr.COMPOSITE_BLEND)},t.setBlendModeToMaximumIntensity=()=>{t.setBlendMode(Rr.MAXIMUM_INTENSITY_BLEND)},t.setBlendModeToMinimumIntensity=()=>{t.setBlendMode(Rr.MINIMUM_INTENSITY_BLEND)},t.setBlendModeToAverageIntensity=()=>{t.setBlendMode(Rr.AVERAGE_INTENSITY_BLEND)},t.setBlendModeToAdditiveIntensity=()=>{t.setBlendMode(Rr.ADDITIVE_INTENSITY_BLEND)},t.setBlendModeToRadonTransform=()=>{t.setBlendMode(Rr.RADON_TRANSFORM_BLEND)},t.getBlendModeAsString=()=>w.enumToString(Rr,e.blendMode),t.setVolumeShadowSamplingDistFactor=n=>r.setVolumeShadowSamplingDistFactor(n>=1?n:1),QM.forEach(n=>{let a=()=>{throw new Error(`The method "volumeMapper.${n}()" doesn't exist anymore. It is a rendering property that has been moved to the volume property. Replace your code with:
volumeActor.getProperty().${n}()
`)};t[n]=a})}var tD=t=>({bounds:[...q.INIT_BOUNDS],sampleDistance:1,imageSampleDistance:1,maximumSamplesPerRay:1e3,autoAdjustSampleDistances:!0,initialInteractionScale:1,interactionSampleDistanceFactor:1,blendMode:Rr.COMPOSITE_BLEND,volumeShadowSamplingDistFactor:5,colorTextureWidth:1024,opacityTextureWidth:1024,labelOutlineTextureWidth:1024,...t});function d0(t,e,r={}){Object.assign(e,tD(r)),Fi.extend(t,e,r),w.setGet(t,e,["sampleDistance","imageSampleDistance","maximumSamplesPerRay","autoAdjustSampleDistances","initialInteractionScale","interactionSampleDistanceFactor","blendMode","volumeShadowSamplingDistFactor","colorTextureWidth","opacityTextureWidth","labelOutlineTextureWidth"]),w.event(t,e,"lightingActivated"),eD(t,e)}var rD=w.newInstance(d0,"vtkVolumeMapper"),nD={newInstance:rD,extend:d0,...JM};export{nc as vtkColorTransferFunction,Z as vtkDataArray,VM as vtkGenericRenderWindow,Uo as vtkImageData,xn as vtkPiecewiseFunction,qM as vtkVolume,nD as vtkVolumeMapper};
