import { trigger, style, transition, animate, state } from '@angular/animations';

export const fadeLeftIn = trigger(
    'fadeState',
    [
        state('inactive', style({
            opacity: 0,
            display: 'none'
        })),
        state('active', style({
            opacity: 1,
            display: 'block'
        })),
        // transition('active => inactive', [
        //     animate('0.1s ease-in-out', style({
        //         display: 'none',
        //         opacity: 0,
        //         transform: 'translateX(100%)'
        //     }))
        // ]),
        // transition('inactive => active', [
        //     style({
        //         transform: 'translateX(100%)'
        //     }),
        //     animate('0.1s ease-in-out', style({
        //         opacity: 1,
        //         display: 'block',
        //         transform: 'translateX(0)'
        //     }))
        // ])
    ]
);
