// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

function showKendoWindow(options) {
    const {
        container,
        title = 'بدون عنوان',
        width = '600px',
        height = '400px',
        fullscreen = false,
        content = '',
        url = '',
        onClose = null
    } = options;

    if (!container) {
        console.error("❌ container الزامی است!");
        return;
    }

    const $container = (typeof container === 'string') ? $(container) : container;

    if ($container.data('kendoWindow')) {
        $container.data('kendoWindow').destroy();
    }

    function createWindow(contentHtml) {
        $container.html(contentHtml);

        const wnd = $container.kendoWindow({
            title: title,
            width: fullscreen ? window.innerWidth + "px" : width,
            height: fullscreen ? window.innerHeight + "px" : height,
            modal: true,
            visible: false,
            resizable: !fullscreen,
            draggable: !fullscreen,
            close: function (e) {
                if (typeof onClose === 'function') {
                    onClose(e);
                }
            },
            activate: function () {
                if (!fullscreen) {
                    this.center();
                }
            }
        }).data("kendoWindow"); // ← اینجا مطمئنیم که instance ساخته شده است

        wnd.open(); // حالا مطمئناً wnd معتبر است
    }

    if (url) {
        $container.html("<div style='padding:20px;text-align:center;'>در حال بارگذاری...</div>");
        $.get(url)
            .done(function (response) {
                createWindow(response);
            })
            .fail(function () {
                createWindow("<div style='padding:20px;color:red;'>خطا در بارگذاری محتوا از " + url + "</div>");
            });
    } else {
        createWindow(content);
    }
}

function showKendoWindowAsync(options) {
    return new Promise((resolve) => {
        const {
            container,
            title = 'بدون عنوان',
            width = '600px',
            height = '400px',
            fullscreen = false,
            content = '',
            url = '',
            onClose = null
        } = options;

        if (!container) {
            console.error("❌ container الزامی است!");
            resolve();
            return;
        }

        const $container = (typeof container === 'string') ? $(container) : container;

        // پاک‌سازی قبلی
        if ($container.data('kendoWindow')) {
            $container.data('kendoWindow').destroy();
        }

        function createWindow(contentHtml) {
            $container.html(contentHtml);
            $container.css('visibility', 'hidden'); // ⛔️ مانع نمایش لحظه‌ای ناخواسته

            $container.kendoWindow({
                title: title,
                width: fullscreen ? window.innerWidth + "px" : width,
                height: fullscreen ? window.innerHeight + "px" : height,
                modal: true,
                visible: false,
                resizable: !fullscreen,
                draggable: !fullscreen,
                rtl: true, // ✅ فعال‌سازی حالت راست‌چین
                close: function (e) {
                    if (typeof onClose === 'function') {
                        onClose(e);
                    }
                },
                activate: function () {
                    $container.css('visibility', 'visible'); // ⏪ بعد از آماده شدن، قابل مشاهده کن
                    resolve(); // ✅ اطمینان از آماده بودن پنجره
                }
            });

            const wnd = $container.data("kendoWindow");

            if (wnd) {
                if (!fullscreen) wnd.center();
                wnd.open();
            } else {
                console.error("❌ KendoWindow ساخته نشد!");
                resolve();
            }
        }

        if (url) {
            $container.html("<div style='padding:20px;text-align:center;'>در حال بارگذاری...</div>");
            $.get(url)
                .done(function (response) {
                    createWindow(response);
                })
                .fail(function () {
                    createWindow("<div style='padding:20px;color:red;'>خطا در بارگذاری محتوا از " + url + "</div>");
                });
        } else {
            createWindow(content);
        }
    });
}

function closeKendoWindow(container) {
    const $container = (typeof container === 'string') ? $(container) : container;

    if ($container.length === 0) {
        console.warn("🟡 عنصر یافت نشد:", container);
        return;
    }

    const wnd = $container.data("kendoWindow");

    if (wnd) {
        wnd.close();
    } else {
        console.warn("🟡 KendoWindow بر روی این عنصر فعال نیست:", container);
    }
}


function isMobile() {
    const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;
    const isTouchDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isSmallScreen || isTouchDevice;
}


function showNotification(message, type = 'info') {
    let $notif = $("#global-kendo-notification");

    if ($notif.length === 0) {
        // ایجاد عنصر notification اگر وجود ندارد
        $("body").append("<div id='global-kendo-notification'></div>");

        $notif = $("#global-kendo-notification").kendoNotification({
            position: {
                top: 30,
                right: 30
            },
            autoHideAfter: 3000,
            stacking: "down",
            templates: [
                {
                    type: "success",
                    template: "<div class='success-notification'>✔️ #: message #</div>"
                },
                {
                    type: "error",
                    template: "<div class='error-notification'>❌ #: message #</div>"
                },
                {
                    type: "info",
                    template: "<div class='info-notification'>ℹ️ #: message #</div>"
                }
            ]
        });

        $notif = $notif.data("kendoNotification");
    } else {
        $notif = $notif.data("kendoNotification");
    }

    $notif.show({ message }, type);
}
