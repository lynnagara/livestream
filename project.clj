(defproject livestream "0.1.0-SNAPSHOT"
  :description "live stream things"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [org.immutant/web "2.1.5"]
                 [compojure "1.5.1"]
                 [ring/ring-core "1.5.0"]
                 [environ "1.0.3"]]
  :main ^:skip-aot livestream.core
  :target-path "target/%s"
  :profiles {:uberjar {:aot :all}})
