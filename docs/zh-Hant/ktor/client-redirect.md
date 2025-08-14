[//]: # (title: 重新導向)

依預設，Ktor 用戶端會重新導向至 `Location` 標頭中提供的 URL。若有需要，您可以停用重新導向。

## 新增依賴項 {id="add_dependencies"}
`HttpRedirect` 只要求 [ktor-client-core](client-dependencies.md) 構件，不需要任何特定的依賴項。

## 停用重新導向 {id="disable"}

若要停用重新導向，請在 [用戶端設定區塊](client-create-and-configure.md#configure-client) 中，將 `followRedirects` 屬性設定為 `false`：

```kotlin
val client = HttpClient(CIO) {
    followRedirects = false
}
```