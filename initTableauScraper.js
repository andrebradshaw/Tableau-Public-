async function initTableauScraper(queries,count){
    const rando = (n) => Math.round(Math.random() * n);
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    async function handleFetch(url,params_obj,type){ //all arguments are required
      async function handleResponse(res,type){
        if(type == 'json') return await res.json().catch(err=> { console.log([err,url,params_obj]); return false });
        if(type == 'text') return await res.text().catch(err=> { console.log([err,url,params_obj]); return false });
        if(type == 'html') {
          let text = await res.text().catch(err=> { console.log([err,url,params_obj]); return false }); 
          return new DOMParser().parseFromString(text,'text/html');
        }else{ return false }
      }
      if(params_obj && url){
        var res = await fetch(url,params_obj).catch(err=> { console.log([err,url,params_obj]); return false });
        if(res.status > 199 && res.status < 300) return await handleResponse(res,type);

        if(res.status == 429) {
          await delay(300000);
          let res = await fetch(url,params_obj).catch(err=> { console.log([err,url,params_obj]); return false });
          if(res.status > 199 && res.status < 300) return await handleResponse(res,type);
          else return {action: 'stop', status: res.status};
        }
        if(res.status > 399 && res.status < 900){
          await delay(4410);
          let res = await fetch(url,params_obj).catch(err=> { console.log([err,url,params_obj]); return false });
          if(res.status > 199 && res.status < 300) return await handleResponse(res,type);
          else return {action: 'stop', status: res.status};
        }
        if(res.status > 899) return {action: 'stop', status: res.status};
      } else {return false;}
    }
    function downloadr(arr2D, filename) {
      var data = /.json$|.js$/.test(filename) ? JSON.stringify(arr2D) : arr2D.map(el=> el.reduce((a,b) => a+'	'+b )).reduce((a,b) => a+''+b);
      var type = /.json$|.js$/.test(filename) ? 'data:application/json;charset=utf-8,' : 'data:text/plain;charset=utf-8,';
      var file = new Blob([data], {    type: type  });
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file, filename);
      } else {
        var a = document.createElement('a'),
        url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 10);
      }
    }
    async function getPublicAPIres(query,params){
        let {count,start} = params;
        let url = `https://public.tableau.com/api/search/query?query=${query}&count=${count}&start=${start}&type=authors`;
        let d = await handleFetch(url,{},'json');
        return d;
    }

    async function loopThroughSearch(query,count){
        let d = await getPublicAPIres(query,{count:count,start:0});
        console.log(d);
        var results_total = d?.totalHits;
        for(let i=count; i<results_total; i=i+count){
            let r = await getPublicAPIres(query,{count:count,start:i});
            await delay(rando(666)+333);
            contain_arr.push(results);
        }
        console.log(`${query} complete`);
        return true;
    }
    async function loopThroughQueries(queries){
        for(query in querires){
            await loopThroughSearch(query,count);
        }
        downloadr(contain_arr,`tableau dump.json`);
    }

}
var contain_arr = [];
initTableauScraper(['ryan','robert'],100)
