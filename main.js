const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZTFlZDhjM2I0NmM2ZTZiYjY4MjYzMzBiNzM0ZTlkMCIsInN1YiI6IjY1MmYyMWU4ZWE4NGM3MDEyZDcxYWQ1ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1sdyif5DYVbjFmwmxjyHKX8sMQM6MPPDHoleRZROXBU'
  }
};

let cards = document.getElementById('cards')
let message = document.getElementById('message')
let searchBtn = document.getElementById('searchBtn')
let advancedBtn = document.getElementById('advancedBtn')
let advanced = document.getElementById('advanced')
let genreList

// 영화 정보 긁어오기
async function scrape_movie(m=3){
	let proms = [], movieList = []
	message.textContent = "로딩 중입니다. 잠시만 기다려주세요."
	for(let i=1;i<=m;++i) proms.push(await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page='+i, options))
	let proms2 = await Promise.all(proms)
	let jsons = await Promise.all(proms2.map(res => res.json()))
	let results = await jsons.map(r => r.results.map(c => movieList.push(c)))
	return movieList
}

// 장르 정보 긁어오기
async function scrape_genre(){
	return fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
	  .then(response => response.json())
	  .then(res => {
		  let d = {}
		  res.genres.forEach(x => d[x.id] = x.name)
		  return d
	  })
	  .catch(err => console.log(err));
}

// 영화 카드 만들기
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
	title.style.display = 'inline-block'
	title.addEventListener('click',() => window.open('https://www.themoviedb.org/movie/'+movie.id,'_blank'))
	illu.appendChild(title)
	
	let year_genre = document.createElement('p')
	year_genre.classList.add('year')
	card.genres = movie.genre_ids.map(i => genreList[Number(i)])
	year_genre.textContent = movie.release_date.slice(0,4)+' · '+card.genres.join(', ')
	illu.appendChild(year_genre)
	
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

// 장르 체크박스 만들기
let genrecheck = (id,name) => {
	let div = document.createElement('div')
	div.style.display = 'flex'
	
	let check = document.createElement('input')
	check.setAttribute("type","checkbox");
	check.id = name
	check.checked = true
	div.appendChild(check)
	
	let label = document.createElement('label')
	label.setAttribute("for",name)
	label.textContent = name
	div.appendChild(label)
	
	return div
}

// 영화 장르 중 원하는 장르에 포함되는게 있는지 확인
let fit = card => {
	for(let genre of card.genres)
		if(document.getElementById(genre).checked) return true
	return false
}

async function main2(){
	let movieList = await scrape_movie()
	genreList = await scrape_genre()
	
	// 장르 체크박스 만들어 넣기
	let allgenres = genrecheck(0,"All")
	allgenres.firstChild.addEventListener('change',function(){
		if(this.checked)
			for(const check of advanced.children)
				check.firstChild.checked = true
		else
			for(const check of advanced.children) 
				check.firstChild.checked = false
	})
	Object.entries(genreList).forEach(genre => {
		let gc = genrecheck(...genre)
		gc.firstChild.addEventListener('change',function(){
			allgenres.firstChild.checked = [...advanced.children].slice(0,-1).every(c => c.firstChild.checked)
		})
		advanced.appendChild(gc)
	})
	advanced.appendChild(allgenres)
	advancedBtn.onclick = () => advanced.style.display = advanced.style.display=='none'? 'grid':'none'
	message.textContent = ""
	
	// 영화 카드 만들어 넣기
	movieList.map(movie => cards.appendChild(moviecard(movie)))
	
	// 검색 기능
	let keyword = document.getElementById('keyword')
	searchBtn.onclick = () => {
		let kw = keyword.value.trim()
		let kwupper = kw.toUpperCase()
		keyword.value = ''
		if([...advanced.children].slice(0,-1).every(c => !c.firstChild.checked)){
			message.textContent = "검색 조건을 입력해주세요."; return
		}
		message.textContent = kw? kw+"의 검색 결과":"장르 검색 결과"
		for(const card of cards.children)
			card.style.display = card.id.slice(5).includes(kwupper) && fit(card)? "flex":"none"
	}
	keyword.addEventListener('keypress', event => {
		if(event.key=="Enter") searchBtn.click()
	})
}

main2()