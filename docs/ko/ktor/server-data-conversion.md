[//]: # (title: 데이터 변환)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-data-conversion"/>
<var name="package_name" value="io.ktor.server.plugins.dataconversion"/>
<var name="plugin_name" value="DataConversion"/>
<var name="example_name" value="data-conversion"/>

<tldr>
<include from="lib.topic" element-id="download_example"/>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
Ktor 서버용 %plugin_name% 플러그인을 사용하면 값 목록을 직렬화하고 역직렬화하기 위한 사용자 지정 변환기(converter)를 추가할 수 있습니다.
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-data-conversion/index.html) 플러그인을 사용하면 값 목록을 직렬화하고 역직렬화할 수 있습니다. 기본적으로 Ktor는 [DefaultConversionService](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-default-conversion-service/index.html)를 통해 원시 타입(primitive type)과 열거형(enum)을 처리합니다. 이 서비스를 확장하여 추가적인 타입(type)을 처리하려면 `%plugin_name%` 플러그인을 설치하고 구성하면 됩니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 변환기 추가 {id="add-converters"}

타입(type) 변환을 `%plugin_name%` 설정 내에서 정의할 수 있습니다. 지정된 타입(type)에 대해 `convert<T>` 메서드를 제공하고 사용 가능한 함수를 사용하여 값 목록을 직렬화하고 역직렬화할 수 있습니다:

* `decode()` 함수를 사용하여 값 목록을 역직렬화하세요. 이 함수는 URL의 반복되는 값을 나타내는 문자열 목록을 받아서 디코딩된 값을 반환합니다.

  ```kotlin
  decode { values -> // converter: (values: List<String>) -> Any?
    // 값 역직렬화
  }
  ```

* `encode()` 함수를 사용하여 값을 직렬화하세요. 이 함수는 임의의 값을 받아서 이를 나타내는 문자열 목록을 반환합니다.

  ```kotlin
     encode { value -> // converter: (value: Any?) -> List<String>
       // 값 직렬화
      }
  ```

## 서비스 접근

{id="service"}

현재 컨텍스트에서 `%plugin_name%` 서비스에 접근할 수 있습니다:

```kotlin
val dataConversion = application.conversionService
```

그런 다음 변환기 서비스(converter service)를 사용하여 콜백 함수를 호출할 수 있습니다:

* `fromValues(values: List<String>, type: TypeInfo)` 콜백 함수는 `values`를 문자열 목록으로, 그리고 값을 변환할 `TypeInfo`를 인자로 받아 디코딩된 값을 반환합니다.
* `toValues(value: Any?)` 콜백 함수는 임의의 값을 받아서 이를 나타내는 문자열 목록을 반환합니다.

## 예시

다음 예시에서는 `LocalDate` 타입(type)을 위한 변환기(converter)가 정의되어 값을 직렬화하고 역직렬화하도록 구성됩니다. `encode` 함수가 호출되면, 서비스는 `SimpleDateFormat`을 사용하여 값을 변환하고 포맷된 값이 포함된 목록을 반환합니다. `decode` 함수가 호출되면, 서비스는 날짜를 `LocalDate`로 포맷하고 이를 반환합니다.

```kotlin
```

{src="snippets/data-conversion/src/main/kotlin/dataconversion/Application.kt" include-lines="18-34"}

변환 서비스(conversion service)는 그런 다음 수동으로 호출하여 인코딩되고 디코딩된 값을 검색할 수 있습니다:

```kotlin
```

{src="snippets/data-conversion/src/main/kotlin/dataconversion/Application.kt" include-lines="38-39"}

전체 예시는 다음을 참조하세요: [%example_name%](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%)