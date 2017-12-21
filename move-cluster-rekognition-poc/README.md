Need to update the below code to opne info window for google map marker click
{props.isOpen && props.mUkey == marker.ukey && <InfoWindow onCloseClick={props.onToggleOpen}>
          <div>
            {props.ukey + "Price: $" + marker.priceDisplay + '\n' + " Address: " + + marker.address}

            <img style={{width:'200px', height:'100px'}} src={'https://ap.rdcpix.com/1913052444/031c7173fa5b5ec51dee95e77470c1d8l-m0xd-w480_h480_q80.jpg'} />
          </div>
          </InfoWindow>}