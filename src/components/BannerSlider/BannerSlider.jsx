import React from "react";
import HeroSlider from "hero-slider/dist/HeroSlider";


function BannerSlider() {
    const slide1 = 'https://media.discordapp.net/attachments/1087951220313956486/1100320518256730142/Discount.png?width=1440&height=338' [
      {
        title: "Slide 1",
        subtitle: "Subtitle for slide 1",
        image: "https://media.discordapp.net/attachments/1087951220313956486/1100320518256730142/Discount.png?width=1440&height=338",
        button: {
          text: "Button 1",
          link: "#"
        }
      },
      {
        title: "Slide 2",
        subtitle: "Subtitle for slide 2",
        image: "",
        button: {
          text: "Button 2",
          link: "#"
        }
      },
      {
        title: "Slide 3",
        subtitle: "Subtitle for slide 3",
        image: "",
        button: {
          text: "Button 3",
          link: "#"
        }
      }
    ];
  
    return (
      <BannerSlider
        slidingAnimation="fade"
        orientation="horizontal"
        style={{
          backgroundColor: "#FFF"
        }}
        settings={{
          slidingDuration: 500,
          slidingDelay: 100,
          shouldAutoplay: true,
          shouldDisplayButtons: true,
          shouldDisplaySlideInfo: true,
          autoplayDuration: 5000,
          height: "calc(100vh - 70px)"
        }}
      >
        {slides.map((slide, index) => (
          <Slide
            key={index}
            background={{
              backgroundImage: slide.image
            }}
          >
            <div className="hero-text">
              <h1>{slide.title}</h1>
              <h2>{slide.subtitle}</h2>
              <a href={slide.button.link} className="hero-button">
                {slide.button.text}
              </a>
            </div>
          </Slide>
        ))}
      </BannerSlider>
    );
  }
  export default BannerSlider;
  
  
  
  
  