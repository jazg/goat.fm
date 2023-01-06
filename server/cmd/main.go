package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

type Item struct {
	PrimaryText   string `json:"primary_text"`
	SecondaryText string `json:"secondary_text"`
}

type GetAlbumsResponse struct {
	Items      []Item `json:"items"`
	TotalCount int    `json:"total_count"`
}

/* func getAlbumsByTag(w http.ResponseWriter, r *http.Request) {
	postBody, _ := json.Marshal(map[string]string{
		"s": "top",
		"p": "1",
		"t": "hip hop",
	})
	responseBody := bytes.NewBuffer(postBody)
	resp, err := http.Post("https://bandcamp.com/api/discover/2/get", "application/json", responseBody)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}
	io.WriteString(w, string(body))
} */

func main() {
	page := 1
	for {
		postBody, _ := json.Marshal(map[string]string{
			"p": fmt.Sprint(page),
			"t": "hip-hop",
		})
		responseBody := bytes.NewBuffer(postBody)
		resp, err := http.Post("https://bandcamp.com/api/discover/2/get", "application/json", responseBody)
		if err != nil {
			panic(err)
		}
		defer resp.Body.Close()
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			panic(err)
		}
		if page == 1 {
			log.Println(string(body))
		}
		var response GetAlbumsResponse
		if err := json.Unmarshal(body, &response); err != nil {
			panic(err)
		}
		log.Println(response)
		if page >= response.TotalCount/48 {
			break
		}
		page++
	}

	/* http.HandleFunc("/albums", getAlbumsByTag)

	if err := http.ListenAndServe(":3333", nil); err != nil {
		panic(err)
	} */
}
