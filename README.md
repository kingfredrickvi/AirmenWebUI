# Airmen

A UI for the AirmenWebAPI.

To change the settings, edit `/assets/settings.template.json` and move it to `/assets/settings.json`

```
{
    "currentServer": 0,
    "servers": [
        {
            "name": "Server #1",
            "ip": "192.168.1.8"
        },
        {
            "name": "Server #2",
            "ip": "192.168.1.100"
        }
    ]
}
```

`currentServer` controls which server tab is opened by default.

The UI assumes you're running an Nginx reverse proxy on every server serving the WebAPI:7788 to `/api/`.

Example Nginx Reverse

```
    location /api {
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $host;

      proxy_pass http://localhost:7788;
      add_header Access-Control-Allow-Origin *;
      proxy_set_header Access-Control-Allow-Origin *;

      proxy_http_version 1.1;
    }
```

Currently has no authentication. You will need to provide your own (such as LDAP) or firewall the port the web server is running on.

Use `letsencrypt` for SSL if you have a domain or subdomain for your UI.

## Angular Garbage

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.6.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
