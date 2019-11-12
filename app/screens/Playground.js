
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import ImageCollage from '../components/ImageCollage.js';
import { MAPS_API_KEY } from '../config/settings.js';

// hardcoded dummy data; this is what the data will actually look like
const DATA = [
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [33.790648, -84.384635]
    },
    properties: {
      placeId: 'ChIJzal6QUUE9YgRYZqYJzKOXAo',
      mainText: 'Museum of Design Atlanta',
      secondaryText: 'Peachtree Street Northeast, Atlanta, GA, USA',
      photoRefs: [
        'CmRaAAAArfg8qF1oPtvFj18kTkcVbIDtR3Arm04aoHSbno1GNaeEOLANbECjkVf_4SmLdo7uVs7SfD71XjrSbMoEHBZm8EZc53WCXPxNlGxC6b2-DRqxRI0BEZrs5yXQ-HVTjObrEhD5ekbW-N2N1DCujiI1nYgXGhQXIEURuVaLx2_N_nZUGIpmiPyCSA',
        'CmRaAAAApMwKX8N6EhXmxuytk8uqqz4XZwQYDHVDgk8XMigwwu4MnSuGnbbnPb6fCp1LaiOJXkx61D1s7M4kdAibCTy4wug3MTpEFGOAT_wHao1B-2mTF3GTU6gWG-0agXGE2qzkEhCNWHKzJ-OHG2iKfjAhIDo0GhQnmSb2pTi3XIMz00TAXpbHPbvUrQ',
        'CmRaAAAA_RFTA6jpX2KiHBW7SWRCkzCYEUnb27xDvA2UZGAZtKvQLAZRT-zbHL4FRlAg86q6CalB-6C9PBGa5y8PLLEBzMSodtmQBeNwTjb4Zb6QDDY3qNo3eYWrV5I8XWZM2BGCEhB86xeYE6mruzEeiFC0xVx9GhQ2jqq80jNH_smOex63RQCmh-GkcA',
        'CmRaAAAAwpvEMIuqhMPV3zlYk3_1Lnurfv6G636fXQjgHnuySgie5_K-pIeS8FnPWcU0L4JlxeqZC480YtGR36KcuoAPE7H6rP03SAYNTAqwWNrbJm6v7_llTHMolcj5W0n_puDsEhAXbKPL8JBmkPzGNgImSjj6GhRbeGfEAc8-933-sM5tcHkDhA9TNA',
      ],
      note: 'Really cool museum! Would definitely recommend!',
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [33.7949046, -84.4147967]
    },
    properties: {
      placeId: 'ChIJr3p2s-cE9YgR2uIvhPLls3E',
      mainText: 'Urban Tree Cidery',
      secondaryText: 'Howell Mill Road Northwest, Atlanta, GA, USA',
      photoRefs: ['CmRaAAAAN1JSSlKydw6W6-7_eeuYOkJzvVBTW5LBaW0W1sxPnyhkZPKbP4PEbqoPXRU5Q9MHJXBOFzOEJl8KBvB64bI3xtnCOeh9RaUihdBq3-Bi3fOPopG33WVW8avzEZrJ0Dq-EhA4tZV5xpLQP_yEaMXFLzfOGhTeLYBn2z2mW3VmvlOCbUEucED2gg'],
      note: 'Chill, unpretentious vibes',
    }
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
});

class Playground extends Component {

  render() {
    const uris = DATA[0].properties.photoRefs.map(ref => `https://maps.googleapis.com/maps/api/place/photo?key=${MAPS_API_KEY}&photoreference=${ref}&maxheight=800&maxWidth=1000`)
    return (
      <View style={styles.container}>
        <ImageCollage uris={uris} />
      </View>
    );
  }
}

export default Playground;