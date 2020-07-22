<template>
    <div>
        <div v-if="mapa.edit.index >= 0">
            <h2>Modo Editar</h2>
            <b-form-group label="Opcion de click" v-if="mapa.edit.tipo ===1">
                <b-form-radio v-model="delPoint" name="some-radios" :value="true">Borrar esquinas con click</b-form-radio>
                <b-form-radio v-model="delPoint" name="some-radios" :value="false">Agregar esquinas con click</b-form-radio>
            </b-form-group>
            <b-form-group label="Ajustar Radio" v-if="mapa.edit.tipo ===2">
                <b-form-input id="range1" v-model="mapa.edit.item.radius" type="range" :min="100" :max="20000" :step="1"></b-form-input>
                <div class="mt-2">Valor: {{ mapa.edit.item.radius }} metros</div>
            </b-form-group>
        </div>
        <gmap-map
                :center="center"
                :zoom="12"
                style="width:100%;  height: 600px;"
                @click="(mapa.edit.index >= 0) && (!delPoint) &&(addPointToEdit({lat:$event.latLng.lat(),lng:$event.latLng.lng()}))"
        >

            <GmapCircle
                    v-if="mapa.edit.index >= 0 && (mapa.edit.tipo === 2)"
                    :center="mapa.edit.item.center"
                    :radius="parseInt(mapa.edit.item.radius)"
                    :options="{fillColor:'blue',fillOpacity:0.3}"
            ></GmapCircle>
            <GmapPolygon
                    v-if="mapa.edit.index >= 0 && (mapa.edit.tipo === 1)"
                    :paths="mapa.edit.item.puntos"
            ></GmapPolygon>
            <template
                    v-if="mapa.edit.index >= 0 && (mapa.edit.tipo === 1)"
            >
                <gmap-marker
                        v-for="(item,index) in mapa.edit.item.puntos"
                        :key="index+1"
                        :position="item"
                        :draggable="true"
                        @click="delPoint && ($emit('delPoint',index))"
                        @dragend="editPointFinish(index,{lat:$event.latLng.lat(),lng:$event.latLng.lng()})"
                ></gmap-marker>
            </template>
            <template
                    v-for="(pin, index) in mapa.circles"
            >
                <GmapCircle
                        v-if="pin.show && mapa.edit.index < 0"
                        :key="index+1"
                        :center="pin.center"
                        :radius="pin.radius"
                        :options="{fillColor:'red',fillOpacity:0.3}"
                ></GmapCircle>
                <gmap-marker
                        :key="'center'+index+1"
                        v-if="pin.show && mapa.edit.index < 0"
                        :position="pin.center"
                ></gmap-marker>
            </template>
            <template
                    v-for="(sucursal,index) in mapa.sucursales"
            >
                <GmapPolygon
                        v-if="sucursal.show && mapa.edit.index < 0"
                        :key="sucursal.IdSucursal"
                        :paths="sucursal.puntos"
                ></GmapPolygon>
                <gmap-marker
                        v-if="sucursal.show && mapa.edit.index < 0"
                        :key="'mark'+index+1"
                        :position="sucursal.center"
                        :hidden="!sucursal.show"
                ></gmap-marker>
            </template>
        </gmap-map>
    </div>
</template>

<script>
    import distToSegment from "@/point-to-line-2d"
    export default {
        name: "GoogleMap",
        props:['mapa'],
        data() {
            return {
                // default to Montreal to keep it simple
                // change this to whatever makes sense
                center: { lat: -25.2829747, lng: -57.6383165 },
                markers: [],
                circles: [],
                places: [],
                currentPlace: null,
                delPoint: false,
            };
        },

        mounted() {
            this.geolocate();
        },
        methods: {
            addPointToEdit(latLng){
                console.log(latLng)
                let index = this.findNearestPoint(latLng,this.mapa.edit.item.puntos);
                this.$emit('addPointToEdit',index,latLng)
            },
            editPointFinish(index,latLng){
                console.log("index "+index+" cambio a "+latLng.lat)
                this.$emit('editPoint',index,latLng)
            },
            clickCircle(index){
                console.log(index);
            },
            // receives a place object via the autocomplete component
            setPlace(place) {
                this.currentPlace = place;
            },
            addMarker() {
                if (this.currentPlace) {
                    const marker = {
                        lat: this.currentPlace.geometry.location.lat(),
                        lng: this.currentPlace.geometry.location.lng()
                    };
                    this.markers.push({ position: marker });
                    this.places.push(this.currentPlace);
                    this.center = marker;
                    this.currentPlace = null;
                }
            },
            geolocate: function() {
                navigator.geolocation.getCurrentPosition(position => {
                    this.center = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                });
            },findNearestPoint(test, target) {
                let indexsel = 0;
                let distance = -1;
                for (let i = 0; i < target.length; i++) {
                    let point = target[i];
                    let segmentPoint = i + 1;
                    if (segmentPoint >= target.length) {
                        segmentPoint = 0;
                    }
                    let currentDistance = distToSegment([test.lat,test.lng], [point.lat,point.lng], [target[segmentPoint].lat,target[segmentPoint].lng]);
                    if (distance === -1 || (currentDistance < distance)) {
                        distance = currentDistance;
                        indexsel = segmentPoint;
                    }
                }
                return indexsel;
            }
        }
    };
</script>