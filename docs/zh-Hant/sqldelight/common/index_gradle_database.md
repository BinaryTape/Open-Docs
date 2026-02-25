首先在您的專案中套用 gradle 外掛程式{% if dialect %} 並相應地設定您資料庫的方言{% endif %}。{% if async %}在建立資料庫時，請確保將 `generateAsync` 設定為 `true`。{% endif %}

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
        register("Database") {
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
        register("Database") { // 這將是產生的資料庫類別名稱。
          packageName = "com.example"{% if dialect %}
          dialect "{{ dialect }}:{{ versions.sqldelight }}"{% endif %}{% if async %}
          generateAsync = true{% endif %}
        }
      }
    }