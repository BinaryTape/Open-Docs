[//]: # (title: 캐싱)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-caching"/>
<p>
    <b>코드 예제</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
HttpCache 플러그인을 사용하면 이전에 가져온 리소스를 인메모리 또는 영구 캐시에 저장할 수 있습니다.
</link-summary>

Ktor 클라이언트는 이전에 가져온 리소스를 인메모리 또는 영구 캐시에 저장할 수 있는 [HttpCache](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins.cache/-http-cache/index.html) 플러그인을 제공합니다.

## 의존성 추가 {id="add_dependencies"}
`HttpCache`는 [ktor-client-core](client-dependencies.md) 아티팩트만 필요하며 별도의 특정 의존성은 필요하지 않습니다.

## 인메모리 캐시 {id="memory_cache"}
`HttpCache`를 설치하려면, [클라이언트 설정 블록](client-create-and-configure.md#configure-client) 내부의 `install` 함수에 전달하세요:
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.cache.*
//...
val client = HttpClient(CIO) {
    install(HttpCache)
}
```

이것만으로도 클라이언트가 이전에 가져온 리소스를 인메모리 캐시에 저장할 수 있도록 설정하기에 충분합니다.
예를 들어, `Cache-Control` 헤더가 설정된 리소스에 대해 두 번의 연속적인 [요청](client-requests.md)을 보내는 경우, 
데이터가 이미 캐시에 저장되어 있으므로 클라이언트는 첫 번째 요청만 실행하고 두 번째 요청은 건너뜁니다.

## 영구 캐시 {id="persistent_cache"}

Ktor에서는 [CacheStorage](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins.cache.storage/-cache-storage/index.html) 인터페이스를 구현하여 영구 캐시를 생성할 수 있습니다.
JVM에서는 [FileStorage](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins.cache.storage/-file-storage.html) 함수를 호출하여 파일 스토리지를 생성할 수 있습니다.

파일 캐시 스토리지를 생성하려면 `File` 인스턴스를 `FileStorage` 함수에 전달하세요.
그런 다음, 이 스토리지가 공유(shared) 캐시로 사용되는지 또는 프라이빗(private) 캐시로 사용되는지에 따라 생성된 스토리지를 `publicStorage` 또는 `privateStorage` 함수에 전달하세요.

```kotlin
val client = HttpClient(CIO) {
    install(HttpCache) {
        val cacheFile = Files.createDirectories(Paths.get("build/cache")).toFile()
        publicStorage(FileStorage(cacheFile))
    }
}
```

> 전체 예제는 여기에서 확인할 수 있습니다: [client-caching](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/client-caching).