import { Player } from '../interfaces/interfaces'
import getIndexOfString from './getIndexOfString'


export default function processData(data) {

	// Context of the onepage webapp
	const context: Player[] = []
	
	// Upload context adding the player info
	const pushPlayer =(name:string , alias:string , image:string, champs: any[]) => {
		context.push({
			name: name,
			alias: alias,
			image: image,
			champs: champs
		})
	}


	// [The logic]: gets the data from pops and destructures it until get 
	// the desired info of that player and stores the result with pushPlayer()
	data.map(player => {
		const champs = []

		// Get profile image
		const profile_pic = getIndexOfString('<div class="ProfileIcon">', player.data, true)[0]
		const substr_pic = player.data.slice(profile_pic, profile_pic+600)

		// index helpers: [profile image]
		const idx_pic = getIndexOfString('<img src="//opgg-static', substr_pic, true)[0]+10
		const idx_pic_end = getIndexOfString('.jpg', substr_pic, true)[0]+4
		const summoner_pic = 'http:' + substr_pic.slice(idx_pic, idx_pic_end)


		// Get each champion's data
		const champs_indexes =	getIndexOfString('<div class="ChampionBox Ranked">', player.data, true)
		champs_indexes.map(x => {

			// SUB-STRINGS 
			const substr_name = player.data.slice(x+60, x+90)
			const substr_img = player.data.slice(x+100, x+300)
			const substr_cs = player.data.slice(x+450, x+700)
			const substr_kda = player.data.slice(x+520, x+1050)
			const substr_winrate = player.data.slice(x+1000, x+1200)

			// index helpers: [image]
			const idx_img = getIndexOfString('<img src="', substr_img, false)[0]+10
			const idx_img_end = getIndexOfString('.png', substr_img, false)[0]+4
			
			// index helpers: [CS]
			const idx_cs = getIndexOfString('CS', substr_cs, true)[2]
			const idx_cs_end = getIndexOfString('(', substr_cs.slice(idx_cs+3, idx_cs+20), false)[0]//+2

			// index helpers: [KDA]
			const idx_kda = getIndexOfString('<span class="KDA">', substr_kda, false)[0]+18
			const idx_kda_kills = getIndexOfString('<div class="KDAEach">', substr_kda, false)[0]+45
			const idx_kda_kills_end = getIndexOfString('<', substr_kda.slice(idx_kda_kills, idx_kda_kills+5), false)[0]
			const idx_kda_deaths = getIndexOfString('<span class="Death">', substr_kda, false)[0]+20
			const idx_kda_deaths_end = getIndexOfString('<', substr_kda.slice(idx_kda_deaths, idx_kda_deaths+5), false)[0]
			const idx_kda_assists = getIndexOfString('<span class="Assist">', substr_kda, false)[0]+21
			const idx_kda_assists_end = getIndexOfString('<', substr_kda.slice(idx_kda_assists, idx_kda_assists+5), false)[0]

			// index helpers: [winrate]
			const idx_winrate = getIndexOfString('%', substr_winrate, false)[0]-2

			let games: string
			if (substr_winrate.slice(idx_winrate+39, idx_winrate+40) === ' ')
				// empty space in 2º position?: number has only 1 digit
				games = substr_winrate.slice(idx_winrate+38, idx_winrate+39)
			else if (substr_winrate.slice(idx_winrate+40, idx_winrate+41) === ' ')
				// empty space in 3º position?: number has 2 digit
				games = substr_winrate.slice(idx_winrate+38, idx_winrate+40) 
			else
				// else: 3 digit
				games = substr_winrate.slice(idx_winrate+38, idx_winrate+41) 

			let winrate = substr_winrate.slice(idx_winrate-1, idx_winrate) === '\t'
				? substr_winrate.slice(idx_winrate, idx_winrate+2)
				: substr_winrate.slice(idx_winrate-1, idx_winrate+2)

			// Once we've isolated every info block, we can build our champ object and push it into [champs]
			champs.push({
				name: substr_name.slice(0, getIndexOfString('"', substr_name, false)[0]).replace("&#039;", "'"),
				image: 'https:' + substr_img.slice(idx_img, idx_img_end),
				games: parseInt(games),
				winrate: parseInt(winrate),
				kda: parseFloat(substr_kda.slice(idx_kda, idx_kda+4)),
				kills: parseFloat(substr_kda.slice(idx_kda_kills, idx_kda_kills+idx_kda_kills_end)),
				deaths: parseFloat(substr_kda.slice(idx_kda_deaths, idx_kda_deaths+idx_kda_deaths_end)),
				assists: parseFloat(substr_kda.slice(idx_kda_assists, idx_kda_assists+idx_kda_assists_end)),
				cs: parseFloat(substr_cs.slice(idx_cs+3, idx_cs + idx_cs_end)),
				csmedian: parseFloat(substr_cs.slice(idx_cs+3, idx_cs+20).slice(idx_cs_end+1, idx_cs_end+4)),
			})
			
			// Once we got our last champ (7º), we push the player object before continue with the next player 
			if (champs.length == 7) pushPlayer(player.name, player.alias, summoner_pic, champs) 
		})
	})

	return context
}