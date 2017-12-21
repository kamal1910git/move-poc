var React = require('react/addons');
var GoogleMapLib = require('react-google-maps');
var GoogleMap = GoogleMapLib.GoogleMap;
var Marker = GoogleMapLib.Marker;
var InfoWindow = GoogleMapLib.InfoWindow;

var GoogleMapReact = React.createClass({
  getInitialState: function() {
    return {
      markers: []
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var markers = nextProps.items.map(function(item, i) {
      return {
        icon: '/public/img/marker-blue.png',
        position: {
          lat: item.lat,
          lng: item.lon
        },
        item: item
      }
    }.bind(this));

    this.setState({ markers: markers });
  },

  render: function() {
    var containerProps = {
      className: 'items-map'
    };

    return (
      <GoogleMap containerProps={containerProps}
                 defaultZoom={13}
                 defaultCenter={this.props.center}>
        <Marker icon={'/public/img/pin-orange.png'} position={this.props.center} />
        {this.state.markers.map(function(marker, i) {
          var ref = 'marker_' + i;
          return (
            <Marker key={ref} ref={ref}
                    icon={marker.icon}
                    position={marker.position}
                    onMouseover={this._onMarkerMouseOver.bind(this, i)}
                    onMouseout={this._onMarkerMouseOut.bind(this, i)}>
              {marker.showInfo ? this._renderInfoWindow(ref, marker) : null}
            </Marker>
          );
        }.bind(this))}
      </GoogleMap>
    );
  },

  _renderInfoWindow: function(ref, marker) {
    return (
      <InfoWindow key={ref + '_info_window'}>
          <p>Test</p>
      </InfoWindow>
    );
  },

  _onMarkerMouseOver: function(index, event) {
    var update = {};
    update[index] = {
      $merge: {
        icon: '/public/img/marker-orange.png',
        showInfo: true
      }
    };

    var changedMarkers = React.addons.update(this.state.markers, update);
    this.setState({ markers: changedMarkers });
  },

  _onMarkerMouseOut: function(index, event) {
    var update = {};
    update[index] = {
      $merge: {
        icon: '/public/img/marker-blue.png',
        showInfo: false
      }
    };

    var changedMarkers = React.addons.update(this.state.markers, update);
    this.setState({ markers: changedMarkers });
  }
});

module.exports = GoogleMapReact;