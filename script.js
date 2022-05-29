let xPos = 0;

gsap
  .timeline()
  .set(".ring", {
    rotationY: 180,
    cursor: "grab",
  })
  .set(".img", {
    // apply transform rotations to each image
    rotateY: (i) => i * -36,
    transformOrigin: "50% 50% 500px",
    z: -500,
    // now background image
    backgroundImage: (i) => "url(https://picsum.photos/id/" + (i + 32) + "1/600/400)", // this is the id for the image,
    backgroundPosition: (i) => getBgPos(i),
    backfaceVisibility: "hidden",
  })
  .from(".img", {
    duration: 1.5,
    y: 200,
    opacity: 0,
    stagger: 0.1,
    ease: "expo",
  })
  .add(() => {
    $(".img").on("mouseenter", (e) => {
      let current = e.currentTarget;
      gsap.to(".img", {
        opacity: (i, t) => (t == current ? 1 : 0.5),
        ease: "power3",
      });
    });
    // when we are not holding the image we need to perform this action
    $(".img").on("mouseleave", (e) => {
      gsap.to(".img", {
        opacity: 1,
        ease: "power2.inOut",
      });
    });
  }, "-=0.5");

$(window).on("mousedown touchstart", dragStart);
$(window).on("mouseup touchend", dragEnd);

function dragStart(e) {
  if (e.touches) e.clientX = e.touches[0].clientX;
  xPos = Math.round(e.clientX);
  gsap.set(".ring", {
    cursor: "grabbing",
  });
  $(window).on("mousemove touchmove", drag);
}

function drag(e) {
  if (e.touches) e.clientX = e.touches[0].clientX;

  gsap.to(".ring", {
    // its just some calculation for it to rotate in 360deg
    rotationY: "-=" + ((Math.round(e.clientX) - xPos) % 360),
    onUpdate: () => {
      gsap.set(".img", {
        // if you are wondering what is "i" its the index of the img
        backgroundPosition: (i) => getBgPos(i),
      });
    },
  });

  xPos = Math.round(e.clientX);
}

function dragEnd(e) {
  $(window).off("mousemove touchmove", drag);
  gsap.set(".ring", {
    cursor: "grab",
  });
}
// lets first create the img
function getBgPos(i) {
  //returns the background-position string to create parallax movement in each image
  return 100 - (gsap.utils.wrap(0, 360, gsap.getProperty(".ring", "rotationY") - 180 - i * 36) / 360) * 500 + "px 0px";
}
