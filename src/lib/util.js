export async function getJsonResponse(url) {
  console.log("fetching with get", url);
  const response = await fetch(url, { method: "GET" })
    // .catch((error) => {
    //   alert(error);
    //   return;
    // })
    .then((resp) => {
      if (resp.status == 200) {
        return resp.json();
      } else if (resp.status == 422) {
        // unprocessable entity
        console.warn(resp.json());
        return resp.json();
      } else {
        throw new Error("got back " + resp.json());
      }
    })
    .then((data) => {
      return data;
    });

  return response;
}

export async function postJsonResponse(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((resp) => {
      if (resp.status == 200) {
        return resp.json();
      } else if (resp.status == 422) {
        // unprocessable entity
        console.warn(resp.json());
        return resp.json();
      } else {
        throw new Error("got back " + resp.json());
      }
    })
    .then((data) => {
      return data;
    });
  return response;
}

// https://stackoverflow.com/a/1349426/7486933
export function randomString(length) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function deepCopy(object) {
  return JSON.parse(JSON.stringify(object));
}

export const get = (object, path = "") =>
  path.split(".").reduce((o, x) => (o == undefined ? o : o[x]), object);

export const del = (obj, keys) => {
  if (Array.isArray(keys)) {
    keys.forEach((e) => delete obj[e]);
  } else {
    delete obj[keys];
  }
  return obj;
};

export const flatten = (a) =>
  Array.isArray(a) ? [].concat(...a.map(flatten)) : a;

export function cleanObject(obj) {
  return Object.entries(obj)
    .filter(([_, v]) => v != "" && v != null)
    .reduce(
      (acc, [k, v]) => ({ ...acc, [k]: v === Object(v) ? cleanObject(v) : v }),
      {}
    );
}

export function titleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export const getTruthy = (obj, path = "") => {
  let m = get(obj, path);
  return m === undefined ? false : m;
};

export const filter = (obj, includes = [], excludes = []) => {
  const filtered = Object.keys(obj)
    .filter((key) => (includes.length ? includes.includes(key) : true))
    .filter((key) => !excludes.includes(key))
    .reduce((newobj, key) => {
      return {
        ...newobj,
        [key]: obj[key],
      };
    }, {});
  return filtered;
};
