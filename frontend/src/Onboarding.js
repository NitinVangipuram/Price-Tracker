import React, { useState, useEffect } from 'react';
import SwiperCore from 'swiper';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

SwiperCore.use([Pagination]);

function Onboarding() {
    
    return (
      <div className="onboarding">
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          pagination={{ clickable: true }}
          parallax={true}
          speed={600}
          autoplay={{ delay: 3500 }}
          loop={true}
          grabCursor={true}
        >
          <SwiperSlide>
            <div className="slide-image">
              <img src="https://raw.githubusercontent.com/ismailvtl/ismailvtl.github.io/master/images/cloud-storage.png" alt="First Slide" />
            </div>
            <div className="slide-content">
              <h2>Turn your ideas into reality.</h2>
              <p>Consistent quality and experience across all platforms and devices</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide-image">
              <img src="https://raw.githubusercontent.com/ismailvtl/ismailvtl.github.io/master/images/startup-launch.png" alt="Second Slide" />
            </div>
            <div className="slide-content">
              <h2>Turn your ideas into reality.</h2>
              <p>Consistent quality and experience across all platforms and devices</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="slide-image">
              <img src="https://raw.githubusercontent.com/ismailvtl/ismailvtl.github.io/master/images/cloud-storage.png" alt="Third Slide" />
            </div>
            <div className="slide-content">
              <h2>Turn your ideas into reality.</h2>
              <p>Consistent quality and experience across all platforms and devices</p>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    );
  }
  
  export default Onboarding;