import React, { useState } from 'react'
import MapPicker from 'react-google-map-picker'
import { THandleInputChange } from '../../../../../types/components/common'

interface ILatLngTuple {
  lat: number
  lng: number
}
enum MapTypeId {
  Roadmap = 'roadmap',
  Satellite = 'satellite',
  Hybrid = 'hybrid',
  Terrain = 'terrain',
}

const DefaultLocation: ILatLngTuple = { lat: 40.7128, lng: 74.006 }
const DefaultZoom = 3

interface IProps {
  Latitude: ILatLngTuple['lat']
  Longitude: ILatLngTuple['lng']
  handleInputChange?: THandleInputChange
}

const ScheduleItemMapForm: React.FC<IProps> = ({ Latitude, Longitude, handleInputChange }) => {
  const [defaultLocation, setDefaultLocation] = useState<ILatLngTuple>({
    lat: Latitude || DefaultLocation.lat,
    lng: Longitude || DefaultLocation.lat,
  })

  const [zoom, setZoom] = useState<number>(DefaultZoom)

  function handleChangeLocation(lat: number, lng: number) {
    if (handleInputChange) {
      handleInputChange('Latitude', lat)
      handleInputChange('Longitude', lng)
    }
  }

  function handleChangeZoom(newZoom: number) {
    setZoom(newZoom)
  }

  function handleResetLocation() {
    setDefaultLocation(DefaultLocation)
    setZoom(DefaultZoom)
  }

  return (
    <MapPicker
      defaultLocation={defaultLocation}
      zoom={zoom}
      mapTypeId={MapTypeId.Roadmap}
      style={{ height: '400px' }}
      onChangeLocation={handleChangeLocation}
      onChangeZoom={handleChangeZoom}
      apiKey="AIzaSyD07E1VvpsN_0FvsmKAj4nK9GnLq-9jtj8"
    />
  )
}

export default ScheduleItemMapForm
