[//]: # (title: 직렬화)

_직렬화(Serialization)_는 애플리케이션에서 사용되는 데이터를 네트워크를 통해 전송되거나 데이터베이스 또는 파일에 저장될 수 있는 형식으로 변환하는 과정입니다. 반대로, _역직렬화(deserialization)_는 외부 소스에서 데이터를 읽어 런타임 객체로 변환하는 반대 과정입니다. 이 둘은 타사와 데이터를 교환하는 대부분의 애플리케이션에 필수적입니다.

[JSON](https://www.json.org/json-en.html)과 [프로토콜 버퍼(protocol buffers)](https://developers.google.com/protocol-buffers)와 같은 일부 데이터 직렬화 형식은 특히 흔합니다. 이들은 언어 중립적이고 플랫폼 중립적이므로 모든 최신 언어로 작성된 시스템 간에 데이터 교환을 가능하게 합니다.

Kotlin에서는 데이터 직렬화 도구를 별도의 구성 요소인 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)에서 사용할 수 있습니다. 이는 `org.jetbrains.kotlin.plugin.serialization` Gradle 플러그인, [런타임 라이브러리](#libraries), 그리고 컴파일러 플러그인으로 구성됩니다.

컴파일러 플러그인은 `kotlinx-serialization-compiler-plugin`과 `kotlinx-serialization-compiler-plugin-embeddable`이며, Maven Central에 직접 게시됩니다. 두 번째 플러그인은 `kotlin-compiler-embeddable` 아티팩트와 함께 작동하도록 설계되었으며, 이는 스크립팅 아티팩트의 기본 옵션입니다. Gradle은 컴파일러 플러그인을 컴파일러 인수로 프로젝트에 추가합니다.

## 라이브러리

`kotlinx.serialization`은 지원되는 모든 플랫폼(JVM, JavaScript, Native)과 JSON, CBOR, 프로토콜 버퍼 등 다양한 직렬화 형식을 위한 라이브러리 세트를 제공합니다. 지원되는 직렬화 형식의 전체 목록은 [아래](#formats)에서 확인할 수 있습니다.

모든 Kotlin 직렬화 라이브러리는 `org.jetbrains.kotlinx:` 그룹에 속합니다. 이름은 `kotlinx-serialization-`로 시작하며 직렬화 형식을 반영하는 접미사가 붙습니다. 예시:
* `org.jetbrains.kotlinx:kotlinx-serialization-json`은 Kotlin 프로젝트에 JSON 직렬화를 제공합니다.
* `org.jetbrains.kotlinx:kotlinx-serialization-cbor`은 CBOR 직렬화를 제공합니다.

플랫폼별 아티팩트는 자동으로 처리되므로 수동으로 추가할 필요가 없습니다. JVM, JS, Native, 그리고 멀티플랫폼 프로젝트에서 동일한 의존성을 사용하세요.

참고로 `kotlinx.serialization` 라이브러리는 자체 버전 관리 구조를 사용하며, 이는 Kotlin의 버전 관리와 일치하지 않습니다. 최신 버전을 찾으려면 [GitHub](https://github.com/Kotlin/kotlinx.serialization/releases)의 릴리스를 확인하세요.

## 형식

`kotlinx.serialization`은 다양한 직렬화 형식을 위한 라이브러리를 포함합니다:

* [JSON](https://www.json.org/): [`kotlinx-serialization-json`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#json)
* [프로토콜 버퍼](https://developers.google.com/protocol-buffers): [`kotlinx-serialization-protobuf`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#protobuf)
* [CBOR](https://cbor.io/): [`kotlinx-serialization-cbor`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#cbor)
* [Properties](https://en.wikipedia.org/wiki/.properties): [`kotlinx-serialization-properties`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#properties)
* [HOCON](https://github.com/lightbend/config/blob/master/HOCON.md): [`kotlinx-serialization-hocon`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#hocon) (JVM에서만 지원)

참고로 JSON 직렬화(`kotlinx-serialization-json`)를 제외한 모든 라이브러리는 [실험적(Experimental)](components-stability.md)이며, 이는 해당 API가 예고 없이 변경될 수 있음을 의미합니다.

[YAML](https://yaml.org/) 또는 [Apache Avro](https://avro.apache.org/)와 같은 더 많은 직렬화 형식을 지원하는 커뮤니티 관리 라이브러리도 있습니다. 사용 가능한 직렬화 형식에 대한 자세한 정보는 [`kotlinx.serialization` 문서](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md)를 참조하세요.

## 예시: JSON 직렬화

Kotlin 객체를 JSON으로 직렬화하는 방법을 살펴보겠습니다.

### 플러그인 및 의존성 추가

시작하기 전에, 프로젝트에서 Kotlin 직렬화 도구를 사용할 수 있도록 빌드 스크립트를 구성해야 합니다:

1. Kotlin 직렬화 Gradle 플러그인 `org.jetbrains.kotlin.plugin.serialization`을 적용합니다 (Kotlin Gradle DSL에서는 `kotlin("plugin.serialization")`).

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    plugins {
        kotlin("jvm") version "%kotlinVersion%"
        kotlin("plugin.serialization") version "%kotlinVersion%"
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    plugins {
        id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
        id 'org.jetbrains.kotlin.plugin.serialization' version '%kotlinVersion%'  
    }
    ```

    </tab>
    </tabs>

2. JSON 직렬화 라이브러리 의존성을 추가합니다: `org.jetbrains.kotlinx:kotlinx-serialization-json:%serializationVersion%`

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:%serializationVersion%")
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    dependencies {
        implementation 'org.jetbrains.kotlinx:kotlinx-serialization-json:%serializationVersion%'
    }
    ```

    </tab>
    </tabs>

이제 코드에서 직렬화 API를 사용할 준비가 되었습니다. API는 `kotlinx.serialization` 패키지와 `kotlinx.serialization.json`과 같은 형식별 하위 패키지에 있습니다.

### JSON 직렬화 및 역직렬화

1. `@Serializable` 어노테이션을 사용하여 클래스를 직렬화 가능하도록 만듭니다.

    ```kotlin
    import kotlinx.serialization.Serializable
    
    @Serializable
    data class Data(val a: Int, val b: String)
    ```

2. `Json.encodeToString()`을 호출하여 이 클래스의 인스턴스를 직렬화합니다.

    ```kotlin
    import kotlinx.serialization.Serializable
    import kotlinx.serialization.json.Json
    import kotlinx.serialization.encodeToString
    
    @Serializable
    data class Data(val a: Int, val b: String)
    
    fun main() {
        val json = Json.encodeToString(Data(42, "str"))
    }
    ```

   결과적으로, 이 객체의 상태를 JSON 형식으로 포함하는 문자열을 얻게 됩니다: `{"a": 42, "b": "str"}`

   > 리스트와 같은 객체 컬렉션도 단일 호출로 직렬화할 수 있습니다:
   > 
   > ```kotlin
   > val dataList = listOf(Data(42, "str"), Data(12, "test"))
   > val jsonList = Json.encodeToString(dataList)
   > ```
   > 
   {style="note"}

3. `decodeFromString()` 함수를 사용하여 JSON에서 객체를 역직렬화합니다:

    ```kotlin
    import kotlinx.serialization.Serializable
    import kotlinx.serialization.json.Json
    import kotlinx.serialization.decodeFromString
    
    @Serializable
    data class Data(val a: Int, val b: String)
    
    fun main() {
        val obj = Json.decodeFromString<Data>("""{"a":42, "b": "str"}""")
    }
    ```

끝입니다! 객체를 JSON 문자열로 성공적으로 직렬화하고 다시 객체로 역직렬화했습니다.

## 다음 단계

Kotlin 직렬화에 대한 더 자세한 정보는 [Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md)를 참조하세요.

다음 자료에서 Kotlin 직렬화의 다양한 측면을 살펴볼 수 있습니다:

* [Kotlin 직렬화 및 핵심 개념에 대해 자세히 알아보기](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/basic-serialization.md)
* [Kotlin의 내장 직렬화 가능 클래스 살펴보기](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes.md)
* [직렬 변환기(serializer)에 대해 자세히 알아보고 커스텀 직렬 변환기를 만드는 방법 배우기](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serializers.md)
* [Kotlin에서 다형성(polymorphic) 직렬화가 어떻게 처리되는지 알아보기](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/polymorphism.md#open-polymorphism)
* [Kotlin 직렬화에 JSON 기능이 어떻게 적용되는지 살펴보기](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/json.md#json-elements)
* [Kotlin에서 지원하는 실험적 직렬화 형식에 대해 자세히 알아보기](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/formats.md)