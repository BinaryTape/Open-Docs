import{_ as k,C as a,c as r,o as E,ag as p,G as s,w as n}from"./chunks/framework.Bksy39di.js";const C=JSON.parse('{"title":"導覽與路由","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/kmp/compose-navigation-routing.md","filePath":"zh-Hant/kmp/compose-navigation-routing.md","lastUpdated":1755516278000}'),o={name:"zh-Hant/kmp/compose-navigation-routing.md"};function d(g,i,c,y,F,m){const e=a("secondary-label"),t=a("code-block"),l=a("TabItem"),h=a("Tabs");return E(),r("div",null,[i[0]||(i[0]=p("",13)),s(e,{ref:"Experimental"},null,512),i[1]||(i[1]=p("",18)),s(h,null,{default:n(()=>[s(l,{title:"Kotlin/Wasm"},{default:n(()=>[s(t,{lang:"Kotlin",code:`        @OptIn(
            ExperimentalComposeUiApi::class,
            ExperimentalBrowserHistoryApi::class,
            ExperimentalSerializationApi::class
        )
        fun main() {
            val body = document.body ?: return
            ComposeViewport(body) {
                App(
                    onNavHostReady = { navController ->
                        // 存取目前 URL 的片段子字串
                        val initRoute = window.location.hash.substringAfter('#', "")
                        when {
                            // 識別對應的路由並導覽至該路由
                            initRoute.startsWith("start") -> {
                                navController.navigate(StartScreen)
                            }
                            initRoute.startsWith("find_id") -> {
                                // 在導覽至該路由之前，解析字串以提取路由參數
                                val id = initRoute.substringAfter("find_id_").toLong()
                                navController.navigate(Id(id))
                            }
                            initRoute.startsWith("patient") -> {
                                val name = initRoute.substringAfter("patient_").substringBefore("_")
                                val id = initRoute.substringAfter("patient_").substringAfter("_").toLong()
                                navController.navigate(Patient(name, id))
                            }
                        }
                        window.bindToNavigation(navController) { ... }
                    }
                )
            }
        }`})]),_:1}),s(l,{title:"Kotlin/JS"},{default:n(()=>[s(t,{lang:"kotlin",code:`        @OptIn(
            ExperimentalComposeUiApi::class,
            ExperimentalBrowserHistoryApi::class,
            ExperimentalSerializationApi::class
        )
        fun main() {
            onWasmReady {
                val body = document.body ?: return@onWasmReady
                ComposeViewport(body) {
                    App(
                        onNavHostReady = { navController ->
                            // 存取目前 URL 的片段子字串
                            val initRoute = window.location.hash.substringAfter('#', "")
                            when {
                                // 識別對應的路由並導覽至該路由
                                initRoute.startsWith("start") -> {
                                    navController.navigate(StartScreen)
                                }
                                initRoute.startsWith("find_id") -> {
                                    // 在導覽至該路由之前，解析字串以提取路由參數
                                    val id = initRoute.substringAfter("find_id_").toLong()
                                    navController.navigate(Id(id))
                                }
                                initRoute.startsWith("patient") -> {
                                    val name = initRoute.substringAfter("patient_").substringBefore("_")
                                    val id = initRoute.substringAfter("patient_").substringAfter("_").toLong()
                                    navController.navigate(Patient(name, id))
                                }
                            }
                            window.bindToNavigation(navController) { ... }
                        }
                    )
                }
            }
        }`})]),_:1})]),_:1})])}const A=k(o,[["render",d]]);export{C as __pageData,A as default};
