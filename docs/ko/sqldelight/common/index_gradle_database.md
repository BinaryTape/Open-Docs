먼저 프로젝트에 Gradle 플러그인을 적용합니다{% if dialect %} 그리고 데이터베이스의 다이얼렉트를 그에 맞게 설정합니다{% endif %}. {% if async %}데이터베이스를 생성할 때 `generateAsync`를 `true`로 설정해야 합니다.{% endif %} 

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
        Database { // 이는 생성될 데이터베이스 클래스의 이름이 됩니다.
          packageName = "com.example"{% if dialect %}
          dialect "{{ dialect }}:{{ versions.sqldelight }}"{% endif %}{% if async %}
          generateAsync = true{% endif %}
        }
      }
    }