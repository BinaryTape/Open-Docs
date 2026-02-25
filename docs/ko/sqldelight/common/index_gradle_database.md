먼저 프로젝트에 Gradle 플러그인을 적용하고{% if dialect %} 데이터베이스의 dialect를 그에 맞춰 설정하세요{% endif %}. {% if async %}데이터베이스를 생성할 때 `generateAsync`를 `true`로 설정해야 합니다.{% endif %}

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
        register("Database") { // 이는 생성될 데이터베이스 클래스의 이름이 됩니다.
          packageName = "com.example"{% if dialect %}
          dialect "{{ dialect }}:{{ versions.sqldelight }}"{% endif %}{% if async %}
          generateAsync = true{% endif %}
        }
      }
    }