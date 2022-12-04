//Axios global
axios.defaults.headers.common['X-Auth-Token']=' My Global Token';



// GET REQUEST
function getTodos() {
  // axios({
  //   method:'get',
  //   url:'https://jsonplaceholder.typicode.com/todos',
  //   //this url will print all 200 todos of api but we want to limit it we can use param
  //   params:{
  //     _limit:10
  //   }
  // })
//we can also write it as below code

//timeout- if response didnt come in that time than it will throw an error
  axios
    .get('https://jsonplaceholder.typicode.com/todos?_limit=10',{timeout:5000})
    .then((res)=>showOutput(res))
    .catch((err)=>console.log(err));
}

// POST REQUEST - to send data to url
function addTodo() {
  // axios({
  //   method:'post',
  //   url:'https://jsonplaceholder.typicode.com/todos',
  //   data:{
  //     title:'New Todo',
  //     completed:'false'
  //   }
  // })
  axios.post('https://jsonplaceholder.typicode.com/todos',{
    title:'New Todo',
    completed:'false'
  })
    .then((res)=>{showOutput(res)})
    .catch((err)=>{console.log(err)});
}

// PUT/PATCH REQUEST
function updateTodo() {
//here in url we will also mention id
//Put and patch use for update
  axios.put('https://jsonplaceholder.typicode.com/todos/1',{
    title:'Updated Todo',
    completed:'true'
  })
  .then((res)=>{showOutput(res)})
  .catch((err)=>{console.log(err)});

  // axios.patch('https://jsonplaceholder.typicode.com/todos/1',{
  //   title:'Updated Todo',
  //   completed:'true'
  // })
  // .then((res)=>{showOutput(res)})
  // .catch((err)=>{console.log(err)});
}

// DELETE REQUEST
function removeTodo() {
  //it delete and return the empty object
  axios.delete('https://jsonplaceholder.typicode.com/todos/1')
  .then((res)=>{showOutput(res)})
  .catch((err)=>{console.log(err)});
}

// SIMULTANEOUS DATA
function getData() {

  //getting data from multiple url
  // once all this url fulfilled(promise) then we get our respnse

  axios.all([
    axios.get('https://jsonplaceholder.typicode.com/todos?_limit=10'),
    axios.get('https://jsonplaceholder.typicode.com/posts?_limit=10')
  ])
    .then(axios.spread((todos,posts)=>{showOutput(posts)}))
    // .then((res)=>{
    //   //in output we are getting an array
    //   console.log(res[0]);
    //   console.log(res[1]);
    //   showOutput(res[1]);
    // })
    .catch((err)=>{console.log(err)});
}

// CUSTOM HEADERS
function customHeaders() {

  const config={
    headers:{
      'Content-Type': 'application/json',
      Authorization:'some token'
    }
  };
  axios.post('https://jsonplaceholder.typicode.com/todos',
  { title:'New Todo',
    completed:'false'},
    config
    )
    .then((res)=>{showOutput(res)})
    .catch((err)=>{console.log(err)});
}

// TRANSFORMING REQUESTS & RESPONSES

//transform data
function transformResponse() {
  const options={
    method:'post',
    url:'https://jsonplaceholder.typicode.com/todos',
    data:{
      title:'transform '

    },transformResponse:axios.defaults.transformResponse.concat((data)=>{
      data.title=data.title.toUpperCase();
      return data;
    })
  };

  axios(options).then((res)=>{showOutput(res)});


}

// ERROR HANDLING
function errorHandling() {
  axios
  //url change to ss

  //suppose we only want to handle error by by status
  .get('https://jsonplaceholder.typicode.com/todoss',
  // {
  //   validateStatus:function(status){
  //     return status<500;  //rejects status if status >=500
  //     //if status is less than 500 it will not throw error
  //   }
  // }
  )
  .then((res)=>showOutput(res))
  .catch((err)=>{
    //if server respnded with a status other than 200(success) ranges
    if(err.response){
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
    }
    if(err.response.status===404){
      alert('Error: Page Not Found');
    }
    else if(err.request){
      //request was made but no response
      console.error(err.request);
    }
    else{
      console.error(err.message);
    }
  });
}



// CANCEL TOKEN - we can cancel request
function cancelToken() {
  const source=axios.CancelToken.source();

  axios.get('https://jsonplaceholder.typicode.com/todoss',{
    cancelToken:source.token
  })
  .then((res)=>{showOutput(res)})
  .catch((thrown)=>{
    if(axios.isCancel(thrown)){
      console.log('request cancel',thrown.message);
    }
  });

  if(true){
    source.cancel('Request canceled');
  }
}

// INTERCEPTING REQUESTS & RESPONSES

/*interceptors which will allow us to run some kind function whenever we make any request
it works like logger
*/

axios.interceptors.request.use((config)=>{
  console.log(`Mehtod is ${config.method.toUpperCase()}`);
  console.log(`Url is ${config.url}`);
  console.log(`at time  ${new Date()}`);

  return config;
  },
  (error)=>{
    return Promise.reject(error);
  }
);

// // AXIOS INSTANCES for custom settings
// const axiosInstance=axios.create({
//   baseURL: 'https://jsonplaceholder.typicode.com'
// });
// axiosInstance.get('/comments').then((res)=>{showOutput(res)});
// //here out base URL is set jsonplaceholder home page  and we are than going to baseURL/comments it will show data of commentspage


// Show output in browser
function showOutput(res) {
  document.getElementById('res').innerHTML = `
  <div class="card card-body mb-4">
    <h5>Status: ${res.status}</h5>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Headers
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.headers, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Data
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.data, null, 2)}</pre>
    </div>
  </div>

  <div class="card mt-3">
    <div class="card-header">
      Config
    </div>
    <div class="card-body">
      <pre>${JSON.stringify(res.config, null, 2)}</pre>
    </div>
  </div>
`;
}

// Event listeners
document.getElementById('get').addEventListener('click', getTodos);
document.getElementById('post').addEventListener('click', addTodo);
document.getElementById('update').addEventListener('click', updateTodo);
document.getElementById('delete').addEventListener('click', removeTodo);
document.getElementById('sim').addEventListener('click', getData);
document.getElementById('headers').addEventListener('click', customHeaders);
document
  .getElementById('transform')
  .addEventListener('click', transformResponse);
document.getElementById('error').addEventListener('click', errorHandling);
document.getElementById('cancel').addEventListener('click', cancelToken);


/*

The  headers are used to pass additional information between the clients and the server through the request and response header.

Axios- is a tool to communicate between the client and the server.Axios is a promise-based HTTP Client for node.js and the browser. 
It is isomorphic (= it can run in the browser and nodejs with the same codebase). 
On the server-side it uses the native node.js http module, while on the client (browser) it uses XMLHttpRequests.


common axios mistake-
  incorrect url

  url consist of -baseUrl/route
                for e.g
                flipkart.com/buyProducts
                flipkart.com/sellProducts
                flipkart.com/getProducts

                baseurl- flipkart.com
                route-buyProducts,sellProducts/getProducts
            


*/