export async function fetchBooks() {
  const url = process.env.REACT_APP_BOOKS_SERVER_URL;

  if(!url) throw new Error('REACT_APP_BOOKS_SERVER_URL undefined');
  
  const response = await fetch(url);

  if(response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error(`Couldn't fetch books`);
  }
};
