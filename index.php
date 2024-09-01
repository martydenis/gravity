<!DOCTYPE html>
<html lang="en">
    <head>
        <base href="<?php echo !empty($route['path']) ? '/' . $route['path'] : './' ?>">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet" media="screen">
        <link rel="icon" type="image/svg" href="/favicon.svg" />
        <link rel="stylesheet" type="text/css" href="./sandbox-utils/style.css" media="screen" />
        <link rel="stylesheet" type="text/css" href="./css/app.css" media="screen" />
        <title>Gravity</title>
    </head>
    <body>
        <canvas id="canvas" width="400" height="400"></canvas>

        <button class="controls__toggler-button controls--open js-controls-toggler js-stop-propagation">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-help-circle">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
        </button>
        <button class="controls__toggler-button controls--closed js-controls-toggler js-stop-propagation">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>

        <div id="controls__panel" class="js-controls-toggler js-stop-propagation">
            <ul>
                <li>
                    <svg width="22" height="32" viewBox="0 0 22 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.75" y="0.75" width="20.5" height="30.5" rx="10.25" stroke="currentColor" stroke-width="1.5" />
                        <path d="M10 15H5.00691C4.45463 15 4.00691 14.5523 4.00691 14V13.0333C4.00691 13.0111 4.00634 12.992 4.00529 12.9698C3.9823 12.4828 3.80705 6.23656 9.81646 4.30559C10.4173 4.11251 11 4.58892 11 5.22004V14C11 14.5523 10.5523 15 10 15Z" fill="currentColor" />
                    </svg>

                    <p>
                        <strong>Tap / Left click</strong>
                        anywhere to make the balls jump
                    </p>
                </li>
            </ul>

            <p><a href="#" class="controls__panel__link">Close</a></p>
        </div>

        <script type="module" src="./js/app.js"></script>
    </body>
</html>
