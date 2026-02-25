まず、プロジェクトにGradleプラグインを適用します{% if dialect %}。そして、それに応じてデータベースのダイアレクト（dialect）を設定してください{% endif %}。{% if async %}データベースを作成する際、`generateAsync` を `true` に設定することを忘れないでください。{% endif %}

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
        register("Database") { // これは生成されるデータベースクラスの名前になります。
          packageName = "com.example"{% if dialect %}
          dialect "{{ dialect }}:{{ versions.sqldelight }}"{% endif %}{% if async %}
          generateAsync = true{% endif %}
        }
      }
    }