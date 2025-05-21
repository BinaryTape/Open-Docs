---
title: 직렬화
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

*Serialization*은 애플리케이션에서 사용하는 데이터를 네트워크를 통해 전송하거나 데이터베이스 또는 파일에 저장할 수 있는 형식으로 변환하는 프로세스입니다. 반대로, *deserialization*은 외부 소스에서 데이터를 읽어 런타임 객체로 변환하는 반대 프로세스입니다. 이 두 가지 프로세스는 타사와 데이터를 교환하는 대부분의 애플리케이션에 필수적입니다.

[JSON](https://www.json.org/json-en.html) 및 [protocol buffers](https://developers.google.com/protocol-buffers)와 같은 일부 데이터 serialization 형식은 특히 일반적입니다. 언어와 플랫폼에 구애받지 않아 현대적인 언어로 작성된 시스템 간의 데이터 교환이 가능합니다.

Kotlin에서는 데이터 serialization 도구를 별도의 컴포넌트인 [kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization)에서 사용할 수 있습니다.
이 컴포넌트는 `org.jetbrains.kotlin.plugin.serialization` Gradle 플러그인, [런타임 라이브러리](#libraries) 및 컴파일러 플러그인으로 구성됩니다.

컴파일러 플러그인인 `kotlinx-serialization-compiler-plugin`과 `kotlinx-serialization-compiler-plugin-embeddable`은
Maven Central에 직접 게시됩니다. 두 번째 플러그인은 스크립팅 아티팩트의 기본 옵션인 `kotlin-compiler-embeddable`
아티팩트와 함께 작동하도록 설계되었습니다. Gradle은 컴파일러 플러그인을 컴파일러 인수로 프로젝트에 추가합니다.

## Libraries

`kotlinx.serialization`은 지원되는 모든 플랫폼(JVM, JavaScript, Native)과 다양한
serialization 형식(JSON, CBOR, protocol buffers 등)에 대한 라이브러리 세트를 제공합니다. 지원되는 serialization 형식의 전체 목록은
[아래](#formats)에서 확인할 수 있습니다.

모든 Kotlin serialization 라이브러리는 `org.jetbrains.kotlinx:` 그룹에 속합니다. 이름은 `kotlinx-serialization-`로 시작하고
serialization 형식을 반영하는 접미사가 붙습니다. 예:
* `org.jetbrains.kotlinx:kotlinx-serialization-json`은 Kotlin 프로젝트에 대한 JSON serialization을 제공합니다.
* `org.jetbrains.kotlinx:kotlinx-serialization-cbor`는 CBOR serialization을 제공합니다.

플랫폼별 아티팩트는 자동으로 처리되므로 수동으로 추가할 필요가 없습니다. JVM, JS, Native 및 멀티 플랫폼 프로젝트에서 동일한 종속성을 사용합니다.

`kotlinx.serialization` 라이브러리는 Kotlin의 버전 관리와 일치하지 않는 자체 버전 관리 구조를 사용합니다.
최신 버전을 확인하려면 [GitHub](https://github.com/Kotlin/kotlinx.serialization/releases)에서 릴리스를 확인하세요.

## Formats

`kotlinx.serialization`에는 다양한 serialization 형식에 대한 라이브러리가 포함되어 있습니다.

* [JSON](https://www.json.org/): [`kotlinx-serialization-json`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README#json)
* [Protocol buffers](https://developers.google.com/protocol-buffers): [`kotlinx-serialization-protobuf`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README#protobuf)
* [CBOR](https://cbor.io/): [`kotlinx-serialization-cbor`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README#cbor)
* [Properties](https://en.wikipedia.org/wiki/.properties): [`kotlinx-serialization-properties`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README#properties)
* [HOCON](https://github.com/lightbend/config/blob/master/HOCON): [`kotlinx-serialization-hocon`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README#hocon) (JVM에서만 사용 가능)

JSON serialization(`kotlinx-serialization-json`)을 제외한 모든 라이브러리는 [Experimental](components-stability)이므로
API가 예고 없이 변경될 수 있습니다.

[YAML](https://yaml.org/) 또는 [Apache Avro](https://avro.apache.org/)와 같은 더 많은 serialization 형식을 지원하는 커뮤니티 유지 관리 라이브러리도 있습니다. 사용 가능한 serialization 형식에 대한 자세한 내용은
[`kotlinx.serialization` documentation](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README)을 참조하세요.

## Example: JSON serialization

Kotlin 객체를 JSON으로 serialize하는 방법을 살펴보겠습니다.

### Add plugins and dependencies

시작하기 전에 프로젝트에서 Kotlin serialization 도구를 사용할 수 있도록 빌드 스크립트를 구성해야 합니다.

1. Kotlin serialization Gradle 플러그인 `org.jetbrains.kotlin.plugin.serialization`(또는 Kotlin Gradle DSL에서 `kotlin("plugin.serialization")`)을 적용합니다.

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    plugins {
        kotlin("jvm") version "2.1.20"
        kotlin("plugin.serialization") version "2.1.20"
    }
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    plugins {
        id 'org.jetbrains.kotlin.jvm' version '2.1.20'
        id 'org.jetbrains.kotlin.plugin.serialization' version '2.1.20'  
    }
    ```

    </TabItem>
    </Tabs>

2. JSON serialization 라이브러리 종속성:`org.jetbrains.kotlinx:kotlinx-serialization-json:1.8.0`을 추가합니다.

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.8.0")
    } 
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    dependencies {
        implementation 'org.jetbrains.kotlinx:kotlinx-serialization-json:1.8.0'
    } 
    ```

    </TabItem>
    </Tabs>

이제 코드에서 serialization API를 사용할 준비가 되었습니다. API는 `kotlinx.serialization` 패키지
및 `kotlinx.serialization.json`과 같은 형식별 하위 패키지에 있습니다.

### Serialize and deserialize JSON

1. `@Serializable`로 주석을 달아 클래스를 serialize 가능하게 만듭니다.

```kotlin
import kotlinx.serialization.Serializable

@Serializable
data class Data(val a: Int, val b: String)
```

2. `Json.encodeToString()`을 호출하여 이 클래스의 인스턴스를 serialize합니다.

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

결과적으로 JSON 형식으로 이 객체의 상태를 포함하는 문자열인 `{"a": 42, "b": "str"}`을 얻을 수 있습니다.

:::note
목록과 같은 객체 컬렉션을 단일 호출로 serialize할 수도 있습니다.

```kotlin
val dataList = listOf(Data(42, "str"), Data(12, "test"))
val jsonList = Json.encodeToString(dataList)
```

:::

3. `decodeFromString()` 함수를 사용하여 JSON에서 객체를 deserialize합니다.

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

그게 다입니다! 객체를 JSON 문자열로 성공적으로 serialize하고 다시 객체로 deserialize했습니다.

## What's next

Kotlin의 serialization에 대한 자세한 내용은 [Kotlin Serialization Guide](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide)를 참조하세요.

다음 리소스에서 Kotlin serialization의 다양한 측면을 살펴볼 수 있습니다.

* [Kotlin serialization 및 핵심 개념에 대해 자세히 알아보기](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/basic-serialization)
* [Kotlin의 기본 제공 serialize 가능 클래스 살펴보기](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes)
* [serializers에 대해 자세히 살펴보고 사용자 지정 serializers를 만드는 방법 알아보기](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serializers)
* [Kotlin에서 다형성 serialization이 처리되는 방식 알아보기](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/polymorphism#open-polymorphism)
* [Kotlin serialization을 처리하는 다양한 JSON 기능 살펴보기](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/json#json-elements)
* [Kotlin에서 지원하는 실험적 serialization 형식에 대해 자세히 알아보기](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/formats)