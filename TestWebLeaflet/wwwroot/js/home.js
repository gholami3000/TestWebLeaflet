
let isAddingMarker = false;
let lat;
let lng;

const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    // iconSize: [25, 41],
    // iconAnchor: [12, 41],
    // popupAnchor: [1, 20],
    // shadowSize: [41, 41]
});

const greenIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    // iconSize: [25, 41],
    // iconAnchor: [12, 41],
    // popupAnchor: [1, 20],
    // shadowSize: [41, 41]
});

const markerMap = {};  // key: id (GUID), value: marker
const map = L.map('map').setView([35.6892, 51.3890], 13);
const mapContainer = map.getContainer(); // عنصر DOM نقشه

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);




document.addEventListener("DOMContentLoaded", function () {

    const trash = document.getElementById('trash');
    const mapContainer = map.getContainer();

    map.on('click', function (e) {
        //const tooltipText = prompt("لطفاً عنوان مارکر را وارد کنید:");

        // اگر کاربر Cancel زد یا چیزی وارد نکرد، مارکر ساخته نشود
        if (isAddingMarker == false) {
            return;
        } 
        isAddingMarker = false;
        mapContainer.classList.remove('adding-marker-cursor'); // بازگشت نشانگر ماوس
        const markerId = generateGUID();  // ساخت GUID
        //const tooltipText = document.getElementById('tooltipInput').value || 'بدون عنوان';
        // const marker = L.marker(e.latlng, { draggable: true }).addTo(map);

        const marker = L.marker(e.latlng,
            {
                draggable: true,
                //icon: greenIcon
            })
            .addTo(map)
            .bindTooltip(`جهت افزودن اطلاعات کلیک کنید`, {
                permanent: false,   // false یعنی فقط هنگام hover نمایش داده شود
                direction: 'top'    // موقعیت نسبت به مارکر (top, bottom, left, right)
            });

        marker.customId = markerId;
        markerMap[markerId] = marker;  // ذخیره در دیکشنری
        console.log("مارکر با GUID:", markerId);

        marker.on('drag', function (event) {
            const latlng = event.target.getLatLng();
            const point = map.latLngToContainerPoint(latlng);
            const mapRect = mapContainer.getBoundingClientRect();
            const trashRect = trash.getBoundingClientRect();

            const absX = mapRect.left + point.x;
            const absY = mapRect.top + point.y;

            const insideTrash =
                absX >= trashRect.left &&
                absX <= trashRect.right &&
                absY >= trashRect.top &&
                absY <= trashRect.bottom;

            if (insideTrash) {
                trash.classList.add('active');
            } else {
                trash.classList.remove('active');
            }
        });

        marker.on('dragend', function (event) {
            const latlng = event.target.getLatLng();
            const point = map.latLngToContainerPoint(latlng);
            const mapRect = mapContainer.getBoundingClientRect();
            const trashRect = trash.getBoundingClientRect();

            const absX = mapRect.left + point.x;
            const absY = mapRect.top + point.y;

            const insideTrash =
                absX >= trashRect.left &&
                absX <= trashRect.right &&
                absY >= trashRect.top &&
                absY <= trashRect.bottom;

            trash.classList.remove('active');

            if (insideTrash) {
                map.removeLayer(marker);
            }
        });

        /////////////////
        marker.on('click', async function (e) {
             lat = e.latlng.lat;
             lng = e.latlng.lng;
            console.log(e);
            console.log(`lat ${lat}`);
            console.log(`lng ${lng}`);

            //alert("show form");       
            // alert(`ID این مارکر: ${this.customId}`);
            // removeMarkerById(`${this.customId}`);
            var currentId = `${this.customId}`;
            // makeMarkerBlink(currentId);
            await ShowAdd();

        });
        ///////////////////

    });


});


function addDraggableMarker(map, lat, lng, options = {}) {
    const {
        tooltipText = 'جهت افزودن اطلاعات کلیک کنید',
        icon = null,
        onClick = null,
        onDragEnd = null
    } = options;

    const latlng = L.latLng(lat, lng);

    const marker = L.marker(latlng, {
        draggable: true
        //icon: icon || undefined
    }).addTo(map);

    marker.bindTooltip(tooltipText, {
        permanent: false,
        direction: 'top'
    });

    //if (typeof onClick === 'function') {
    //    marker.on('click', onClick);
    //}

    //if (typeof onDragEnd === 'function') {
    //    marker.on('dragend', onDragEnd);
    //}

    marker.on('contextmenu', function (e) {

        //e.originalEvent.preventDefault();

        //if (!contextMenu) {
        //    console.error("❌ contextMenu تعریف نشده!");
        //    return;
        //}

        //$("#marker-context-menu").data("attachedMarker", marker);

        //contextMenu.popup.wrapper
        //    .css({
        //        top: e.originalEvent.pageY,
        //        left: e.originalEvent.pageX,
        //        display: "block"
        //    })
        //    .show();

        ////// نمایش منو در موقعیت کلیک
        //const menu = $("#marker-context-menu").data("kendoContextMenu");

        //// اتصال مارکر به منو
        //$("#marker-context-menu").data("attachedMarker", marker);

        //// موقعیت دادن دستی به منو
        //contextMenu.popup.wrapper
        //    .css({
        //        top: e.originalEvent.pageY,
        //        left: e.originalEvent.pageX,
        //        display: "block"
        //    })
        //    .show();

        // جلوگیری از منوی پیش‌فرض مرورگر
       // e.originalEvent.preventDefault();
    });


    return marker;
}

function removeMarkerById(id) {

    const marker = markerMap[id];
    if (marker) {
        map.removeLayer(marker);   // حذف از نقشه
        delete markerMap[id];      // حذف از حافظه
        console.log(`مارکر با ID ${id} حذف شد`);
    } else {
        console.warn(`مارکری با ID ${id} یافت نشد`);
    }
}


function makeMarkerBlink(id) {
    const marker = markerMap[id];
    if (!marker) return;

    // ساخت آیکن چشمک‌زن
    const blinkingIcon = L.divIcon({
        className: 'blinking-icon',
    });

    marker.setIcon(blinkingIcon);

}

function stopBlinking(id) {

    const marker = markerMap[id];
    if (!marker) return;

    // مثلاً آیکن معمولی دایره آبی
    const normalIcon = L.divIcon({
        className: '',
        html: '<div style="width:20px;height:20px;background:#3388ff;border-radius:50%;border:2px solid white;"></div>'
    });
    marker.setIcon(normalIcon);
}


function generateGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

document.body.addEventListener('click', function (e) {
    if (e.target && e.target.id === 'addMarker') {
        isAddingMarker = true;
       
        document.body.classList.add('adding-marker');
        mapContainer.classList.add('adding-marker-cursor');

       // document.body.classList.add('adding-marker'); // تغییر نشانگر ماوس
       // alert("🖱 روی نقشه کلیک کنید تا مارکر اضافه شود.");
    }
});


async function ShowAdd() {
    await showKendoWindowAsync({
        container: '#window1',
        title: 'ثبت',
        url: '/Home/ShowAddLocation',
        fullscreen: isMobile()
    });

}

