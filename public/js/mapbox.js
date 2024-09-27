/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiY29sbGluc3R5ayIsImEiOiJjbTB4cjA1aWMwZGRqMnNzNm1leW5ubnVwIn0.WHf7LKe1Ca5gHbZel1hKdw';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/collinstyk/cm0xtgyg1010d01pbepbk66ka',
    scrollZoom: false,
    //   center: [-118.113491, 34.111745],
    //   zoom: 10,
    //   interactive: false,
  });

  // The bounds is the area that will be displayed on the map.
  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    // eslint-disable-next-line no-new
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 150, left: 100, right: 100 },
  });
};
