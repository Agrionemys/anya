import{_ as h,d as p,h as f,o as s,c as a,i as e,j as m,k as b,v as y,a as i,F as v,r as k,l as d,t as r}from"./entry-bd46a3d3.mjs";import{u as x}from"./fetch-6f56b794.mjs";import{S as w}from"./vue-tabler-icons.es-caf75899.mjs";import"./utils-c8dfd953.mjs";const g=p({__name:"lookup",setup(_,{expose:o}){o();const l=f({search:null,items:null}),n={state:l,submit:async()=>{const{data:c,pending:t,error:M,refresh:q}=await x(`/api/lookup?search=${l.search}`);l.items=c},SearchIcon:w};return Object.defineProperty(n,"__isScriptSetup",{enumerable:!1,value:!0}),n}}),E={class:"flex flex-col items-center justify-center w-full gap-2"},B={class:"flex flex-col w-full gap-4 m-auto"},P={class:"shadow-xl card bg-base-100"},S={class:"card-body"},D=["onSubmit"],F={class:"w-full form-control"},j={class:"justify-start card-actions"},A={type:"submit",class:"btn btn-primary btn-md"},N={class:"overflow-x-auto"},V={key:0,class:"table w-full table-compact"},C=e("thead",null,[e("tr",null,[e("th",null,"\u0424\u0418\u041E \u041A\u043B\u0438\u0435\u043D\u0442\u0430"),e("th",null,"\u0422\u0435\u043B\u0435\u0444\u043E\u043D")])],-1),I={key:0,class:"flex flex-row items-center justify-center gap-2 font-semibold text-white shadow-lg alert alert-error"},O=e("span",{class:"w-auto"},"\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043D\u0430\u0439\u0442\u0438 \u043A\u043B\u0438\u0435\u043D\u0442\u043E\u0432, \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0445 \u0437\u0430\u043F\u0440\u043E\u0441\u0443",-1);function T(_,o,l,u,n,c){return s(),a("div",E,[e("div",B,[e("div",P,[e("div",S,[e("form",{class:"flex flex-row items-center w-full gap-2",onSubmit:m(u.submit,["prevent"])},[e("div",F,[b(e("input",{"onUpdate:modelValue":o[0]||(o[0]=t=>u.state.search=t),type:"text",required:"",placeholder:"\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0434 \u0437\u0430\u043A\u0430\u0437\u0430 \u0438\u043B\u0438 \u0424\u0418\u041E \u043A\u043B\u0438\u0435\u043D\u0442\u0430",class:"w-full input input-bordered"},null,512),[[y,u.state.search]])]),e("div",j,[e("button",A,[i(u.SearchIcon)])])],40,D),e("div",N,[u.state.items&&u.state.items.length>0?(s(),a("table",V,[C,e("tbody",null,[(s(!0),a(v,null,k(u.state.items,t=>(s(),a("tr",null,[e("th",null,r(t.Pokypatel?t.Pokypatel.Familia:t.Familia)+" "+r(t.Pokypatel?t.Pokypatel.Name:t.Name)+" "+r(t.Pokypatel?t.Pokypatel.Otchestvo:t.Otchestvo),1),e("td",null,r(t.Pokypatel?t.Pokypatel.Telephone:t.Telephone),1)]))),256))])])):d("",!0)])])]),u.state.items&&u.state.items.length==0?(s(),a("div",I,[i(u.SearchIcon,{class:"flex-shrink-0"}),O])):d("",!0)])])}var H=h(g,[["render",T]]);export{H as default};