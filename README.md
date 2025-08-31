# Gain Stack

A simple workout tracker system.


=============


  Gespeicherter Plan: Gain-Stack Microfrontend-Refactoring

  Ziel-Architektur (4 Ebenen):
   1. Globale Shared-Libs: domain (für Datenmodelle), shared-ui (für geteilte Services wie
      ThemeService).
   2. Feature-Libs: dashboard-feature, exercises-feature, etc. Enthalten die reine Feature-Logik und
      -Komponenten, entkoppelt von Microfrontend-Details.
   3. Remote-Apps (Wrapper): dashboard-remote, exercises-remote, etc. Dünne, lauffähige
      Angular-Anwendungen, die die zugehörige Feature-Lib wrappen und via Module Federation als
      Microfrontend bereitstellen.
   4. Host-App: gain-stack-app. Die Haupt-Anwendung, die als leere Shell dient und die Remote-Apps zur
      Laufzeit lädt.

  Umsetzungsschritte:
   1. Erstelle die globalen Shared-Libs (domain, shared-ui).
   2. Erstelle die 5 Feature-Libs (z.B. exercises-feature).
   3. Migriere den bestehenden Feature-Code aus gain-stack-app in die jeweiligen Feature-Libs und passe
      die Imports an.
   4. Erstelle die 5 Remote-Apps (z.B. exercises-remote), die die Komponenten aus den Feature-Libs
      laden.
   5. Konfiguriere die Host-App (gain-stack-app) und die Remote-Apps mit
      @angular-architects/module-federation.
   6. Passe das Routing in der Host-App an, um die Remotes per Lazy Loading zu laden.
   7. Bereinige das alte Projekt gain-stack-app.

=============