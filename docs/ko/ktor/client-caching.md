[//]: # (title: 캐싱)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-caching"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
HttpCache 플러그인을 사용하면 이전에 가져온 리소스를 인메모리 또는 영구 캐시에 저장할 수 있습니다.
</link-summary>

Ktor 클라이언트는 이전에 가져온 리소스를 인메모리 또는 영구 캐시에 저장할 수 있도록 [HttpCache](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cache/-http-cache/index.html) 플러그인을 제공합니다.

## 의존성 추가 {id="add_dependencies"}
`HttpCache`는 [ktor-client-core](client-dependencies.md) 아티팩트만 필요로 하며 특정 의존성을 필요로 하지 않습니다.

## 인메모리 캐시 {id="memory_cache"}
`HttpCache`를 설치하려면 [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내부에서 `install` 함수에 전달합니다.
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.cache.*
//...
val client = HttpClient(CIO) {
    install(HttpCache)
}
```

이것만으로도 클라이언트가 이전에 가져온 리소스를 인메모리 캐시에 저장할 수 있게 됩니다.
예를 들어, `Cache-Control` 헤더가 구성된 리소스에 대해 연속적으로 두 번의 [요청](client-requests.md)을 할 경우, 클라이언트는 첫 번째 요청만 실행하고 데이터가 이미 캐시에 저장되어 있기 때문에 두 번째 요청은 건너뜁니다.

## 영구 캐시 {id="persistent_cache"}

Ktor를 사용하면 [CacheStorage](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cache.storage/-cache-storage/index.html) 인터페이스를 구현하여 영구 캐시를 생성할 수 있습니다.
JVM에서는 [FileStorage](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.cache.storage/-file-storage.html) 함수를 호출하여 파일 스토리지를 생성할 수 있습니다.

파일 캐시 스토리지를 생성하려면 `File` 인스턴스를 `FileStorage` 함수에 전달합니다.
그런 다음, 이 스토리지가 공유 캐시로 사용되는지 비공개 캐시로 사용되는지에 따라 생성된 스토리지를 `publicStorage` 또는 `privateStorage` 함수에 전달합니다.

```kotlin
```
{src="snippets/client-caching/src/main/kotlin/com/example/Application.kt" include-lines="18-22,24"}

> 전체 예제는 여기에서 찾을 수 있습니다: [client-caching](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-caching).