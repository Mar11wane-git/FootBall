import React from 'react';
import './Header.css'
import {Link} from 'react-router-dom'

function Header() {
    return (
        <div className='all'>
            <div className='me'>
            <Link className='T' to="accueil">Terago</Link>
            </div>
            <div className='a'>
            <Link  className='c'  to="accueil">Accueil</Link>
            <Link  className='c' to='terrain'>Terrains</Link>
            <Link  className='c' to='Reservation'>Reservations</Link>
            <Link  className='c' to='Contact'>Contact</Link>
            </div>
            

        </div>
    );
}

export default Header;