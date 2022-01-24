import { useContext, useEffect } from 'react'
import { Mastery, Player } from 'interfaces/player'
import { styles } from 'styles/styles.config'
import { parse_k_num } from 'utils'
import { Container, EmptyPlayers, PlayerImg } from 'components'
import { PlayersContext } from 'hooks/PlayersContext'
import Image from 'next/image'

// ┌────────────────┐
// │ MASTERIES PAGE:│
// └────────────────┘
// Visualize each player in a table
// Each row of the table is a champ with his stats
export default function Masteries() {
    const { setPlayers, players } = useContext(PlayersContext)

    
	/* TODO: Order players by total mastery. Instead of players.map(), make:
    ordered_players = players.sort
    and then:
    ordered_players.map( // etc... )
	*/


    // By default force players to be []
	if (players === undefined) {
		setPlayers([])
	}
    //Highest to lowest
    
    useEffect(() => {
        if (players){
            const rr2=[...players]
            console.log(rr2)
            
            if(rr2.length >= 1){
               rr2.sort((player_a: Player ,player_b: Player) =>{
                    let total_points_b:number
                    let total_points_a:number
                    
                    player_a.masteries.map(mastery => total_points_a += mastery.points)
                    
                    player_b.masteries.map(mastery => total_points_b += mastery.points)
                    
                    return total_points_b - total_points_a
                })
                setPlayers(rr2)     
            }
        }
    }, [players, setPlayers]);
    
    if (!players || players.length === 0) {
        return <EmptyPlayers />
    }

    return (
        <Container title={'Mastery'} description={'Your 7 champions with most points'}>
            <div className='grid gap-4 2xl:grid-cols-2'>
                {players.map((player, idx_player) => {
                    let total_masteries = 0
                    player.masteries.map((mastery: Mastery) => (total_masteries += mastery.points))

                    return (
                        <div key={idx_player} className={`p-2 m-2 ${styles.card} ${styles.foreground} md:grid grid-cols-4`}>
                            <div className='flex items-center'>
                                <PlayerImg image={player.image} alias={player.alias} level={player.level} />
                                <div className='flex flex-col'>
                                    <h2 className='text-xl'>{player.alias}</h2>
                                    <h4>{parse_k_num(total_masteries, 0, false)}</h4>
                                </div>
                            </div>
                            <div className='col-span-3 grid grid-cols-4 sm:grid-cols-7'>
                                {player.masteries.map((mastery: Mastery, idx_mastery: number) => (
                                    <div key={idx_mastery} className='p-2 text-center'>
                                        <span>
                                            {mastery.points > 100000 ? '🔥' : ''}
                                            {parse_k_num(mastery.points, 0, true)}
                                        </span>
                                        <div className='relative h-24 flex justify-center'>
                                            <div className='absolute t-0 r-0'>
                                                <div className='relative w-16 h-28 rounded'>
                                                    <Image
                                                        src={'/images/mastery_' + mastery.level + '.png'}
                                                        layout='fill'
                                                        alt={mastery.name}
                                                    />
                                                </div>
                                            </div>
                                            <div className='absolute t-0 r-0'>
                                                <div className='relative w-16 h-16 rounded'>
                                                    <Image src={mastery.image} layout='fill' alt={mastery.name} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </Container>
    )
}
