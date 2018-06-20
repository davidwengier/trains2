// tslint:disable-next-line:no-reference
/// <reference path ="../types/jquery.d.ts"/>

export class Logo {

    public static InitialiseLogo($container: JQuery): void {
        const outClass = "fadeOutLeft";
        const inClass = "fadeInRight";
        const $asciiLogo: JQuery = $container.find(".ui-ascii-logo");
        $asciiLogo.addClass("animated");

        $asciiLogo.on("mouseover", () => {
            if (!$asciiLogo.hasClass(outClass) && !$asciiLogo.hasClass(inClass)) {
                $asciiLogo.addClass(outClass);
            }
        });

        $asciiLogo.on("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", () => {
            if ($asciiLogo.hasClass(outClass)) {
                $asciiLogo.removeClass(outClass).addClass(inClass);
            } else if ($asciiLogo.hasClass(inClass)) {
                $asciiLogo.removeClass(inClass);
            }
        });
    }
}