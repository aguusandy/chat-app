const apiRequest = async (url, method, data = null) => {
  const baseUrl = 'http://127.0.0.1:8000/';

  if( url !== 'api/login/' && !(sessionStorage.token && sessionStorage.userData)){
    window.location.replace(`http://127.0.0.1:5173/login`)
  }


    let token;
    
    if( sessionStorage.token ){
        token = sessionStorage.token;
    }

    const options = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
      }
    };
  
    if (token) {
      options.headers['Authorization'] = `Token ${token}`;
    }
  
    if (data && method.toUpperCase() !== 'GET') {
      options.body = JSON.stringify(data);
    }
  
    const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
    try {
      const response = await fetch(fullUrl, options);
      
      let responseData = {};
      
      if (response.status !== 204) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && (contentType.startsWith('image') || contentType.startsWith('application/pdf'))) {
          responseData = await response.blob();
        } else {
          responseData = await response.json();
        }
      } else {
        responseData = { mensaje: "Object with no content" };
      }
  
      responseData.status = response.status;
  
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }
  
      return responseData;
      
    } catch (error) {
      console.error('Error in API request:', error);
      throw error;
    }
  };

export default apiRequest;