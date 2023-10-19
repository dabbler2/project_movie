const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZTFlZDhjM2I0NmM2ZTZiYjY4MjYzMzBiNzM0ZTlkMCIsInN1YiI6IjY1MmYyMWU4ZWE4NGM3MDEyZDcxYWQ1ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1sdyif5DYVbjFmwmxjyHKX8sMQM6MPPDHoleRZROXBU'
  }
};

let cards = document.getElementById('cards')
let message = document.getElementById('message')

async function scrap(m=3){
	let proms = [], movieList = []
	message.textContent = "로딩 중입니다. 잠시만 기다려주세요."
	for(let i=1;i<=m;++i) proms.push(await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page='+i, options))
	let proms2 = await Promise.all(proms)
	let jsons = await Promise.all(proms2.map(res => res.json()))
	let results = await jsons.map(r => r.results.map(c => movieList.push(c)))
	message.textContent = ""
	return movieList
}

let moviecard = movie => {
	let card = document.createElement('div')
	card.id = "card_"+movie.title.toUpperCase()
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
	title.addEventListener('click',() => window.open('https://www.themoviedb.org/movie/'+movie.id,'_blank'))
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

// 그때그때 카드 만들어서 넣어주기 -> 서버를 매번 접근해야 되니까 안좋음
/* async function main(){
	let movieList = await scrap()
	console.log(movieList[0])
	let searchBtn = document.getElementById('searchBtn')
	let keyword = document.getElementById('keyword')
	searchBtn.onclick = () => {
		let kw = keyword.value.trim()
		let kwupper = kw.toUpperCase()
		keyword.value = ''
		if(!kwupper || [...kwupper].every(c => c==' ')){
			message.textContent = "검색 키워드를 입력해주세요."; return
		}cards.replaceChildren()
		message.textContent = kw+"의 검색 결과"
		movieList.filter(movie => movie.title.toUpperCase().includes(kwupper))
			.map(movie => cards.appendChild(moviecard(movie)))
		if(!cards.firstChild) message.textContent = kw+"의 검색 결과가 없습니다."
		
	}
	keyword.addEventListener('keypress', event => {
		if(event.key=='Enter') searchBtn.click()
	})
}

main()  */

// 카드는 한번만 만들고 display로 조절하기
async function main2(){
	let movieList = await scrap()
	movieList.map(movie => cards.appendChild(moviecard(movie)))
	console.log(movieList[0])
	let searchBtn = document.getElementById('searchBtn')
	let keyword = document.getElementById('keyword')
	searchBtn.onclick = () => {
		let kw = keyword.value.trim()
		let kwupper = kw.toUpperCase()
		keyword.value = ''
		if(!kwupper || [...kwupper].every(c => c==' ')){
			message.textContent = "검색 키워드를 입력해주세요."; return
		}
		message.textContent = kw+"의 검색 결과"
		for(const card of cards.children)
			card.style.display = card.id.slice(5).includes(kwupper)? "flex":"none"
	}
	keyword.addEventListener('keypress', event => {
		if(event.key=='Enter') searchBtn.click()
	})
}

main2()