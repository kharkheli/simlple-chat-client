import React from 'react'
import './error.css'
import gear11 from '../photoes/gear-11.png'
import gear7 from '../photoes/gear-7.png'
import gear9 from '../photoes/gear-9.png'
import gear12 from '../photoes/gear-12.png'
import gear13 from '../photoes/gear-13.png'
import gear4 from '../photoes/gear-4.png'
import gear6 from '../photoes/gear-6.png'
import gear2 from '../photoes/gear-2.png'
import gear3 from '../photoes/gear-3.png'
import gear14 from '../photoes/gear-14.png'
import gear15 from '../photoes/gear-15.png'
import circle from '../photoes/circle.png'
import circleFill from '../photoes/circle-fill.png'
import gear5 from '../photoes/gear-5.png'
import gear8 from '../photoes/gear-8.png'
import weight from '../photoes/weight.png'
import gear1 from '../photoes/gear-1.png'
import gear10 from '../photoes/gear-10.png'

function Error() {
  return (
    <div className="error-page">
      <div className="gears-cont">
        <div
          className="gear-cont"
          style={{ width: '124px', height: '123px', left: '175px' }}
        >
          <img className="gear gear11" src={gear11} alt="gear11" />
          <img className="gear gear7" src={gear7} alt="gear7" />
        </div>
        <div
          className="gear-cont"
          style={{
            width: '329px',
            height: '329px',
            top: '46px',
            left: '147px',
          }}
        >
          <img
            className="gear gear9"
            src={gear9}
            style={{ zIndex: '0' }}
            alt="gear9"
          />
          <img className="gear gear12" src={gear12} alt="gear12" />
          <img src={gear13} alt="gear13" className="gear gear13" />
        </div>
        <div
          className="gear-cont"
          style={{
            width: '134px',
            height: '134px',
            left: '322px',
            bottom: '224px',
          }}
        >
          <img className="gear gear4" src={gear4} alt="gear4" />
          <img className="gear gear6" src={gear6} alt="gear6" />
        </div>
        <div
          className="gear-cont"
          style={{
            width: '170px',
            height: '170px',
            left: '240px',
            bottom: '83px',
          }}
        >
          <img className="gear gear2" src={gear2} alt="gear2" />
          <img className="gear gear3" src={gear3} alt="gear3" />
          <img className="gear gear14" src={gear14} alt="gear14" />
        </div>
        <div
          className="gear-cont"
          style={{
            width: '321px',
            height: '321px',
            left: '80px',
            top: '172px',
          }}
        >
          <img className="gear circle" src={circle} alt="circle" />
          <img
            className="gear circle-fill"
            src={circleFill}
            alt="circle-fill"
          />
          <img className="gear gear15" src={gear15} alt="gear15" />
        </div>
        <div
          className="gear-cont"
          style={{
            width: '321px',
            height: '321px',
            left: '-65px',
            top: '35px',
          }}
        >
          <img className="gear gear8" src={gear8} alt="gear8" />
          <img className="gear gear5" src={gear5} alt="gear5" />
        </div>
        <div
          className="gear-cont"
          style={{
            width: '321px',
            height: '321px',
            left: '150px',
            top: '335px',
          }}
        >
          <img
            className="gear gear10"
            src={gear10}
            alt="gear10"
            style={{ zIndex: '0' }}
          />
        </div>

        <div
          className="gear-cont"
          style={{
            width: '321px',
            height: '321px',
            left: '29px',
            top: '300px',
          }}
        >
          <img className="gear gear1" src={gear1} alt="gear1" />
        </div>
        <div className="chain"></div>
        <img src={weight} alt="weight" className="weight" />
      </div>
      <div className="error-text">
        <div>
          <h1>ERROR 404</h1>
          <h3>
            <a href="/">back to home</a>
          </h3>
        </div>
      </div>
    </div>
  )
}

export default Error
