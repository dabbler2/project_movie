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

let moviecard = movie => {
	let card = document.createElement('div')
	card.classList.add('card')
	
	let poster = document.createElement('img')
	poster.classList.add('poster')
	poster.src = 'https://image.tmdb.org/t/p/original'+movie.poster_path
	poster.addEventListener('click',() => window.open('https://www.themoviedb.org/movie/'+movie.id,'_blank'))
	card.appendChild(poster)
	
	let illu = document.createElement('div')
	illu.classList.add('illustration')
	
	let title = document.createElement('p')
	title.classList.add('title')
	title.textContent = movie.title
	illu.appendChild(title)
	
	let year = document.createElement('p')
	year.classList.add('year')
	year.textContent = movie.release_date.slice(0,4)
	illu.appendChild(year)
	
	let rating = document.createElement('p')
	rating.classList.add('rating')
	rating.textContent = 'Rating '+movie.vote_average
	illu.appendChild(rating)
	
	let overview = document.createElement('overview')
	overview.classList.add('overview')
	overview.textContent = movie.overview
	illu.appendChild(overview)
	
	card.appendChild(illu)
	
	return card
}

async function main(){
	let movieList = await scrap()
	console.log(movieList[0])
	let searchBtn = document.getElementById('searchBtn')
	searchBtn.onclick = () => {
		let keyword = document.getElementById('keyword').value
		let cards = document.getElementById('cards')
		cards.replaceChildren()
		movieList.filter(movie => movie.title.includes(keyword))
			.map(movie => cards.appendChild(moviecard(movie)))
		if(!cards.firstChild) cards.textContent = "검색 결과가 없습니다."
	}
}

/* async function main(){
	let movieList = await scrap()
	//let a = document.getElementById('a')
	//for(let j=0;j<movieList.length;++j) a.innerHTML += movieList[j]+'\n'
}*/

main() 