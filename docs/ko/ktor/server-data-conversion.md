[//]: # (title: 데이터 변환)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-data-conversion"/>
<var name="package_name" value="io.ktor.server.plugins.dataconversion"/>
<var name="plugin_name" value="DataConversion"/>
<var name="example_name" value="data-conversion"/>

<tldr>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">네이티브 서버</Links> 지원</b>: ✅
    </p>
    
</tldr>

<link-summary>
Ktor 서버용 %plugin_name% 플러그인을 사용하면 값 목록을 직렬화하고 역직렬화하기 위한 사용자 지정 컨버터를 추가할 수 있습니다.
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-data-conversion/index.html) 플러그인을 사용하면 값 목록을 직렬화하고 역직렬화할 수 있습니다. 기본적으로 Ktor는 [DefaultConversionService](https://api.ktor.io/ktor-utils/io.ktor.util.converters/-default-conversion-service/index.html)를 통해 기본(원시) 타입과 열거형을 처리합니다. `%plugin_name%` 플러그인을 설치하고 구성하여 이 서비스를 확장하여 추가 타입을 처리할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>을 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다:
    </p>
    

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

## %plugin_name% 설치 {id="install_plugin"}

    <p>
        애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면, 지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 전달하세요.
        아래 코드 스니펫은 <code>%plugin_name%</code>을 설치하는 방법을 보여줍니다...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 함수 호출 내부에.
        </li>
        <li>
            ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내부에.
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

## 컨버터 추가 {id="add-converters"}

`%plugin_name%` 구성 내에서 타입 변환을 정의할 수 있습니다. 지정된 타입에 대한 `convert<T>` 메서드를 제공하고 사용 가능한 함수를 사용하여 값 목록을 직렬화 및 역직렬화합니다.

* 값 목록을 역직렬화하려면 `decode()` 함수를 사용합니다. 이 함수는 URL의 반복되는 값을 나타내는 문자열 목록을 가져와서 디코딩된 값을 반환합니다.

  ```kotlin
  decode { values -> // converter: (values: List<String>) -> Any?
    //deserialize values
  }
  ```

* 값을 직렬화하려면 `encode()` 함수를 사용합니다. 이 함수는 임의의 값을 가져와서 이를 나타내는 문자열 목록을 반환합니다.

  ```kotlin
     encode { value -> // converter: (value: Any?) -> List<String>
       //serialize value
      }
  ```

## 서비스에 접근 {id="service"}

현재 컨텍스트에서 `%plugin_name%` 서비스에 접근할 수 있습니다.

```kotlin
val dataConversion = application.conversionService
```

그런 다음 컨버터 서비스를 사용하여 콜백 함수를 호출할 수 있습니다.

* `fromValues(values: List<String>, type: TypeInfo)` 콜백 함수는 `values`를 문자열 목록으로, 그리고 값을 변환할 `TypeInfo`를 인자로 받아 디코딩된 값을 반환합니다.
* `toValues(value: Any?)` 콜백 함수는 임의의 값을 인자로 받아 이를 나타내는 문자열 목록을 반환합니다.

## 예시

다음 예시에서는 `LocalDate` 타입에 대한 컨버터가 정의되고 값을 직렬화 및 역직렬화하도록 구성됩니다. `encode` 함수가 호출되면 서비스는 `SimpleDateFormat`을 사용하여 값을 변환하고, 포맷된 값을 포함하는 목록을 반환합니다. `decode` 함수가 호출되면 서비스는 날짜를 `LocalDate`로 포맷하여 반환합니다.

[object Promise]

변환 서비스는 인코딩 및 디코딩된 값을 검색하기 위해 수동으로 호출될 수 있습니다.

[object Promise]

전체 예시는 다음을 참조하세요: [%example_name%](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%)