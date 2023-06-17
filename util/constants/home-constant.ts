interface SampleArtist {
  _id?: string;
  name: string;
  username?: string;
  profile_image_url: string;
}

export const sampleArtists: SampleArtist[] = [
  {
    name: "Yuri",
    profile_image_url:
      "https://yt3.googleusercontent.com/y8A5f7w0RIwm7xfvWnBoNbz8FPTS7olwGszIEngav5ILFkg70Zg4E7fR57ke2_XIp0kmhtd2l-Q=s900-c-k-c0x00ffffff-no-rj",
  },
  {
    name: "Puuung",
    profile_image_url:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdKEZlwEZN4rK9dgY39stUAbY18ftkJkAvsw&usqp=CAU",
  },
  {
    name: "Studio Ghibli",
    profile_image_url:
      "https://i.pinimg.com/236x/e6/6c/4c/e66c4cd448b84a6c6c7538c53901806d.jpg",
  },
  {
    name: "Disney+",
    profile_image_url:
      "https://pbs.twimg.com/profile_images/1633379337675345920/evM4ZOQA_400x400.jpg",
  },
  {
    name: "Pixar",
    profile_image_url:
      "https://pbs.twimg.com/profile_images/1605260876012916736/x1cpb1ey_400x400.png",
  },
  {
    name: "Dreamworks",
    profile_image_url:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAolBMVEUJLm7///8AAF8AKGsAImkALG0AKmwAGmYAJWoAGGUAK20AAGAAH2gAIWgABmAADWIAFWQAHGYAD2IACmGutMaIkaxPX4rb3uXW2eKbo7lfbZO9wtBFV4UABWDr7fFVZI2RmrJ8hqRzf5/19vilq7+8wc/JzdkgO3UwRnsAAFWDjanO0dxaaZA3S37k5uygp7wWNXIpQXk/UoJpdpl0gKAAAE8g/RSrAAAUNElEQVR4nM1d6WKqOhDGQAQUERF3pSouPW516X3/V7uAG0vCJCFqv5/nlJaPJLPPRKm8HH5v5Q06v8Pu+Xt9VBTluP4+d4e/nYG36vmv//PKK395bzm9nCa2a+qWZqgqxsoVGKuqoVm66dqT02W67L3yJV7F8ODN9sjVLaOqFKNqWLqL9jPv8KI3eQXD3mKot3Xtyg2rRrhcVzQ0w1AxkacWPjFcvGIxZTMMRnOj3TIiYpbptOuN03j4u+lMp4PBdNqZzYfjdavedsLFzTM1Wm1jvgwkv5FUhoH3VTc1bFiO7Zzng2WfIkgOWy88oHVX19QMSWyY9S9PKkmJDJdfSDc03W4MBysmGdnzNnvkWFmWqo66nrzXksVwO2+bLb1+nC05JcZ2OkaOltmyqtmebyW9mRyGi7XtuM2hJ6jeRjOt2UiTxEZzvZDybhIYHmZ129Zmq1K/pN9R3cxK4tZkJkGFlGbY302QM5Oxpba/rpk+k1hDu37ZX1uS4Xb8D+1GZV/iAe880TIaZDIu+fVKMeyf/2kDuaZlb163MlLHHpdaxxIMD93/zsTl8w/91Wjped5yudr2fE7tFkydVvpAquirxHkUZhhc/rtkjCx/63Uue2NiN13HNPUQpuO4bWSedhtvy0F00Gpl9iqaC1sBogwH/zbJv3nwNuPQkNEbJLsTV42G7tSN4YD5SA2czF7VmgPBNxVjuNUS/A7e0AoNbbJJnVJxljvp/jBa1526kX7aXIuJHBGGwW724LfdKLZuUDgRoLbaSodJcvhDlPa8qugi8LIiDL3LXXxuZ7rbqLHTu6LWaB+ZJHD/ZKb3hdYSUEzcDIPNbQX8aWiF8LK7k7TQjmXPDeoZE8Ae8r4vN8PVzeofdZEFHbxChHYngwPhj93MMlq81iEnw+C6uxaKm/V5+FF1MANHb5JZRrR5KcOY5dTRuQ8fETXnuAT/nL/X00/p31xmFD/DadMiv68QR3cPa48Oytg4TZ6dysswVMWljl8OVfQL/tFVxudQUOdVDJeqTn7PMrAsUAcE35l943y9hGFv78pdvxvwBFblFzf9jLZmPYwcDGeovPykoKGCZs4ApR9RdUbzj5nhSpUoYHKoIdCwHmXkDUZs8oaV4Ry9ZIM+4e6gV+g3sxSZYo5sDHvKKxfwisYacgEP2dAqvPCsDH9evYAx1BZ0snwjQ9GeymG4c8mvJBu1OmSN+2qGYhNWjDBDf914D8EQCNKMfjZbB1MEGfYl2NjMwAiyU/2sSdyENirEcPmWI/gEuIqHduYJGxA3AMOsnn0DRUjLbbOvBCiNYoYd+90EwxeGJOoyR7HwoxQy3DTfT1DBDmRxdpzME4UfpYhh5xMEQ714BBhWdpn4EDYLPkoBw2n2TL8LWheieMzoDHUtwnDxdiHzgAkpuUM9I+E1ur9IZbj6HEEGgepl95dD/Sg0hrmv9FZgB7LCh9lQLfWjUBgGYBbitTDGAMNKrh6nSZE2FIZjjlTES+BAZQo5xa9+8zDsmB+hlQCuQ1pxnnUIdHKomMgw930+ABXcp63sPiUfRSJDySFRMbhQjGKZdVuxxcowJ6c+AtwCGFbOWb9OI2WmCAxHHzC3SbCgFEwvd5hsgu9FYJjb358CAoVNdrOR1j3PMCejPgYDSof69ewjWj56nmPY/wNy9A7QVdzkVgPlglk5hmuoMPuNMKD8SzDJnqhqzsvIMvz5uK5PQmARzZ9ihsGbQqOMAE9ikDtTuJkx2jMMf/+MmLmCX5wq2ryI4eEPiZkYDUgnEt4Ypcv80gx3n3YpcnABhpVuLmCdkU8phn9JU9ygQ9bpyMk9g1Lp1hTD8RsD+IxQ99Ai5n31tFuSZLidfIIDgDpUPDvNpzbtpNpPMry8LlEvDguKu/n5o5VaxNQu3Xbrf44jBrNjhLOVPImZ5/t/j2MTKtPw8jU+RqIo4MnwoMa5u/7Y/lscwW2at2tSOvHJcNa61Qpuv105hXlygAsi9lfkVaKizQgM21ipmUYcxFsqLyjuEsYEkqaEbYoneYaL+MewWY3XceH8HQO1BYVOCdI08dCD4d0vrDnrKCgXvLDGixOgg1H5zvu0z719Z9h/5gqr7XHklh3Gzb8RsMEOxJCg9JXmXevfGc6TNreKfiMna6m9vhKKBU3ID97mbVPFuDtRd4bt9Ho1rnmDv7FVwYNYIZibuJ1muMwFL5zv6Mv1vv9AVMOY05jdQdAXiumlGH7lf0RFs+h/Bp9fxhqoEUkHUe0mGZLMgtCaUCOp6p8Ju/y9QFC+dEV6xdtTV4YEnRmhdu00+vgyupBpSlyhm/Os0DbpFQ0jErqH78/aOKCjXzkS7Ez168kwyEXHH8DX05hteXgvGmAB4oUUYKoHD4ajIoFprSO7cKt9MEgFWzUDkuY2lw+G+aBjElUUh5G/Phcsrp4ghsQ1umqZmCFhzkgKbix431MLTcSkiF2EA6lADRt3hj2wvMswImnW/9hOBdVFhaju2r0bw0WL9N8p1OKdGow/JFObYLf6kbS/YnMvYjhkWRo3Pu2zz8SMHbDhlGS3XSVUxJBtYay408j7yGE0wd6vX6Kw1K8Mc5XTFKhu9CV72U65dwBW+STLNDyIh5ghxWTLA6NoXwfr9xejwP4TWZZEXyZkOGN/Y3sW7/m3yxsLbP/Ju38RopBbyHDPse3MONSabQZ8OSyw+4foXSjVfcyQSzxacS6o8+YcDsywT/7oKGLY41sQ4xhp3x9pWgOzyGbY9CYaNaGO64UMyTuYDlWL1G+5XprrOAisNkzbVCxkGmpxjQsY2a/4ZIWgL0OGZDlbgKoTGUPZlk4eqMPREbm2M+6MIh0bjLrTU6HVAe9Sn1yMFz6okF2rQtTakZW6KkER9St+arLnISh0smGGAVkyGJeQ4Ym/CArXI4pbYYr2hSD9i5xsK1sGxMow9LuUikitJUZlKNpkK7NPnwQKa3wKw9DvUgKxalJ03agij1LDn75O+2I6OD6Dcg4VO1A4lcUduH4VNwKPqsMWxd0b0RqtHLAxnSJLQ3WhrASD2jj22TwRim3q+9LKXcBwIk0fKuZKYba7s6jFDWMDgfYvRH1PQvlPjDY4IoK2FXVPIUapmKCq0Wbb8EfEC2ISlMEb9G9yByn9FMEaKB1xX+jaEzfk/kRN+otSQtMayJBmmWkd5bdEdEmLK3P2nL/B+qFLxg4xuQ53l1CdXONXGZZx2VtRXiOo8toM9E4KsiOrwUN6aLanOlSIIRxmuJE5xd3JRz9W5KVowfMvyHGaKMemnMtFluIRAbxqEVGDg+Q1hNUhOdYWAp+V73IMr33UUy6BqtEznuRzaMPzhBQKDfytrPlZpVAzItnf5ZA22pn+orlWphg6SJAeqFgrR35SaRjxCxvMhWJqAcF8E0z8BDz2qkdtrC/NT7l1NrIXUGsF/jpZXsDeIXegghPxtI4B81FsUl0hymeCY/r8gQpOxE3GzK3D1F6fgJLlg222yq5A58nYp3G5OXO7TaIyMgVfIb8mg0VToS/hsbQsjaFHZ8tjHKOhkodCLB2KaQQHvCsHuhu/LqsPb4hd/i/GfWoQzpV/+kcTFmBZW/h1qC5gqA9L2jQ31KIsHes+bczy77gY+R6ZIlZBggWpl9CmKWeXPmBFb+2xUaQdLDJDjWEiK82iie3SUr5FAvE+JZskOVhD4sYje5ourCsKjmHoW5TxD5PA0dwc1t43w21r+r+sPR2sCR+IZZMWFCKE/mEJHz8NPbI8Ohaz9Ybz45JI80bglAXdsVBiH188TpNF3A2pr9l/X35I1yFvl9I9reeHKdg51kA81pZDrOdW7N3upOlzuTbkIjv9jiIKuiccLyWgHVdMBI0Wi7yhjNfLZlEceFg0vbJSieOlgjFvEmq3ctzpHoHjsGnzVVfp18ENmGDRJo1i3oJ5CyLMu9cQeMdiEa0ZNEMlvYgMEZriki47UEh17sJIxHrPKYqq3rSb5v2fajZ94GzqUGGb4eKOwvTgRCx/SINzeQq+oPWkiJvd5cE/jC7xfQ5VExeVOCX3HIuq6BflFeL8IX8OmIa09x6M2+qd4J3RYW1Z9qm4wClRZYcnDEtY+P5xDliee2xkBousukjX1No1EXd//wHkKSS2KcsSFsqZax6f7nlwIzcWzvdm3aPNd01cIhplMvx48QLFtRgS1QVWZdzr93AUwIlmEYrVeVxPw1cTVYwaOIyEAfeDBVd3h/gp3oHoWtcmcSJNdV3+irKfm35DLBfuZO8VzLzOnrc2EQa2I4f14C1+fkaC95XdivAssJ+rcu98peJWmyjP9o4RmWPBP73VMtFpIHKb2DUlfy20hwBMlrvVl7LWCDMidjHmyDSxUrXsI+etMBHQ/UOBmAI1+LcaYcY6b2ZEfuLWD7VQq1Y4OjX8tuR/dsKFac0YCAZtIIx2q/Nmq9Vnh37XilOl7iKqxPcX539k1+iE2eRo5QJIkEetPkO/BQfU01Oc+n3KlXn+bF1vVSlnbVxlKC+pMGSDHv0WcM8MBzA4yTnGV2yKkP3bnQFOZo/xDXnaj54ZsO+JB1njlIZq5COTm9IuiOFSh1BvQtmuZ99TulW9JLDDpiHisY6YOAZqyHQRkJ+bRpdFondNan6RJVUUYRDZw23S52BTMHA2L9F/WNBDKgA3ocmKDK8vjanKgoIF7DAkekgLo1X8+Hc3vwfFdzJifPvMAvDhGp5kH7Bsw02L77hc1vTiWGB4FIUZgnI008td7Cjzw42UPqpCQwE9W3SXzhhUeKofvyjyL4LYJLkY6VGbBBUwn4hdZsxShJWeqVChZCeFES2ep6dSfwdS0eVZyMPyIXs0QmYuRna2SVlEpec910maJqN/0u7vPjLsuOxsE6lKX7kmVGZaqhh44IDXVjCiy+Ky5+bTbCXfR6KampYunLkYDIkyFsyYBH9uxlBlLbm/F2drmU5VhuotBvww+Qn5OVGSXagYdurN2vfcVDnkbgoiQ8/P+qqAhiw3Uh3YUVMLQ9EBBMY2HdK8NrkhtyuSaewo8MzqWdHRZ2y1Is7ce8EM4WTeIc41w9MfAIKsLgJxbuILhgg/tqnfX8Sx+pKyps96ksizL18wRfhulg7+ObfrCMDBx0XYMvcE0OaXyh4jXLuHbJ5jOXiuKs6CvSOAOoN2K/lii/txf0S6GkzZJAo4JnJQ5wjLXsS7WXobfn+bVSiIKfsZos+ClnwSH7bvNblgfpfJvPGMcSiY581cA8uE+20a8bgDlelmWxqCPUcqvmgmu1SdiB+SNLQHzb1gqi1Gj2t8U+FcfWDqFxceBs1cq7GFeGlYIJ65xsV3I1QCaVNZ2w+9cHFwqdz3kMuxg+63kHZHif1UfBv2u+wJ6GO+bQXdUSLpnhmclCtlTmCoJPgmb8P3zMi4cw1bpnAoO43eiTeQy3BXEJh2LIJqGIbl1Gcyymoq0agMXhOE5b4ntju7Tpbb0nJ/Xu3+7oYdWSG1lcIddmC7s4vp3rWjd/B+95O2o1uaod7nBNGukRSBv7P5Z98z3rvGdHee8xXtRH/rTX93e8VFCE0mE3kR0coGCZhXrHfnsd1/qGYcoSCGJH4DR6Rgkv3+Q8Zwj6WX8IWKsGiIpcI47rCsbJj+BNarfIWVTPhpUMfUFIPnHlKm9FzM0TTA+UZc8Duu6PWLfHfJVnxWWxC33I2cYH2I7RCJFyxz3gfMMSAJN1BXNJObhD84uiXcU947nfOX0BdBNZ1ZuXB24I0Re1MYAfz3cl9LJdihucZM1Bj1vS7Sy4WIRO5WD70Mvj+KNac59LjP5Kpzqpekd58FxM2QPlyMStLQbfXisfq7/qhzRk6jvLuG9QJzsSjh1ROZOBeydNF+tlgV2ahBbzndaRPTkhK+xIX184UpPbGJc0o0H7PloHSJaOD7h9525P1sLucWcnVLXrlgcTlxcdJSaBzbDZn5zWvUbrqOo7cahuTkQb4VlYNhZSAe6HdScVnSnUxyYAOBWCjxPBWuYKgdk3JVcl3ZE00oUAmm1jvCFKvJef+Sa8kfaILJLLh4QJhiKqctvw4iBkyQgWFlKngWH3Wmm8HiRZfU2gyxdJYCkIGQlHjUlsxdi6m7mx9M2R6mEheh6wKcmxAXmnHKAgyoCR6GIlORq3eHVGYjQBK0fncxhpUer3GM7zmuxYumcKk6o/nLWojlc96I8JiYoLzmxk9tzRqbZS81++KZHPiQAavXXDLgsOezOIrpOuyBjWc/1+Ylt33yFK3wlAuumowRuMlTBkhMKj+gNnmiCVwFkT7T/WuqkTBIf+QbM/o3V3qEs+RzA6sN7ZSM7dOmUAsDI86uVN6i1pUFbDs90/Yk+a4PzeKNd/GX7Q5t2jLWMDauV+09IXM4TNQpDt4xJ4FhZdQiL2NjbbZ32Q4RqX6h1hJI3wmVXl+nsGSQuxCgN1p6HVOezVYt7hOTyrCyXeffPF0dG3ScpqPrDWkEsbkWC6uLls8Pmrmtaj2zF8HUljwyVWuK1sUJNwgE81we2kTnWBP2Nk2WLDIHDDQXTi+XaIE4fOWKQVR7f9mpTXl78/pb0VeJBF6pJo/+2M5yrBqEyYDl+NljsRY+GQxDkTOevPZeS2MyLtmGUrpRp79DxTNiSgBrKKdg388wPI+ziWjuvZhfazKTkECX0WxVqSzWTcnhGGw013KKWeQwDA/kvC3xckvVbM/Ld4FdIYthiPK56hs9HXUl1ulIZBjVG3zVzVLbFRtm/cuTVTwWQyrDEMFybrRbYhrEaLWN+VIqvYp8hhF6i6He1jWe/HxVC58YLiRMe8vhFQwjHLzZPs5lQzyrhhUn/vmrOBjxKoYxesvp5TSxXTOus30U2ioYq6qhWbrp2pPTZbp8xdI98FKGV/i9lTfo/A675+91dBPDcf197g5/OwNv1ZNYVEzD/5/gYL2s8R4dAAAAAElFTkSuQmCC",
  },
  {
    name: "Stable Difffusion",
    profile_image_url:
      "https://pbs.twimg.com/profile_images/1634515185300807682/FTOEZDkp_400x400.jpg",
  },
  {
    name: "Mark",
    username: "mark",
    _id: "6436f3032b67ae01b9c884bb",
    profile_image_url: "https://pbs.twimg.com/profile_images/1669924632881942529/uVVtVMaK_400x400.jpg"
  },
  {
    name: "Emily",
    username: "emily",
    _id: "643824151cb80eec2f543e85",
    profile_image_url:
      "https://pbs.twimg.com/profile_images/1653106037262798848/xIwPY8Ws_400x400.jpg",
  },
  {
    name: "Jyoti",
    username: "jyoti",
    _id: "643ae2a7b5cf0cd55b8f4393",
    profile_image_url:
      "https://pbs.twimg.com/profile_images/1512137188988710912/1p11Xf_Y_400x400.jpg",
  },
];

interface SampleEpisode {
  image_url: string;
}

export const sampleEdisodes = [
  {
    image_url:
      "https://i.pinimg.com/736x/42/1e/93/421e93f345c687a24edcc3b4d4a052a3.jpg",
  },
];

export const tweets = [
  {
    id: "1654879487014719488",
    html: `<blockquote class="twitter-tweet" data-theme="light"><p lang="en" dir="ltr"><a href="https://twitter.com/markrachapoom?ref_src=twsrc%5Etfw">@markrachapoom</a> saw your Journal-to-Comic project on Airchat. Impressive. :)</p>&mdash; Ryan Hoover (@rrhoover) <a href="https://twitter.com/rrhoover/status/1654879487014719488?ref_src=twsrc%5Etfw">May 6, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`,
  },
];

export const ryanTweetHtml = `<blockquote class="twitter-tweet" data-theme="light"><p lang="en" dir="ltr"><a href="https://twitter.com/markrachapoom?ref_src=twsrc%5Etfw">@markrachapoom</a> saw your Journal-to-Comic project on Airchat. Impressive. :)</p>&mdash; Ryan Hoover (@rrhoover) <a href="https://twitter.com/rrhoover/status/1654879487014719488?ref_src=twsrc%5Etfw">May 6, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`
export const markQuoteRyanTweetHtml = `<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Shall we soon launch on his Product Hunt <a href="https://twitter.com/mlaparkk?ref_src=twsrc%5Etfw">@mlaparkk</a> <a href="https://twitter.com/jyotiinar?ref_src=twsrc%5Etfw">@jyotiinar</a>?☺️❤️ <a href="https://t.co/SFPxZFwcVm">https://t.co/SFPxZFwcVm</a></p>&mdash; Mark (@markrachapoom) <a href="https://twitter.com/markrachapoom/status/1654882869637152769?ref_src=twsrc%5Etfw">May 6, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`
