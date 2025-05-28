[//]: # (title: 重新導向)

預設情況下，Ktor 用戶端會重新導向至 `Location` 標頭中提供的 URL。如果需要，您可以停用重新導向。

## 新增依賴項 {id="add_dependencies"}
`HttpRedirect` 僅需要 [ktor-client-core](client-dependencies.md) 構件 (artifact)，無需任何特定的依賴項。

## 停用重新導向 {id="disable"}

要停用重新導向，請在 [用戶端配置區塊](client-create-and-configure.md#configure-client) 中將 `followRedirects` 屬性設定為 `false`：

```kotlin
val client = HttpClient(CIO) {
    followRedirects = false
}
```