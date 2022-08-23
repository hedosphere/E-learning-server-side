export const randomnumber = async (maxi = 15) => {
  let initial = "f";
  const between = (min, max) => {
    let k = "";
    let y = Math.floor(Math.random() * (max - min) + min);
    k = alphabetGenerator(y);
    return k;
  };

  if (maxi >= 15) {
    let decided = between(1, 11);
    if (decided == 1) maxi = 25;
    else if (decided == 2) {
      maxi = 16;

      initial = "a";
    } else if (decided == 2) {
      maxi = 17;
      initial = "a";
    } else if (decided == 3) {
      maxi = 18;
      initial = "y";
    } else if (decided == 4) {
      maxi = 19;
      initial = "z";
    } else if (decided == 5) {
      maxi = 20;
      initial = "P";
    } else if (decided == 6) {
      maxi = 21;
      initial = "S";
    } else if (decided == 7) {
      maxi = 22;
      initial = "k";
    } else if (decided == 8) {
      maxi = 23;
      initial = "O";
    } else if (decided == 9) {
      maxi = 24;
      initial = "Q";
    } else if (decided == 10) {
      maxi = 25;
      initial = "b";
    } else if (decided == 11) {
      maxi = 26;
      initial = "A";
    } else {
      maxi = maxi;
      initial = initial;
    }
    // console.log("Shord code length ", maxi, " from ", decided);
  }

  if (!typeof "p" === "String") {
    console.log("i am a string");
  }
  let text = "";
  let i = 1;

  do {
    i++;
    text = text + between(1, 64);
  } while (i < maxi);

  //   console.log(text);
  //

  return new Promise((resolve, reject) => {
    resolve(initial + text);
  });
};

const alphabetGenerator = (number) => {
  //  max 40
  let k = "";
  if (number == 26) {
    k = "a";
  } else if (number == 27) {
    k = "b";
  } else if (number == 28) {
    k = "c";
  }
  //
  else if (number == 29) {
    k = "e";
  }

  //
  //
  else if (number == 30) {
    k = "f";
  }

  //
  //
  else if (number == 31) {
    k = "g";
  }

  //
  //
  else if (number == 32) {
    k = "h";
  }

  //
  //
  else if (number == 33) {
    k = "i";
  }

  //
  //
  else if (number == 34) {
    k = "j";
  }

  //
  //
  else if (number == 10) {
    k = "l";
  }

  //
  //
  else if (number == 11) {
    k = "m";
  }

  //
  //
  else if (number == 12) {
    k = "n";
  }

  //
  //
  else if (number == 13) {
    k = "o";
  }

  //
  //
  else if (number == 14) {
    k = "d";
  }

  //
  //
  else if (number == 15) {
    k = "p";
  }

  //
  //
  else if (number == 16) {
    k = "q";
  }

  //
  //
  else if (number == 17) {
    k = "r";
  }

  //
  //
  else if (number == 18) {
    k = "s";
  }

  //
  //
  else if (number == 19) {
    k = "t";
  }

  //
  //
  else if (number == 20) {
    k = "u";
  }

  //
  //
  else if (number == 21) {
    k = "v";
  }

  //
  //
  else if (number == 22) {
    k = "w";
  }

  //
  //
  else if (number == 25) {
    k = "x";
  }

  //
  //
  else if (number == 23) {
    k = "y";
  }

  //
  //
  else if (number == 24) {
    k = "z";
  }

  //

  //
  else if (number == 35) {
    k = "-";
  }

  //
  //
  else if (number == 36) {
    k = "_";
  }

  //
  //
  else if (number == 37) {
    k = "0";
  }

  //
  //
  else if (number == 38) {
    k = "A";
  }

  //
  //
  else if (number == 39) {
    k = "B";
  }

  //
  //
  else if (number == 40) {
    k = "C";
  }

  //
  else if (number == 41) {
    k = "D";
  }

  //
  else if (number == 42) {
    k = "E";
  }
  //
  else if (number == 43) {
    k = "F";
  }

  //
  //
  else if (number == 44) {
    k = "_";
  }

  //
  //
  else if (number == 45) {
    k = "G";
  }

  //
  //
  else if (number == 46) {
    k = "H";
  }

  //
  //
  else if (number == 47) {
    k = "I";
  }

  //
  //
  else if (number == 48) {
    k = "J";
  }

  //
  //
  else if (number == 49) {
    k = "L";
  }

  //
  //
  else if (number == 50) {
    k = "M";
  }

  //
  //
  else if (number == 51) {
    k = "N";
  }

  //
  //
  else if (number == 52) {
    k = "O";
  }

  //
  //
  else if (number == 53) {
    k = "D";
  }

  //
  //
  else if (number == 54) {
    k = "P";
  }

  //
  //
  else if (number == 55) {
    k = "Q";
  }

  //
  //
  else if (number == 56) {
    k = "R";
  }

  //
  //
  else if (number == 57) {
    k = "S";
  }

  //
  //
  else if (number == 58) {
    k = "T";
  }

  //
  //
  else if (number == 59) {
    k = "U";
  }

  //
  //
  else if (number == 60) {
    k = "V";
  }

  //
  //
  else if (number == 61) {
    k = "W";
  }

  //
  //
  else if (number == 62) {
    k = "X";
  }

  //
  //
  else if (number == 63) {
    k = "Y";
  }

  //
  //
  else if (number == 64) {
    k = "Z";
  } else {
    k = number;
  }
  return k;
};
