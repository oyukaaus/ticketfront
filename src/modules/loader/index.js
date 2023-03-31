import React from 'react';

const Loader = () => {
    return (
        <div className='loader-container'>
            <svg className="splash-spinner" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"/>
            </svg>
        </div>
    )
}

export default Loader;