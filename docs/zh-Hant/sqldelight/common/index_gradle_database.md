首先在您的專案中應用 Gradle 外掛{% if dialect %} 並據此設定您的資料庫的變體{% endif %}。 {% if async %}請確保在建立您的資料庫時，將 `generateAsync` 設定為 `true`。{% endif %}

=== "Kotlin"
    ```kotlin
    plugins {
      id("app.cash.sqldelight") version "{{ versions.sqldelight }}"
    }

    repositories {
      google()
      mavenCentral()
    }

    sqldelight {
      databases {
        create("Database") {
          packageName.set("com.example"){% if dialect %}
          dialect("{{ dialect }}:{{ versions.sqldelight }}"){% endif %}{% if async %}
          generateAsync.set(true){% endif %}
        }
      }
    }
    ```
=== "Groovy"
    ```groovy
    plugins {
      id "app.cash.sqldelight" version "{{ versions.sqldelight }}"
    }

    repositories {
      google()
      mavenCentral()
    }

    sqldelight {
      databases {
        Database { // This will be the name of the generated database class.
          packageName = "com.example"{% if dialect %}
          dialect "{{ dialect }}:{{ versions.sqldelight }}"{% endif %}{% if async %}
          generateAsync = true{% endif %}
        }
      }
    }
    ```