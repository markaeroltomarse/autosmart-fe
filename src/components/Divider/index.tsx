import React from 'react';

export interface DividerProps {
    label?: string
    labelPosition?: 'left' | 'center' | 'right'
}

const Divider: React.FC<DividerProps> = (props) => {
    const { label, labelPosition } = props;

    let labelAlignmentClass = '';

    // Set label alignment class based on labelPosition prop
    if (labelPosition === 'left') {
        labelAlignmentClass = 'justify-start';
    } else if (labelPosition === 'center') {
        labelAlignmentClass = 'justify-center';
    } else if (labelPosition === 'right') {
        labelAlignmentClass = 'justify-end';
    }

    return (
        <div className={`flex items-center gap-3`}>
            <div className="border flex-grow"></div>
            <p className="text-sm tracking-wide">
                {label}
            </p>
            <div className="border flex-grow"></div>
        </div>
    );
};

export default Divider;
