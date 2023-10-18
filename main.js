const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZTFlZDhjM2I0NmM2ZTZiYjY4MjYzMzBiNzM0ZTlkMCIsInN1YiI6IjY1MmYyMWU4ZWE4NGM3MDEyZDcxYWQ1ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1sdyif5DYVbjFmwmxjyHKX8sMQM6MPPDHoleRZROXBU'
  }
};

async function scrap(m=2){
	let proms = [], movieList = []
	for(let i=1;i<=2;++i) proms.push(await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page='+i, options))
	let proms2 = await Promise.all(proms)
	let jsons = await Promise.all(proms2.map(res => res.json()))
	let results = await jsons.map(r => r.results.map(c => movieList.push(c)))
	return movieList
}

async function main(){
	let movieList = await scrap()
	console.log(movieList[0].title)
	let searchBtn = document.getElementById('searchBtn')
	searchBtn.onclick = () => {
		let keyword = document.getElementById('keyword').value
		let cards = document.getElementById('cards')
		cards.innerHTML = ''
		movieList.forEach(movie =>{
			if(movie.title.includes(keyword)) cards.innerHTML += movie.title+', '
		})
	}
}

/* async function main(){
	let movieList = await scrap()
	//let a = document.getElementById('a')
	//for(let j=0;j<movieList.length;++j) a.innerHTML += movieList[j]+'\n'
}*/

main() 