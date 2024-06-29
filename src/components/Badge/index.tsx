import React, { ReactNode } from 'react';

type BadgeProps = {
    text?: string;
    color?: string;
    children?: ReactNode
};

const Badge: React.FC<BadgeProps> = ({ text, color = 'bg-blue-500', children }) => {
    return (
        <div className='relative flex flex-row-reverse'>
            {text && <span className={`absolute -m-3 -mr-5 inline-block px-3 py-1 text-sm font-semibold text-white rounded-full ${color}`}>
                {text}
            </span>}
            {children}
        </div>
    );
};

export default Badge;